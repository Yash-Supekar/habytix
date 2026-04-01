import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ManagerLayout from "../../layouts/ManagerLayout";
import axios from "axios";

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

export default function AssignTicket() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [staffMap, setStaffMap] = useState({});
  const [tenantMap, setTenantMap] = useState({});
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  /* ------------------ Load Data ------------------ */
  const loadData = async () => {
    try {
      const [ticketRes, staffRes, tenantRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/tickets/${id}`),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/role/staff`),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/role/tenant`),
      ]);

      const t = ticketRes.data;

setTicket({
  ...t,
  tenantId: t.tenantId ?? t.tenant_id,
  assignedTo: t.assignedTo ?? t.assigned_to,
});

      // Staff ID → Name map
      const staffLookup = {};
      staffRes.data.forEach((s) => {
        staffLookup[s.id] = s.fullName || s.full_name;
      });
      setStaffMap(staffLookup);
      setStaffList(staffRes.data);

      // Tenant ID → Name map
      const tenantLookup = {};
      tenantRes.data.forEach((t) => {
        tenantLookup[t.id] = t.fullName || t.full_name;
      });
      setTenantMap(tenantLookup);
    } catch (err) {
      console.error("Error loading ticket data", err);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ Helpers ------------------ */
  const getTenantName = (tenantId) => tenantMap[tenantId] || "Unknown Tenant";
  const getStaffName = (staffId) => staffMap[staffId] || "Unknown Staff";

  /* ------------------ Actions ------------------ */
  const handleAssign = async (staffId) => {
    if (ticket.assignedTo === staffId) return;

    await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/api/tickets/${id}/assign?staffId=${staffId}`
    );
    loadData();
  };

  const handleCloseTicket = async () => {
    await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/api/tickets/${id}/status?status=CLOSED`
    );
    loadData();
  };

  /* ------------------ States ------------------ */
  if (loading) {
    return <ManagerLayout>Loading ticket details...</ManagerLayout>;
  }

  if (!ticket) {
    return <ManagerLayout>Ticket not found.</ManagerLayout>;
  }

  /* ------------------ UI ------------------ */
  return (
    <ManagerLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back */}
        <button
          onClick={() => navigate("/manager/tickets")}
          className="text-sm text-indigo-600 font-medium hover:underline"
        >
          ← Back to tickets
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow p-6 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-2xl font-semibold text-gray-800">
              {ticket.title}
            </h1>
            <StatusBadge status={ticket.status} />
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>
              <strong>Tenant:</strong>{" "}
              {getTenantName(ticket.tenantId)}
            </span>

            <span>
              <strong>Priority:</strong> {ticket.priority}
            </span>

            <span>
              <strong>Assigned To:</strong>{" "}
              {ticket.assignedTo
                ? getStaffName(ticket.assignedTo)
                : "Not assigned"}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-gray-800 mb-2">
            Description
          </h2>

          {ticket.description ? (
            <p className="text-gray-600 leading-relaxed">
              {ticket.description}
            </p>
          ) : (
            <p className="text-gray-400 italic">
              No description provided.
            </p>
          )}
        </div>

        {/* Assign Section */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">
            Assign to Staff
          </h2>

          <div className="flex flex-wrap gap-3">
            {staffList.map((staff) => (
              <button
                key={staff.id}
                onClick={() => handleAssign(staff.id)}
                disabled={ticket.assignedTo === staff.id}
                className={`px-5 py-2 rounded-lg font-medium transition ${
                  ticket.assignedTo === staff.id
                    ? "bg-indigo-700 text-white cursor-not-allowed"
                    : "bg-indigo-500 text-white hover:bg-indigo-600"
                }`}
              >
                {staff.fullName || staff.full_name}
              </button>
            ))}
          </div>

          {ticket.status !== "CLOSED" && (
            <div className="pt-4">
              <button
                onClick={handleCloseTicket}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Close Ticket
              </button>
            </div>
          )}
        </div>
      </div>
    </ManagerLayout>
  );
}
