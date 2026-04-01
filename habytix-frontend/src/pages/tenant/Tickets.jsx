import { useEffect, useState } from "react";
import TenantLayout from "../../layouts/TenantLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* ------------------ Status Badge ------------------ */
const StatusBadge = ({ status }) => {
  const styles = {
    OPEN: "bg-emerald-500",
    IN_PROGRESS: "bg-amber-500",
    CLOSED: "bg-slate-400",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${styles[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
};

/* ------------------ Priority Badge ------------------ */
const PriorityBadge = ({ priority }) => {
  const styles = {
    LOW: "bg-slate-100 text-slate-600",
    MEDIUM: "bg-indigo-100 text-indigo-700",
    HIGH: "bg-rose-100 text-rose-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[priority]}`}
    >
      {priority}
    </span>
  );
};

/* ------------------ Main Component ------------------ */
export default function TenantTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("habytixUser"));

  useEffect(() => {
    if (!user) navigate("/login");
    else fetchTickets();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [statusFilter, tickets]);

  /* ------------------ API ------------------ */
  const fetchTickets = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/tickets/tenant/${user.id}`
      );

      const sorted = sortTickets(res.data);
      setTickets(sorted);
      setFilteredTickets(sorted);
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ Helpers ------------------ */
  const sortTickets = (tickets) => {
    const priority = { OPEN: 1, IN_PROGRESS: 2, CLOSED: 3 };

    return [...tickets].sort((a, b) => {
      const diff = priority[a.status] - priority[b.status];
      if (diff !== 0) return diff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  const applyFilter = () => {
    if (statusFilter === "ALL") setFilteredTickets(tickets);
    else setFilteredTickets(tickets.filter(t => t.status === statusFilter));
  };

  /* ------------------ UI ------------------ */
  return (
    <TenantLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          My Requests
        </h1>

        <div className="flex gap-3">
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

          <button
            onClick={() => navigate("/tenant/tickets/new")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            + New Request
          </button>
        </div>
      </div>

      {/* States */}
      {loading ? (
        <p className="text-gray-500">Loading tickets...</p>
      ) : filteredTickets.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
          No requests match the selected filter.
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-gray-600">
                <tr>
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Priority</th>
                  <th className="p-4 text-right"></th>
                </tr>
              </thead>

              <tbody>
                {filteredTickets.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => navigate(`/tenant/tickets/${t.id}`)}
                    className="
    group
    border-t
    cursor-pointer
    transition-all
    duration-150
    hover:bg-indigo-50
    hover:shadow-sm
    relative
  "
                  >
                    {/* Title */}
                    <td className="p-4 font-medium text-gray-800 relative pl-6">
                      {/* Accent Bar */}
                      <span
                        className="
        absolute
        left-0
        top-0
        h-full
        w-1
        bg-indigo-500
        opacity-0
        group-hover:opacity-100
        transition
      "
                      />
                      {t.title}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <StatusBadge status={t.status} />
                    </td>

                    {/* Priority */}
                    <td className="p-4">
                      <PriorityBadge priority={t.priority} />
                    </td>

                    {/* Arrow */}
                    <td className="p-4 text-right text-indigo-600 font-semibold opacity-0 group-hover:opacity-100 transition">
                      →
                    </td>
                  </tr>

                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredTickets.map((t) => (
              <div
                key={t.id}
                onClick={() => navigate(`/tenant/tickets/${t.id}`)}
                className="
                  bg-white
                  rounded-xl
                  shadow
                  p-4
                  space-y-3
                  cursor-pointer
                  transition
                  hover:shadow-md
                  active:scale-[0.98]
                "
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">{t.title}</h3>
                  <StatusBadge status={t.status} />
                </div>

                <PriorityBadge priority={t.priority} />

                <span className="text-indigo-600 text-sm font-medium">
                  View Details →
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </TenantLayout>
  );
}
