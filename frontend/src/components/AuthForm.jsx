import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ── Validation helpers ── */
const emailValid   = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const hasUpper     = (v) => /[A-Z]/.test(v);
const hasLower     = (v) => /[a-z]/.test(v);
const hasNumber    = (v) => /[0-9]/.test(v);
const hasSpecial   = (v) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(v);
const hasMinLength = (v) => v.length >= 8;

const passwordRules = [
  { label: "At least 8 characters",       check: hasMinLength },
  { label: "One uppercase letter (A–Z)",   check: hasUpper     },
  { label: "One lowercase letter (a–z)",   check: hasLower     },
  { label: "One number (0–9)",             check: hasNumber    },
  { label: "One special character",        check: hasSpecial   },
];

/* ── Password strength (0–4) ── */
const getStrength = (pw) => passwordRules.filter(r => r.check(pw)).length;
const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very strong"];
const strengthColor = ["", "#C1666B", "#C9A66B", "#8BAF5B", "#4C8C5B", "#2C4A43"];

const CheckIcon = ({ pass }) => (
  <svg viewBox="0 0 14 14" fill="none" width="13" height="13" style={{ flexShrink: 0 }}>
    {pass
      ? <><circle cx="7" cy="7" r="7" fill="var(--color-for)" /><path d="M4 7l2 2 4-4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></>
      : <circle cx="7" cy="7" r="6" stroke="var(--color-border)" strokeWidth="1.4"/>
    }
  </svg>
);

const EyeIcon = ({ open }) => (
  <svg viewBox="0 0 20 20" fill="none" width="17" height="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    {open
      ? <><path d="M1 10s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z"/><circle cx="10" cy="10" r="2.5"/></>
      : <><path d="M1 10s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z"/><circle cx="10" cy="10" r="2.5"/><path d="M2 2l16 16" stroke="currentColor"/></>
    }
  </svg>
);


export default function AuthForm() {
  const [mode, setMode]           = useState("login");
  const [form, setForm]           = useState({ fullName: "", username: "", email: "", password: "", confirm: "" });
  const [touched, setTouched]     = useState({});
  const [showPw, setShowPw]       = useState(false);
  const [showCf, setShowCf]       = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading]     = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setServerError("");
  };
  const touch = (field) => () => setTouched(t => ({ ...t, [field]: true }));

  /* ── Per-field errors ── */
  const errors = useMemo(() => {
    const e = {};
    if (mode === "signup") {
      if (touched.fullName && !form.fullName.trim())
        e.fullName = "Full name is required.";

      if (touched.email) {
        if (!form.email.trim())        e.email = "Email is required.";
        else if (!emailValid(form.email)) e.email = "Email must contain @ and a valid domain.";
      }
    }
    if (touched.username && !form.username.trim())
      e.username = "Username is required.";

    if (touched.password && form.password) {
      const failing = passwordRules.filter(r => !r.check(form.password));
      if (failing.length)
        e.password = `Password needs: ${failing.map(r => r.label.toLowerCase()).join(", ")}.`;
    } else if (touched.password && !form.password) {
      e.password = "Password is required.";
    }

    if (mode === "signup" && touched.confirm) {
      if (!form.confirm)                        e.confirm = "Please confirm your password.";
      else if (form.confirm !== form.password)  e.confirm = "Passwords do not match.";
    }

    return e;
  }, [form, touched, mode]);

  /* ── Can submit? ── */
  const canSubmit = useMemo(() => {
    if (mode === "login") {
      return form.username.trim() && form.password.length >= 1;
    }
    const pwOk = passwordRules.every(r => r.check(form.password));
    return (
      form.fullName.trim() &&
      emailValid(form.email) &&
      form.username.trim() &&
      pwOk &&
      form.confirm === form.password
    );
  }, [form, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    /* Touch all fields to trigger errors */
    const allFields = mode === "login"
      ? ["username", "password"]
      : ["fullName", "email", "username", "password", "confirm"];
    setTouched(Object.fromEntries(allFields.map(f => [f, true])));
    if (!canSubmit) return;

    setLoading(true);
    setServerError("");
    try {
      if (mode === "login") {
        await login({ username: form.username, password: form.password });
      } else {
        await signup({ fullName: form.fullName, username: form.username, email: form.email, password: form.password });
      }
      navigate("/home");
    } catch (err) {
      setServerError(err?.response?.data?.message || err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrength(form.password);

  return (
    <div className="auth-form-wrap">

            {/* Mode toggle */}
            <div className="auth-toggle">
              <button
                className={`at-btn ${mode === "login" ? "at-btn--active" : ""}`}
                onClick={() => { setMode("login"); setTouched({}); setServerError(""); }}
                type="button"
              >
                Login
              </button>
              <button
                className={`at-btn ${mode === "signup" ? "at-btn--active" : ""}`}
                onClick={() => { setMode("signup"); setTouched({}); setServerError(""); }}
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
                    className={`field-input ${touched.fullName && errors.fullName ? "field-input--err" : ""}`}
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
                    className={`field-input ${touched.email && errors.email ? "field-input--err" : touched.email && form.email && emailValid(form.email) ? "field-input--ok" : ""}`}
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
                  className={`field-input ${touched.username && errors.username ? "field-input--err" : ""}`}
                  placeholder="username"
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
                    className={`field-input field-input--pw ${touched.password && errors.password ? "field-input--err" : ""}`}
                    type={showPw ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={set("password")}
                    onBlur={touch("password")}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                  />
                  <button type="button" className="pw-eye" onClick={() => setShowPw(v => !v)}>
                    <EyeIcon open={showPw} />
                  </button>
                </div>

                {/* Strength bar (signup only) */}
                {mode === "signup" && form.password && (
                  <div className="pw-strength">
                    <div className="pw-bar">
                      {[1,2,3,4,5].map(i => (
                        <div
                          key={i}
                          className="pw-bar-seg"
                          style={{ background: i <= strength ? strengthColor[strength] : "var(--color-border)" }}
                        />
                      ))}
                    </div>
                    <span className="pw-bar-label" style={{ color: strengthColor[strength] }}>
                      {strengthLabel[strength]}
                    </span>
                  </div>
                )}

                {/* Requirements checklist (signup only) */}
                {mode === "signup" && (touched.password || form.password) && (
                  <ul className="pw-rules">
                    {passwordRules.map((r, i) => (
                      <li key={i} className={`pw-rule ${r.check(form.password) ? "pw-rule--pass" : ""}`}>
                        <CheckIcon pass={r.check(form.password)} />
                        <span>{r.label}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {mode === "login" && touched.password && errors.password && (
                  <p className="field-err">{errors.password}</p>
                )}
              </div>

              {/* Confirm password (signup only) */}
              {mode === "signup" && (
                <div className="field">
                  <label className="field-label">Confirm Password</label>
                  <div className="field-pw-wrap">
                    <input
                      className={`field-input field-input--pw ${touched.confirm && errors.confirm ? "field-input--err" : touched.confirm && form.confirm && form.confirm === form.password ? "field-input--ok" : ""}`}
                      type={showCf ? "text" : "password"}
                      placeholder="Repeat your password"
                      value={form.confirm}
                      onChange={set("confirm")}
                      onBlur={touch("confirm")}
                      autoComplete="new-password"
                    />
                    <button type="button" className="pw-eye" onClick={() => setShowCf(v => !v)}>
                      <EyeIcon open={showCf} />
                    </button>
                  </div>
                  {touched.confirm && errors.confirm && (
                    <p className="field-err">{errors.confirm}</p>
                  )}
                  {touched.confirm && form.confirm && form.confirm === form.password && (
                    <p className="field-ok">Passwords match!</p>
                  )}
                </div>
              )}

              {/* Server error */}
              {serverError && (
                <div className="server-err">{serverError}</div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading
                  ? "Please wait…"
                  : mode === "login" ? "Login to SaySo" : "Create My Account"}
              </button>

              {/* Switch mode */}
              <p className="auth-switch">
                {mode === "login"
                  ? <>Don't have an account? <button type="button" className="auth-switch-btn" onClick={() => { setMode("signup"); setTouched({}); }}>Sign Up</button></>
                  : <>Already have an account? <button type="button" className="auth-switch-btn" onClick={() => { setMode("login"); setTouched({}); }}>Login</button></>
                }
              </p>
            </form>
          </div>
  );
}
