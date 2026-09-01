import React from "react";
import AuthLeftPanel from "../components/AuthLeftPanel";
import AuthForm from "../components/AuthForm";
import "./AuthPage.css";

export default function AuthPage() {
  return (
    <div className="auth-page">
      <AuthLeftPanel />
      <div className="auth-right">
        <AuthForm />
      </div>
    </div>
  );
}
