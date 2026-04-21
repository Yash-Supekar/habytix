import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import TenantLayout from "../../layouts/TenantLayout";

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

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ------------------ Fetch Data ------------------ */
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ticketRes, staffRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/tickets/${id}`),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/role/staff`),
      ]);

      const t = ticketRes.data;
      setTicket({
        ...t,
        assignedTo: t.assignedTo ?? t.assigned_to,
        tenantId: t.tenantId ?? t.tenant_id,
        createdAt: t.createdAt ?? t.created_at,
      });
      setStaffList(staffRes.data);
    } catch (err) {
      console.error("Failed to load ticket details", err);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ Helpers ------------------ */
  const getStaffName = (staffId) => {
    const staff = staffList.find((s) => Number(s.id) === Number(staffId));
    return staff ? (staff.fullName || staff.full_name) : "Unknown Staff";
  };

  if (loading) {
    return (
      <TenantLayout>
        <p className="text-gray-500">Loading ticket details...</p>
      </TenantLayout>
    );
  }

  if (!ticket) {
    return (
      <TenantLayout>
        <p className="text-gray-500">Ticket not found.</p>
      </TenantLayout>
    );
  }

  return (
    <TenantLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
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
      </div>
    </TenantLayout>
  );
}
