import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TenantLayout from "../../layouts/TenantLayout";
import axios from "axios";

export default function NewRequest() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("habytixUser"));

  useEffect(() => {
    if (!user) {
      alert("User not logged in");
      navigate("/login");
    }
  }, []);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/tickets`, {
        title: form.title,
        description: form.description,
        priority: form.priority,
        tenantId: user.id, // ✅ REQUIRED (unchanged)
      });

      navigate("/tenant/tickets");
    } catch (error) {
      console.error("Ticket creation failed:", error.response || error);
      alert("Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <TenantLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back */}
        <button
          onClick={() => navigate("/tenant/tickets")}
          className="text-sm text-indigo-600 font-medium hover:underline"
        >
          ← Back to tickets
        </button>

        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Create New Request
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Submit a maintenance or service request for your unit.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow p-6 space-y-5"
        >
          {/* Title */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Brief summary of the issue"
              required
              className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your issue in detail"
              required
              rows={4}
              className="w-full border rounded-lg px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Priority */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => navigate("/tenant/tickets")}
              className="px-5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-2 rounded-lg text-sm font-semibold text-white transition ${
                submitting
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </TenantLayout>
  );
}
