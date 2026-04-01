import { useEffect, useState } from "react";
import axios from "axios";
import ManagerLayout from "../../layouts/ManagerLayout";
import PageHeader from "../../components/PageHeader";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/role/tenant`
      );

      // 🔑 Normalize backend snake_case → frontend camelCase
      const normalizedTenants = (res.data || []).map((t) => ({
        id: t.id,
        fullName: t.full_name,
        email: t.email,
        role: t.role,
      }));

      setTenants(normalizedTenants);
    } catch (err) {
      console.error("Failed to load tenants", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ManagerLayout>
      <PageHeader
        title="Tenants"
        subtitle="List of all registered tenants in the system"
      />

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b bg-slate-50 flex items-center gap-2">
          <Users size={18} className="text-indigo-600" />
          <h2 className="font-semibold text-gray-800">
            Tenant Directory
          </h2>
        </div>

        {/* Content */}
        {loading ? (
          <p className="p-6 text-sm text-gray-500">
            Loading tenants...
          </p>
        ) : tenants.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No tenants registered yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">#</th>
                  <th className="px-6 py-3 text-left font-medium">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left font-medium">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left font-medium">
                    Role
                  </th>
                </tr>
              </thead>

              <tbody>
                {tenants.map((tenant, index) => (
                  <tr
                    key={tenant.id}
                    onClick={() =>
                      navigate(`/manager/tenants/${tenant.id}`,{
                        state:{tenant}
                      })
                    }
                    className="
                      cursor-pointer
                      border-l-4 border-l-transparent
                      hover:border-l-indigo-500
                      hover:bg-slate-50
                      transition-colors
                    "
                  >
                    <td className="px-6 py-4 text-gray-500">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-800">
                      {tenant.fullName}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {tenant.email}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                        {tenant.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ManagerLayout>
  );
}
