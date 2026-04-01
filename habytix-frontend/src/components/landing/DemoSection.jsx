import { useNavigate } from "react-router-dom";

export default function DemoSection() {
  const navigate = useNavigate();

  const copy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const loginDemo = (email) => {
    localStorage.setItem("demoEmail", email);
    localStorage.setItem("demoPassword", "12345");
    navigate("/login");
  };

  return (
    <section id="demo" className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 text-center">

        <h2 className="text-3xl font-bold text-gray-900">
          Try Habytix Demo
        </h2>

        <p className="text-gray-600 mt-3">
          No signup required. Explore instantly.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-10">

          {/* Manager */}
          <div className="bg-white shadow rounded-2xl p-6">
            <h3 className="text-indigo-600 font-semibold">
              Manager
            </h3>

            <p className="mt-3 text-sm">
              manager1@example.com
            </p>

            <p className="text-sm">Pass: 12345</p>

            <div className="flex gap-2 mt-4 justify-center">
              <button
                onClick={() => copy("manager1@example.com")}
                className="text-sm text-indigo-600"
              >
                Copy Email
              </button>

              <button
                onClick={() => loginDemo("manager1@example.com")}
                className="bg-indigo-600 text-white px-3 py-1 rounded"
              >
                Login
              </button>
            </div>
          </div>

          {/* Tenant */}
          <div className="bg-white shadow rounded-2xl p-6">
            <h3 className="text-indigo-600 font-semibold">
              Tenant
            </h3>

            <p className="mt-3 text-sm">
              tenant3@example.com
            </p>

            <p className="text-sm">Pass: 12345</p>

            <div className="flex gap-2 mt-4 justify-center">
              <button
                onClick={() => copy("tenant3@example.com")}
                className="text-sm text-indigo-600"
              >
                Copy Email
              </button>

              <button
                onClick={() => loginDemo("tenant3@example.com")}
                className="bg-indigo-600 text-white px-3 py-1 rounded"
              >
                Login
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}