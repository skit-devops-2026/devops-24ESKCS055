import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ fullName: "", username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login({ username: form.username, password: form.password });
      } else {
        await signup({
          fullName: form.fullName,
          username: form.username,
          email: form.email,
          password: form.password,
        });
      }
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-page">
        <div className="auth-card card">
          <h2 className="auth-logo">Sayso</h2>

          <div className="auth-toggle">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => handleModeChange("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={mode === "signup" ? "active" : ""}
              onClick={() => handleModeChange("signup")}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === "signup" && (
              <>
                <div>
                  <label className="field-label">Full Name</label>
                  <input
                    className="input-field"
                    name="fullName"
                    placeholder="e.g. John Doe"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="field-label">Email Address</label>
                  <input
                    className="input-field"
                    name="email"
                    type="email"
                    placeholder="e.g. john@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="field-label">
                {mode === "login" ? "Username or Email" : "Choose a Username"}
              </label>
              <input
                className="input-field"
                name="username"
                placeholder={mode === "login" ? "Username or Email" : "e.g. johndoe"}
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="field-label">Password</label>
              <input
                className="input-field"
                name="password"
                type="password"
                placeholder={mode === "signup" ? "At least 6 characters" : "Password"}
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
              {loading ? (mode === "login" ? "Logging in..." : "Creating Account...") : (mode === "login" ? "Login" : "Create Account")}
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
          padding: 24px;
        }

        .auth-card {
          width: 100%;
          max-width: 420px;
          padding: 36px;
        }

        .auth-logo {
          text-align: center;
          font-size: 32px;
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
          font-size: 14px;
          color: var(--color-muted);
          transition: all 0.2s;
        }

        .auth-toggle .active {
          background: var(--color-primary);
          color: #fff;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: var(--color-muted);
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .auth-error {
          background: #FDF2F2;
          border: 1px solid #F8B4B4;
          color: var(--color-against);
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 13px;
          line-height: 1.4;
        }

        .auth-submit {
          margin-top: 8px;
          padding: 12px;
          font-size: 15px;
        }
      `}</style>
    </>
  );
};

export default AuthPage;