import { useEffect, useState } from "react";
import StaffLayout from "../../layouts/StaffLayout";
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

export default function StaffDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("habytixUser"));

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) navigate("/login");
    else fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/tickets/staff/${user.id}`
      );
      setTickets(sortTickets(res.data));
    } catch (err) {
      console.error("Failed to fetch staff dashboard data", err);
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
    <StaffLayout>
      {/* Header */}
      <PageHeader
        title="Staff Dashboard"
        subtitle="Manage assigned maintenance tasks"
      />


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
            {loading ? (
              <Skeleton className="h-7 w-16 mt-1" />
            ) : (
              <h2 className="text-2xl font-bold text-gray-800 mt-1">
                {ticketCounts[status] || 0}
              </h2>
            )}

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

      {/* Assigned Tickets Table */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          My Assigned Tickets
        </h2>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <p className="text-gray-500">No tickets assigned.</p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-gray-600">
                <tr>
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-left">Priority</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {tickets.slice(0, 8).map((t, index) => (
                  <motion.tr
                    key={t.id}
                    whileHover={{ scale: 1.01, backgroundColor: "rgba(243,244,246,0.5)" }}
                    transition={{ duration: 0.15 }}
                    className="border-t cursor-pointer"
                    onClick={() => navigate(`/staff/tickets/${t.id}`)}
                  >
                    <td className="p-4 font-medium">{t.title}</td>
                    <td className="p-4">{t.priority}</td>
                    <td className="p-4">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="p-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/staff/tickets/${t.id}`);
                        }}
                        className="text-indigo-600 hover:underline font-medium"
                      >
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </StaffLayout>
  );
}
