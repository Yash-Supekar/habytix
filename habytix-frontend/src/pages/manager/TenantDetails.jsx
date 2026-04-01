import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ManagerLayout from "../../layouts/ManagerLayout";
import PageHeader from "../../components/PageHeader";
import { ArrowLeft, Mail, User, FileText } from "lucide-react";

export default function TenantDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [tenant, setTenant] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        fetchTenantDetails();
        fetchTenantTickets();
    }, [id]);

    const fetchTenantDetails = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/${id}`);
        setTenant(res.data);
    };

    const fetchTenantTickets = async () => {
        const res = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/tickets/tenant/${id}`
        );
        setTickets(res.data);
        setLoading(false);
    };

    /* ---------- Status Summary ---------- */
    const openCount = tickets.filter(t => t.status === "OPEN").length;
    const inProgressCount = tickets.filter(t => t.status === "IN_PROGRESS").length;
    const closedCount = tickets.filter(t => t.status === "CLOSED").length;

    if (loading) {
        return (
            <ManagerLayout>
                <p className="p-6 text-gray-500">Loading...</p>
            </ManagerLayout>
        );
    }console.log("Tenant ID from URL:", id);

    return (
        <ManagerLayout>
            {/* ---------- Back Button ---------- */}
            <button
                onClick={() => navigate("/manager/tenants")}
                className="
                    mb-4 flex items-center gap-2 text-sm
                    text-indigo-500 hover:text-gray-600
                    transition
                "
            >
                <ArrowLeft size={16} />
                Back to Tenants
            </button>

            <PageHeader
    title={tenant ? tenant.fullName : "Tenant Details"}
    subtitle="Profile and ticket activity"
/>

            {/* ---------- Tenant Info ---------- */}
            {tenant && (
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
                            <User className="text-indigo-600" />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                {tenant.fullName || tenant.full_name}
                            </h2>
                            <p className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail size={14} />
                                {tenant.email}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ---------- Status Summary ---------- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <SummaryCard title="Open" count={openCount} color="green" />
                <SummaryCard title="In Progress" count={inProgressCount} color="yellow" />
                <SummaryCard title="Closed" count={closedCount} color="gray" />
            </div>

            {/* ---------- Ticket Table ---------- */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b bg-slate-50 flex items-center gap-2">
                    <FileText size={18} className="text-indigo-600" />
                    <h3 className="font-semibold">Tickets Raised</h3>
                </div>

                {tickets.length === 0 ? (
                    <p className="p-8 text-center text-gray-500">
                        No tickets raised by this tenant.
                    </p>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-slate-100 text-gray-600">
                            <tr>
                                <th className="px-6 py-3 text-left">#</th>
                                <th className="px-6 py-3 text-left">Title</th>
                                <th className="px-6 py-3 text-left">Priority</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left">Created</th>
                            </tr>
                        </thead>

                        <tbody>
                            {tickets.map((ticket, index) => (
                                <tr
                                    key={ticket.id}
                                    onClick={() => navigate(`/manager/tickets/${ticket.id}`)}
                                    className="
                                    cursor-pointer
                                    border-l-4 border-l-transparent
                                    hover:border-l-indigo-500
                                    hover:bg-indigo-50/40
                                    transition-colors duration-150      
                                "
                                >
                                    {/* Serial */}
                                    <td className="px-6 py-4 text-gray-500">
                                        {index + 1}
                                    </td>

                                    {/* Title */}
                                    <td className="px-6 py-4 font-medium text-gray-800">
                                        {ticket.title}
                                    </td>

                                    {/* Priority */}
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium
                                        ${ticket.priority === "HIGH"
                                                    ? "bg-red-100 text-red-700"
                                                    : ticket.priority === "MEDIUM"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-green-100 text-green-700"
                                                }
                    `}
                                        >
                                            {ticket.priority}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4">
                                        <StatusBadge status={ticket.status} />
                                    </td>

                                    {/* Created */}
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(ticket.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                )}
            </div>
        </ManagerLayout>
    );
}

/* ---------- Components ---------- */

const SummaryCard = ({ title, count, color }) => (
    <div className="bg-white rounded-2xl shadow-sm p-6">
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className={`text-2xl font-bold text-${color}-600`}>
            {count}
        </h3>
    </div>
);

const StatusBadge = ({ status }) => {
    const styles = {
        OPEN: "bg-green-100 text-green-700",
        IN_PROGRESS: "bg-yellow-100 text-yellow-700",
        CLOSED: "bg-gray-200 text-gray-700",
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
            {status}
        </span>
    );
};
