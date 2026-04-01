import { useEffect, useState } from "react";
import api from "../../api/axios";
import ManagerLayout from "../../layouts/ManagerLayout";
import { motion } from "framer-motion";
import StatusPieChart from "../../components/charts/StatusPieChart";
import PageHeader from "../../components/PageHeader";
import { useNavigate } from "react-router-dom";
import {
  Ticket,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

/* ---------- Skeleton ---------- */
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
);

/* ---------- Stat Card ---------- */
const StatCard = ({ title, value, icon: Icon, color, loading }) => (
  <motion.div
    whileHover={{ y: -6, scale: 1.03 }}
    transition={{ type: "spring", stiffness: 260 }}
    className="bg-white rounded-2xl shadow p-6 flex items-center gap-5 hover:shadow-xl"
  >
    <div className={`p-4 rounded-xl ${color}`}>
      <Icon className="text-white" size={24} />
    </div>

    <div className="flex-1">
      <p className="text-sm text-gray-500">{title}</p>
      {loading ? (
        <Skeleton className="h-7 w-16 mt-2" />
      ) : (
        <h2 className="text-2xl font-bold text-gray-800">
          {value}
        </h2>
      )}
    </div>
  </motion.div>
);

export default function ManagerDashboard() {
  const [tickets, setTickets] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [ticketRes, tenantRes, staffRes] = await Promise.all([
        api.get("/api/tickets"),
        api.get("/api/users/role/tenant"),
        api.get("/api/users/role/staff"),
      ]);

      const normalizedTickets = (ticketRes.data || []).map((t) => ({
  ...t,
  tenantId: t.tenantId ?? t.tenant_id,
  assignedTo: t.assignedTo ?? t.assigned_to,
}));

setTickets(normalizedTickets);
      setTenants(tenantRes.data);
      setStaff(staffRes.data);
    } catch (err) {
      console.error("Dashboard fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- ID → NAME MAPS ---------- */
  const tenantMap = Object.fromEntries(
    tenants.map((t) => [t.id, t.fullName || t.full_name])
  );

  const staffMap = Object.fromEntries(
    staff.map((s) => [s.id, s.fullName || s.full_name])
  );

  const total = tickets.length;
  const open = tickets.filter((t) => t.status === "OPEN").length;
  const progress = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const closed = tickets.filter((t) => t.status === "CLOSED").length;

  const chartData = [
    { name: "Open", value: open },
    { name: "In Progress", value: progress },
    { name: "Closed", value: closed },
  ];

  return (
    <ManagerLayout>
      <PageHeader
        title="Manager Dashboard"
        subtitle="Overview of maintenance activity and requests"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Tickets" value={total} icon={Ticket} color="bg-indigo-600" loading={loading} />
        <StatCard title="Open" value={open} icon={AlertCircle} color="bg-green-500" loading={loading} />
        <StatCard title="In Progress" value={progress} icon={Clock} color="bg-yellow-500" loading={loading} />
        <StatCard title="Closed" value={closed} icon={CheckCircle} color="bg-gray-500" loading={loading} />
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tickets */}
        <motion.div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Tickets
          </h2>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : tickets.length === 0 ? (
            <p className="text-sm text-gray-500">No tickets yet.</p>
          ) : (
            <ul className="space-y-3">
              {tickets.slice(0, 5).map((t) => (
                <motion.li
                  key={t.id}
                  whileHover={{ x: 6 }}
                  onClick={() => navigate(`/manager/tickets/${t.id}`)}
                  className="flex justify-between items-center p-3 rounded-lg cursor-pointer hover:bg-slate-50 transition"
                >
                  <div>
                    <p className="font-medium text-gray-700">
                      {t.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      Tenant: {tenantMap[t.tenantId] || "Unknown"}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                      t.status === "OPEN"
                        ? "bg-green-500"
                        : t.status === "IN_PROGRESS"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {t.status}
                  </span>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>

        {/* Status Chart */}
        <motion.div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Ticket Status
          </h2>

          {loading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <StatusPieChart data={chartData} />
          )}
        </motion.div>
      </div>
    </ManagerLayout>
  );
}
