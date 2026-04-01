import { useLocation, useNavigate } from "react-router-dom";

export default function PlannedFeature() {
  const location = useLocation();
  const navigate = useNavigate();

  // Feature name passed via route state
  const featureName = location.state?.feature || "This Feature";

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 text-center space-y-6">
        
        {/* Icon */}
        <div className="text-5xl">🚧</div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800">
          {featureName} Module
        </h1>

        {/* Badge */}
        <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
          Planned Feature
        </span>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed">
          This module is part of the system’s <strong>future scope</strong>.
          <br />
          The current version of Habytix focuses on:
        </p>

        {/* Focus list */}
        <ul className="text-left text-gray-700 space-y-2 mx-auto max-w-sm">
          <li>✔ Role-based authentication</li>
          <li>✔ Complaint ticket creation</li>
          <li>✔ Staff assignment & tracking</li>
          <li>✔ Status updates & resolution flow</li>
        </ul>

        {/* Footer note */}
        <p className="text-sm text-gray-500">
          This feature will be implemented in the next development phase.
        </p>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
