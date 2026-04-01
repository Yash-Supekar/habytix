import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-indigo-600">
          Habytix
        </h1>

        <div className="flex items-center gap-6">
          <Link
            to="/login"
            className="text-gray-600 hover:text-indigo-600 transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}