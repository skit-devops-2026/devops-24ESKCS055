import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ fullName: "", username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "login") {
        await login({ username: form.username, password: form.password });
      } else {
        await signup(form);
      }
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className="auth-page">
        <div className="auth-card card">
          <h2 className="auth-logo">Sayso</h2>

          <div className="auth-toggle">
            <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Login</button>
            <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>Sign Up</button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === "signup" && (
              <>
                <input className="input-field" name="fullName" placeholder="Full Name" onChange={handleChange} />
                <input className="input-field" name="email" placeholder="Email" onChange={handleChange} />
              </>
            )}
            <input className="input-field" name="username" placeholder="Username" onChange={handleChange} />
            <input className="input-field" name="password" type="password" placeholder="Password" onChange={handleChange} />

            {error && <p className="auth-error">{error}</p>}

            <button className="btn btn-primary" type="submit">
              {mode === "login" ? "Login" : "Create Account"}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-primary-tint);
        }

        .auth-card {
          width: 400px;
          padding: 36px;
        }

        .auth-logo {
          text-align: center;
          color: var(--color-primary);
          margin-bottom: 24px;
        }

        .auth-toggle {
          display: flex;
          background: var(--color-bg);
          border-radius: 8px;
          padding: 4px;
          margin-bottom: 22px;
        }

        .auth-toggle button {
          flex: 1;
          padding: 10px;
          border: none;
          background: transparent;
          border-radius: 6px;
          font-weight: 600;
          color: var(--color-muted);
        }

        .auth-toggle .active {
          background: var(--color-primary);
          color: #fff;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .auth-error {
          color: var(--color-against);
          font-size: 13px;
        }
      `}</style>
    </>
  );
};

export default AuthPage;