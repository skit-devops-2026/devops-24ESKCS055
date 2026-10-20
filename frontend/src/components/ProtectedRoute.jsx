import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;
  }

  // Logged-out visitors redirect to Home (/)
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Role "user" opening an admin route redirects to User Dashboard (/home)
  if (allowedRole === "admin" && user.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  // Role "admin" opening a user-only route redirects to Admin Dashboard (/admin)
  if (allowedRole === "user" && user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;