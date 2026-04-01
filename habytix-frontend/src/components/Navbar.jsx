import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

export default function Navbar({ title, onMenuClick }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-600 hover:text-gray-900"
        >
          <Menu size={22} />
        </button>

        <h2 className="font-semibold text-lg text-gray-700">
          {title || "Dashboard"}
        </h2>
      </div>

      <button
        onClick={handleLogout}
        className="text-sm font-medium text-slate-600 hover:text-red-600 transition"
      >
        Logout
      </button>
    </header>
  );
}
