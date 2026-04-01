import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ role, isOpen, onClose }) {
  const location = useLocation();

  const menus = {
    tenant: [
      { label: "Dashboard", path: "/tenant/dashboard" },
      { label: "My Requests", path: "/tenant/tickets" },
      { label: "Payments", path: "/tenant/payments" },
      { label: "Documents", path: "/tenant/documents" },
      { label: "Profile", path: "/tenant/profile" },
    ],
    manager: [
      { label: "Dashboard", path: "/manager/dashboard" },
      { label: "Tickets", path: "/manager/tickets" },
      { label: "Tenants", path: "/manager/tenants" },
      { label: "Profile", path: "/manager/profile" },
    ],
    staff: [
      { label: "Dashboard", path: "/staff/dashboard" },
      { label: "Tickets", path: "/staff/tickets" },
    ],
  };

  const menu = menus[role] || [];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
        />
      )}

      <aside
        className={`
    fixed lg:static inset-y-0 left-0 z-40
    w-64 bg-slate-900 text-white p-6
    transform transition-transform duration-300
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
  `}
      >

        <div className="p-6 min-h-screen">
          <h1 className="text-2xl font-bold mb-10 tracking-wide">
            Habytix
          </h1>

          <nav className="space-y-2 text-sm">
            {menu.map((item) => {
              const isActive = location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`block px-4 py-2 rounded-lg transition
                    ${isActive
                      ? "bg-slate-700 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}

