import ManagerLayout from "../../layouts/ManagerLayout";
import PageHeader from "../../components/PageHeader";
import { useNavigate } from "react-router-dom";
import { User, Mail, Shield } from "lucide-react";

export default function ManagerProfile() {
  const navigate = useNavigate();

  const rawUser = JSON.parse(localStorage.getItem("habytixUser"));

  if (!rawUser) {
    navigate("/login");
    return null;
  }

  // 🔑 Normalize snake_case → camelCase
  const user = {
    id: rawUser.id,
    fullName: rawUser.full_name,
    email: rawUser.email,
    role: rawUser.role,
  };

  return (
    <ManagerLayout>
      <PageHeader
        title="My Profile"
        subtitle="View and manage your personal information"
      />

      <div className="max-w-3xl bg-white rounded-2xl shadow p-8">
        {/* Avatar + Name */}
        <div className="flex items-center gap-6 mb-8">
          <div className="h-20 w-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xl font-semibold">
            {user.fullName?.charAt(0)}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {user.fullName}
            </h2>
            <p className="text-sm text-gray-500 capitalize">
              {user.role}
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4 text-sm text-gray-700">
          <div className="flex items-center gap-3">
            <User size={18} className="text-gray-400" />
            <span>{user.fullName}</span>
          </div>

          <div className="flex items-center gap-3">
            <Mail size={18} className="text-gray-400" />
            <span>{user.email}</span>
          </div>

          <div className="flex items-center gap-3">
            <Shield size={18} className="text-gray-400" />
            <span className="capitalize">{user.role}</span>
          </div>
        </div>

        {/* Action */}
        <div className="mt-8">
          <button
            onClick={() => navigate("/manager/profile/edit")}
            className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-5 py-2.5 rounded-lg text-sm font-medium"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </ManagerLayout>
  );
}
