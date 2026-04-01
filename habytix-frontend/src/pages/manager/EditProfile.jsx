import { useState } from "react";
import ManagerLayout from "../../layouts/ManagerLayout";
import PageHeader from "../../components/PageHeader";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ManagerEditProfile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("habytixUser"));

  const [form, setForm] = useState({
    fullName: user.fullName,
    email: user.email,
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${user.id}`,
        form
      );

      localStorage.setItem("habytixUser", JSON.stringify(res.data));
      navigate("/manager/profile");
    } catch (error) {
      console.error("Profile update failed:", error);
      alert("Failed to update profile");
    }
  };

  return (
    <ManagerLayout>
      <PageHeader
        title="Edit Profile"
        subtitle="Update your personal information"
      />

      <div className="max-w-3xl bg-white rounded-2xl shadow p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Full Name
            </label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Leave blank to keep current password"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-6 py-2.5 rounded-lg text-sm font-medium"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => navigate("/manager/profile")}
              className="px-6 py-2.5 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </ManagerLayout>
  );
}
