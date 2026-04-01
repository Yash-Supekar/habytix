import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StaffLayout from "../../layouts/StaffLayout";

/* ------------------ Status Badge ------------------ */
const StatusBadge = ({ status }) => {
  const styles = {
    OPEN: "bg-green-500",
    IN_PROGRESS: "bg-yellow-500",
    CLOSED: "bg-gray-500",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${styles[status]}`}
    >
      {status}
    </span>
  );
};

/* ------------------ Main Component ------------------ */
export default function StaffTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("habytixUser"));

  useEffect(() => {
    if (!user?.id) return;
    fetchTickets();
  }, [user?.id]);

  useEffect(() => {
    applyFilter();
  }, [statusFilter, tickets]);

  /* ------------------ API ------------------ */
  const fetchTickets = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/tickets/staff/${user.id}`
      );

      const sorted = sortTickets(res.data);
      setTickets(sorted);
      setFilteredTickets(sorted);
    } catch (err) {
      console.error("Failed to fetch staff tickets", err);
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
    if (statusFilter === "ALL") {
      setFilteredTickets(tickets);
    } else {
      setFilteredTickets(tickets.filter(t => t.status === statusFilter));
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <StaffLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          My Assigned Tickets
        </h1>

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

      {/* States */}
      {loading ? (
        <p className="text-gray-500">Loading tickets...</p>
      ) : filteredTickets.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
          No tickets assigned
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-gray-600">
                <tr>
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredTickets.map((t) => (
                  <tr
                    key={t.id}
                    className="
                      group
                      border-t
                      transition
                      duration-150
                      hover:bg-indigo-50
                    "
                  >
                    {/* Title with Accent */}
                    <td className="p-4 font-medium text-gray-800 relative pl-6">
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
                    <td className="p-4 text-center">
                      <StatusBadge status={t.status} />
                    </td>

                    {/* Action */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => navigate(`/staff/tickets/${t.id}`)}
                        className="
                          text-indigo-600
                          font-semibold
                          hover:underline
                          transition
                        "
                      >
                        View →
                      </button>
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
                onClick={() => navigate(`/staff/tickets/${t.id}`)}
                className="
                  bg-white
                  rounded-xl
                  shadow
                  p-4
                  space-y-3
                  cursor-pointer
                  transition
                  hover:shadow-md
                "
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">{t.title}</h3>
                  <StatusBadge status={t.status} />
                </div>

                <span className="text-indigo-600 text-sm font-medium">
                  View Details →
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </StaffLayout>
  );
}
