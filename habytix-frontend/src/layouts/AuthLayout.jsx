export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left branding panel */}
      <div className="hidden md:flex flex-col justify-center items-center bg-slate-900 text-white p-10">
        <h1 className="text-4xl font-bold tracking-wide">Habytix</h1>
        <p className="mt-4 text-slate-300 text-center max-w-sm">
          A modern platform to manage living, maintenance, and resident experience.
        </p>
      </div>

      {/* Right content */}
      <div className="flex items-center justify-center p-8">
        {children}
      </div>
    </div>
  );
}
