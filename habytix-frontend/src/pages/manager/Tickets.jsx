import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ManagerLayout from "../../layouts/ManagerLayout";
import axios from "axios";
import { motion } from "framer-motion";

/* ------------------ Skeleton ------------------ */
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
);

/* ------------------ Status Badge ------------------ */
const StatusBadge = ({ status }) => {
  const colors = {
    OPEN: "bg-green-500",
    IN_PROGRESS: "bg-yellow-500",
    CLOSED: "bg-gray-500",
  };

  return (
    <motion.span
      whileHover={{ scale: 1.1 }}
      className={`px-3 py-1 rounded-full text-xs font-medium text-white ${colors[status]}`}
    >
      {status}
    </motion.span>
  );
};

/* ------------------ Priority Badge ------------------ */
const PriorityBadge = ({ priority }) => {
  const colors = {
    HIGH: "bg-gradient-to-r from-red-500 to-red-400",
    MEDIUM: "bg-gradient-to-r from-yellow-400 to-yellow-300",
    LOW: "bg-gradient-to-r from-green-400 to-green-300",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${colors[priority] || "bg-gray-400"
        }`}
    >
      {priority}
    </span>
  );
};

/* ------------------ Main Component ------------------ */
export default function ManagerTickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [staffMap, setStaffMap] = useState({});
  const [tenantMap, setTenantMap] = useState({});
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [statusFilter, tickets]);

  /* ------------------ Fetch Data ------------------ */
  const fetchAllData = async () => {
    try {
      const [ticketsRes, staffRes, tenantRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/tickets`),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/role/staff`),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/role/tenant`),
      ]);

      const normalizedTickets = (ticketsRes.data || []).map((t) => ({
        ...t,
        tenantId: t.tenantId ?? t.tenant_id,
        assignedTo: t.assignedTo ?? t.assigned_to,
        createdAt: t.createdAt ?? t.created_at,
      }));

      const sortedTickets = sortTickets(normalizedTickets);

      setTickets(sortedTickets);
      setFilteredTickets(sortedTickets);

      // Build staffId → fullName map
      const staffLookup = {};
      staffRes.data.forEach((s) => {
        staffLookup[s.id] = s.fullName || s.full_name;
      });
      setStaffMap(staffLookup);

      // Build tenantId → fullName map
      const tenantLookup = {};
      tenantRes.data.forEach((t) => {
        tenantLookup[t.id] = t.fullName || t.full_name;
      });
      setTenantMap(tenantLookup);
    } catch (err) {
      console.error("Failed to load manager data", err);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ Helpers ------------------ */
  const sortTickets = (tickets) => {
    const order = { OPEN: 1, IN_PROGRESS: 2, CLOSED: 3 };

    return [...tickets].sort((a, b) => {
      const diff = order[a.status] - order[b.status];
      if (diff !== 0) return diff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  const applyFilter = () => {
    if (statusFilter === "ALL") {
      setFilteredTickets(tickets);
    } else {
      setFilteredTickets(tickets.filter((t) => t.status === statusFilter));
    }
  };

  const getTenantName = (id) => tenantMap[id] || "-";
  const getStaffName = (id) => staffMap[id] || "-";

  /* ------------------ UI ------------------ */
  return (
    <ManagerLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">All Tickets</h1>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="ALL">All Status</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
          No tickets match the selected filter.
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-gray-600">
                <tr>
                  <th className="p-4 text-left">Tenant</th>
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-left">Priority</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Assigned To</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredTickets.map((t) => (
                  <motion.tr
                    key={t.id}
                    whileHover={{ scale: 1.01, y: -1 }}
                    transition={{ type: "spring", stiffness: 260 }}
                    className="border-t cursor-pointer"
                    onClick={() => navigate(`/manager/tickets/${t.id}`)}
                  >
                    <td className="p-4">{getTenantName(t.tenantId)}</td>
                    <td className="p-4 font-medium">{t.title}</td>
                    <td className="p-4">
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td className="p-4">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="p-4">
                      {t.assignedTo ? getStaffName(t.assignedTo) : "-"}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/manager/tickets/${t.id}`);
                        }}
                        className="text-indigo-600 hover:underline font-medium"
                      >
                        Manage
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {filteredTickets.map((t) => (
              <motion.div
                key={t.id}
                className="bg-white rounded-xl shadow p-4 space-y-3 cursor-pointer transition-transform transform hover:-translate-y-1 hover:shadow-lg"
                onClick={() => navigate(`/manager/tickets/${t.id}`)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">{t.title}</h3>
                  <StatusBadge status={t.status} />
                </div>

                <p className="text-sm text-gray-600">
                  <strong>Tenant:</strong> {getTenantName(t.tenantId)}
                </p>

                <p className="text-sm text-gray-600">
                  <strong>Priority:</strong>{" "}
                  <PriorityBadge priority={t.priority} />
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/manager/tickets/${t.id}`);
                  }}
                  className="text-indigo-600 text-sm font-medium hover:underline"
                >
                  Manage →
                </button>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </ManagerLayout>
  );
}
