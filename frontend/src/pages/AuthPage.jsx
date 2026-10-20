import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLeftPanel from "../components/AuthLeftPanel";
import AuthForm from "../components/AuthForm";
import "./AuthPage.css";

export default function AuthPage() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/home"} replace />;
  }

  return (
    <div className="auth-page">
      <AuthLeftPanel />
      <div className="auth-right">
        <AuthForm />
      </div>
    </div>
  );
}
