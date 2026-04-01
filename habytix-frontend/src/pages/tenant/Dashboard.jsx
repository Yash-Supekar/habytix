import { useEffect, useState } from "react";
import TenantLayout from "../../layouts/TenantLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageHeader from "../../components/PageHeader";

/* ---------- Status Badge ---------- */
const StatusBadge = ({ status }) => {
  const styles = {
    OPEN: "bg-green-500",
    IN_PROGRESS: "bg-yellow-500",
    CLOSED: "bg-gray-500",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
};

/* ---------- Skeleton ---------- */
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
);

/* ---------- Tenant Dashboard ---------- */
export default function TenantDashboard() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("habytixUser"));

  useEffect(() => {
    if (!user) navigate("/login");
    else fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/tickets/tenant/${user.id}`
      );
      setTickets(sortTickets(res.data));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sortTickets = (tickets) => {
    const priority = { OPEN: 1, IN_PROGRESS: 2, CLOSED: 3 };
    return [...tickets].sort((a, b) => {
      const diff = priority[a.status] - priority[b.status];
      if (diff !== 0) return diff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  const ticketCounts = tickets.reduce(
    (acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    },
    { OPEN: 0, IN_PROGRESS: 0, CLOSED: 0 }
  );

  const totalTickets = tickets.length;

  return (
    <TenantLayout>
      {/* Header + New Request */}
      <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <PageHeader
          title="Tenant Dashboard"
          subtitle="Track your maintenance requests and updates"
        />

        <button
          onClick={() => navigate("/tenant/tickets/new")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-sm hover:scale-[1.02]"
        >
          + New Request
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
        {["OPEN", "IN_PROGRESS", "CLOSED"].map((status, idx) => (
          <motion.div
            key={status}
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "tween", duration: 0.15 }}
            className="bg-white shadow-md rounded-2xl p-5 flex flex-col items-start cursor-pointer"
          >
            <p className="text-sm text-gray-500 font-medium">
              {status.replace("_", " ")}
            </p>
            <h2 className="text-2xl font-bold text-gray-800 mt-1">
              {ticketCounts[status] || 0}
            </h2>

            {/* Gradient Mini-Status Bar */}
            <div className="w-full h-2 rounded-full bg-slate-200 mt-3 overflow-hidden">
              <div
                className={`h-2 rounded-full ${status === "OPEN"
                    ? "bg-gradient-to-r from-green-400 to-green-600"
                    : status === "IN_PROGRESS"
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                      : "bg-gradient-to-r from-gray-400 to-gray-600"
                  }`}
                style={{
                  width: `${totalTickets ? (ticketCounts[status] / totalTickets) * 100 : 0
                    }%`,
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Tickets */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Requests
        </h2>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <p className="text-gray-500">
            You have not submitted any requests yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tickets.slice(0, 6).map((t) => (
              <motion.div
                key={t.id}
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ type: "tween", duration: 0.15 }}
                onClick={() => navigate(`/tenant/tickets/${t.id}`)}
                className="bg-white rounded-2xl shadow-md p-5 cursor-pointer flex flex-col justify-between gap-2"
              >
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {t.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Priority: {t.priority}
                  </p>
                </div>
                <StatusBadge status={t.status} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Optional Planned Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ y: -3, scale: 1.02 }}
          transition={{ type: "tween", duration: 0.15 }}
          onClick={() => navigate("/tenant/payments")}
          className="bg-white rounded-2xl shadow-md p-6 cursor-pointer flex flex-col items-center justify-center text-indigo-600 font-semibold"
        >
          Payments (Planned)
        </motion.div>
        <motion.div
          whileHover={{ y: -3, scale: 1.02 }}
          transition={{ type: "tween", duration: 0.15 }}
          onClick={() => navigate("/tenant/documents")}
          className="bg-white rounded-2xl shadow-md p-6 cursor-pointer flex flex-col items-center justify-center text-indigo-600 font-semibold"
        >
          Documents (Planned)
        </motion.div>
      </div>
    </TenantLayout>
  );
}
