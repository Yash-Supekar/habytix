import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  // ✅ Safely get user from localStorage
  const storedUser = localStorage.getItem("habytixUser");
  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  let user;
  try {
    user = JSON.parse(storedUser);
  } catch (error) {
    console.error("Invalid user data in localStorage", error);
    localStorage.removeItem("habytixUser");
    return <Navigate to="/login" replace />;
  }

  // ✅ Check role
  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
