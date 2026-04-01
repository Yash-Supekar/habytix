export default function DemoSection() {
  return (
    <section id="demo" className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 text-center">

        <h2 className="text-3xl font-bold text-gray-900">
          Try Habytix Demo
        </h2>

        <p className="text-gray-600 mt-3">
          Explore the platform instantly using demo accounts.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-10">

          {/* Manager */}
          <div className="bg-white shadow rounded-2xl p-6">
            <h3 className="font-semibold text-lg text-indigo-600">
              Manager Account
            </h3>

            <p className="mt-3 text-sm text-gray-600">
              Email: manager1@example.com
            </p>

            <p className="text-sm text-gray-600">
              Password: 12345
            </p>
          </div>

          {/* Tenant */}
          <div className="bg-white shadow rounded-2xl p-6">
            <h3 className="font-semibold text-lg text-indigo-600">
              Tenant Account
            </h3>

            <p className="mt-3 text-sm text-gray-600">
              Email: tenant3@example.com
            </p>

            <p className="text-sm text-gray-600">
              Password: 12345
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}