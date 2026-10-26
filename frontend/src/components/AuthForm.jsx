import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Validates standard email address format.
 *
 * @param {string} v - Email string to check.
 * @returns {boolean} True if email conforms to email regex.
 */
const emailValid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

/**
 * Toggle visibility icon for masked password input fields.
 *
 * @param {{ open: boolean }} props - Eye open status.
 * @returns {JSX.Element} SVG icon.
 */
const EyeIcon = ({ open }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    width="17"
    height="17"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    {open ? (
      <>
        <path d="M1 10s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" />
        <circle cx="10" cy="10" r="2.5" />
      </>
    ) : (
      <>
        <path d="M1 10s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" />
        <circle cx="10" cy="10" r="2.5" />
        <path d="M2 2l16 16" stroke="currentColor" />
      </>
    )}
  </svg>
);

/**
 * Authentication Form component for SaySo.
 * Provides Login and Signup tabs with clean, elegant styling matching AuthPage.css.
 * Password validation is kept simple and minimal as requested.
 *
 * @returns {JSX.Element} The rendered AuthForm component.
 */
export default function AuthForm() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [touched, setTouched] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setServerError("");
  };
  const touch = (field) => () => setTouched((t) => ({ ...t, [field]: true }));

  // Validation rules (kept clean & minimal)
  const errors = useMemo(() => {
    const e = {};
    if (mode === "signup") {
      if (touched.fullName && !form.fullName.trim()) {
        e.fullName = "Full name is required.";
      }
      if (touched.email) {
        if (!form.email.trim()) {
          e.email = "Email is required.";
        } else if (!emailValid(form.email)) {
          e.email = "Email must contain @ and a valid domain.";
        }
      }
    }

    if (touched.username) {
      if (!form.username.trim()) {
        e.username = "Username is required.";
      } else if (
        mode === "signup" &&
        form.username.trim().toLowerCase() === "admin"
      ) {
        e.username =
          "Username 'admin' is reserved. Please choose a different username.";
      }
    }

    if (touched.password && !form.password) {
      e.password = "Password is required.";
    }

    if (mode === "signup" && touched.confirm) {
      if (!form.confirm) {
        e.confirm = "Please confirm your password.";
      } else if (form.confirm !== form.password) {
        e.confirm = "Passwords do not match.";
      }
    }

    return e;
  }, [form, touched, mode]);

  // Submit prerequisite check
  const canSubmit = useMemo(() => {
    if (mode === "login") {
      return Boolean(form.username.trim() && form.password);
    }
    return Boolean(
      form.fullName.trim() &&
        emailValid(form.email) &&
        form.username.trim() &&
        form.username.trim().toLowerCase() !== "admin" &&
        form.password &&
        form.confirm === form.password
    );
  }, [form, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allFields =
      mode === "login"
        ? ["username", "password"]
        : ["fullName", "email", "username", "password", "confirm"];
    setTouched(Object.fromEntries(allFields.map((f) => [f, true])));

    if (mode === "signup" && form.username.trim().toLowerCase() === "admin") {
      setServerError(
        "Username 'admin' is reserved. Please choose a different username."
      );
      return;
    }

    if (!canSubmit) return;

    setLoading(true);
    setServerError("");
    try {
      if (mode === "login") {
        const logged = await login({
          username: form.username,
          password: form.password,
        });
        if (logged?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        const created = await signup({
          fullName: form.fullName,
          username: form.username,
          email: form.email,
          password: form.password,
        });
        if (created?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      }
    } catch (err) {
      setServerError(err?.message || "Username or password is incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-wrap">
      {/* Mode toggle */}
      <div className="auth-toggle">
        <button
          className={`at-btn ${mode === "login" ? "at-btn--active" : ""}`}
          onClick={() => {
            setMode("login");
            setTouched({});
            setServerError("");
          }}
          type="button"
        >
          Login
        </button>
        <button
          className={`at-btn ${mode === "signup" ? "at-btn--active" : ""}`}
          onClick={() => {
            setMode("signup");
            setTouched({});
            setServerError("");
          }}
          type="button"
        >
          Sign Up
        </button>
      </div>

      <h3 className="auth-form-title">
        {mode === "login" ? "Welcome back" : "Create your account"}
      </h3>
      <p className="auth-form-sub">
        {mode === "login"
          ? "Log in to continue your debates."
          : "Sign up — no verification needed."}
      </p>

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {/* Full name (signup only) */}
        {mode === "signup" && (
          <div className="field">
            <label className="field-label">Full Name</label>
            <input
              className={`field-input ${
                touched.fullName && errors.fullName ? "field-input--err" : ""
              }`}
              placeholder="Apoorva Sharma"
              value={form.fullName}
              onChange={set("fullName")}
              onBlur={touch("fullName")}
              autoComplete="name"
            />
            {touched.fullName && errors.fullName && (
              <p className="field-err">{errors.fullName}</p>
            )}
          </div>
        )}

        {/* Email (signup only) */}
        {mode === "signup" && (
          <div className="field">
            <label className="field-label">Email</label>
            <input
              className={`field-input ${
                touched.email && errors.email
                  ? "field-input--err"
                  : touched.email && form.email && emailValid(form.email)
                  ? "field-input--ok"
                  : ""
              }`}
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set("email")}
              onBlur={touch("email")}
              autoComplete="email"
            />
            {touched.email && errors.email && (
              <p className="field-err">{errors.email}</p>
            )}
            {touched.email && form.email && emailValid(form.email) && (
              <p className="field-ok">Looks good!</p>
            )}
          </div>
        )}

        {/* Username */}
        <div className="field">
          <label className="field-label">Username</label>
          <input
            className={`field-input ${
              touched.username && errors.username ? "field-input--err" : ""
            }`}
            placeholder={mode === "login" ? "username or email" : "username"}
            value={form.username}
            onChange={set("username")}
            onBlur={touch("username")}
            autoComplete="username"
          />
          {touched.username && errors.username && (
            <p className="field-err">{errors.username}</p>
          )}
        </div>

        {/* Password */}
        <div className="field">
          <label className="field-label">Password</label>
          <div className="field-pw-wrap">
            <input
              className={`field-input field-input--pw ${
                touched.password && errors.password ? "field-input--err" : ""
              }`}
              type={showPw ? "text" : "password"}
              placeholder="Enter your password"
              value={form.password}
              onChange={set("password")}
              onBlur={touch("password")}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
            />
            <button
              type="button"
              className="pw-eye"
              onClick={() => setShowPw((v) => !v)}
              aria-label="Toggle password visibility"
            >
              <EyeIcon open={showPw} />
            </button>
          </div>
          {touched.password && errors.password && (
            <p className="field-err">{errors.password}</p>
          )}
        </div>

        {/* Confirm password (signup only) */}
        {mode === "signup" && (
          <div className="field">
            <label className="field-label">Confirm Password</label>
            <div className="field-pw-wrap">
              <input
                className={`field-input field-input--pw ${
                  touched.confirm && errors.confirm
                    ? "field-input--err"
                    : touched.confirm && form.confirm && form.confirm === form.password
                    ? "field-input--ok"
                    : ""
                }`}
                type={showCf ? "text" : "password"}
                placeholder="Repeat your password"
                value={form.confirm}
                onChange={set("confirm")}
                onBlur={touch("confirm")}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="pw-eye"
                onClick={() => setShowCf((v) => !v)}
                aria-label="Toggle confirm password visibility"
              >
                <EyeIcon open={showCf} />
              </button>
            </div>
            {touched.confirm && errors.confirm && (
              <p className="field-err">{errors.confirm}</p>
            )}
            {touched.confirm &&
              form.confirm &&
              form.confirm === form.password && (
                <p className="field-ok">Passwords match!</p>
              )}
          </div>
        )}

        {/* Server error banner */}
        {serverError && <div className="server-err">{serverError}</div>}

        {/* Submit button */}
        <button
          type="submit"
          className="auth-submit"
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading
            ? "Please wait…"
            : mode === "login"
            ? "Login to SaySo"
            : "Create My Account"}
        </button>

        {/* Switch mode */}
        <p className="auth-switch">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                className="auth-switch-btn"
                onClick={() => {
                  setMode("signup");
                  setTouched({});
                  setServerError("");
                }}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="auth-switch-btn"
                onClick={() => {
                  setMode("login");
                  setTouched({});
                  setServerError("");
                }}
              >
                Login
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
