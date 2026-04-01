import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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

export default function StaffTicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ticketRes, tenantRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/tickets/${id}`),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/role/tenant`),
      ]);

      setTicket(ticketRes.data);

      // 🔑 Normalize tenant data (snake_case → camelCase)
      const normalizedTenants = (tenantRes.data || []).map((t) => ({
        id: Number(t.id),
        fullName: t.full_name,
        email: t.email,
        role: t.role,
      }));

      setTenants(normalizedTenants);
    } catch (err) {
      console.error("Failed to load ticket", err);
    } finally {
      setLoading(false);
    }
  };

  const getTenantName = (tenantId) =>
    tenants.find((t) => t.id === Number(tenantId))?.fullName || "Unknown Tenant";

  const closeTicket = async () => {
    await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/api/tickets/${id}/status?status=CLOSED`
    );
    navigate("/staff/tickets");
  };

  if (loading) {
    return (
      <StaffLayout>
        <p className="text-gray-500">Loading ticket details...</p>
      </StaffLayout>
    );
  }

  if (!ticket) {
    return (
      <StaffLayout>
        <p className="text-gray-500">Ticket not found.</p>
      </StaffLayout>
    );
  }

  return (
    <StaffLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back */}
        <button
          onClick={() => navigate("/staff/tickets")}
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
              {/* ✅ FIX IS HERE */}
              {getTenantName(ticket.tenant_id)}
            </span>

            <span>
              <strong>Priority:</strong> {ticket.priority}
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

        {/* Actions */}
        {ticket.status !== "CLOSED" && (
          <div className="flex justify-end">
            <button
              onClick={closeTicket}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Close Ticket
            </button>
          </div>
        )}
      </div>
    </StaffLayout>
  );
}
