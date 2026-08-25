import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
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

export default function AuthPage() {
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
    <>
      <div className="auth-page">

        {/* ── Left panel ── */}
        <div className="auth-left">
          <div className="auth-left-inner">
            <Link to="/" className="auth-brand">
              <span className="ab-say">Say</span><span className="ab-so">So</span>
            </Link>

            <div className="auth-left-content">
              <h2 className="auth-left-h2">
                Where real opinions<br />shape public debate.
              </h2>
              <p className="auth-left-sub">
                Join thousands of everyday people debating the issues that matter —
                local, political, global, and beyond.
              </p>

              <ul className="auth-left-list">
                {[
                  "Post your take on any issue",
                  "Vote For or Against with your reasoning",
                  "Follow voices you respect",
                  "10 categories, unlimited debates",
                ].map((item, i) => (
                  <li key={i} className="auth-left-li">
                    <span className="auth-left-check">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Decorative rings */}
            <div className="auth-left-deco">
              <div className="ald-ring ald-r1" />
              <div className="ald-ring ald-r2" />
              <div className="ald-ring ald-r3" />
            </div>
          </div>
        </div>

        {/* ── Right panel — form ── */}
        <div className="auth-right">
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
        </div>
      </div>

      <style>{`
        /* ── Layout ── */
        .auth-page {
          min-height: 100dvh;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        /* ══════ LEFT PANEL ══════ */
        .auth-left {
          background: linear-gradient(160deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: stretch;
        }
        .auth-left-inner {
          display: flex;
          flex-direction: column;
          padding: 48px 52px;
          position: relative;
          z-index: 1;
          width: 100%;
        }

        /* Brand */
        .auth-brand {
          display: flex;
          align-items: baseline;
          text-decoration: none;
          margin-bottom: auto;
        }
        .ab-say {
          font-family: 'Fraunces', serif;
          font-size: 28px;
          font-weight: 700;
          color: rgba(255,255,255,0.95);
          letter-spacing: -0.5px;
        }
        .ab-so {
          font-family: 'Fraunces', serif;
          font-size: 28px;
          font-weight: 700;
          color: var(--color-accent);
          letter-spacing: -0.5px;
        }

        /* Content */
        .auth-left-content {
          margin-top: auto;
          padding-bottom: 20px;
        }
        .auth-left-h2 {
          font-family: 'Fraunces', serif;
          font-size: clamp(24px, 3vw, 36px);
          font-weight: 700;
          color: #fff;
          line-height: 1.25;
          letter-spacing: -0.5px;
          margin-bottom: 16px;
        }
        .auth-left-sub {
          font-size: 14px;
          line-height: 1.75;
          color: rgba(255,255,255,0.6);
          margin-bottom: 32px;
          max-width: 340px;
        }
        .auth-left-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .auth-left-li {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          color: rgba(255,255,255,0.8);
          font-weight: 500;
        }
        .auth-left-check {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          color: var(--color-accent);
          font-weight: 700;
          flex-shrink: 0;
        }

        /* Decorative rings */
        .auth-left-deco {
          position: absolute;
          top: -80px;
          right: -80px;
          pointer-events: none;
        }
        .ald-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.06);
        }
        .ald-r1 { width: 200px; height: 200px; }
        .ald-r2 { width: 340px; height: 340px; }
        .ald-r3 { width: 480px; height: 480px; }

        /* ══════ RIGHT PANEL ══════ */
        .auth-right {
          background: var(--color-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          overflow-y: auto;
        }
        .auth-form-wrap {
          width: 100%;
          max-width: 420px;
        }

        /* Toggle */
        .auth-toggle {
          display: flex;
          background: var(--color-surface);
          border: 1.5px solid var(--color-border);
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 30px;
          gap: 4px;
        }
        .at-btn {
          flex: 1;
          padding: 10px;
          border: none;
          background: transparent;
          border-radius: 9px;
          font-size: 14px;
          font-weight: 600;
          color: var(--color-muted);
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .at-btn:hover { color: var(--color-primary); }
        .at-btn--active {
          background: var(--color-primary);
          color: #fff;
        }

        .auth-form-title {
          font-family: 'Fraunces', serif;
          font-size: 26px;
          font-weight: 700;
          color: var(--color-primary-dark);
          margin-bottom: 6px;
          letter-spacing: -0.3px;
        }
        .auth-form-sub {
          font-size: 13.5px;
          color: var(--color-muted);
          margin-bottom: 28px;
        }

        /* ── Form ── */
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        /* Fields */
        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .field-label {
          font-size: 12.5px;
          font-weight: 700;
          color: var(--color-text);
          letter-spacing: 0.1px;
        }
        .field-input {
          width: 100%;
          padding: 11px 14px;
          border: 1.5px solid var(--color-border);
          border-radius: 10px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          background: var(--color-surface);
          color: var(--color-text);
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          outline: none;
        }
        .field-input::placeholder { color: var(--color-muted); }
        .field-input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(62, 98, 89, 0.1);
        }
        .field-input--err {
          border-color: var(--color-against) !important;
          box-shadow: 0 0 0 3px rgba(193,102,107,0.1) !important;
        }
        .field-input--ok {
          border-color: var(--color-for) !important;
          box-shadow: 0 0 0 3px rgba(76,140,91,0.1) !important;
        }
        .field-input--pw { padding-right: 44px; }

        .field-pw-wrap {
          position: relative;
        }
        .pw-eye {
          position: absolute;
          right: 13px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-muted);
          padding: 2px;
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }
        .pw-eye:hover { color: var(--color-primary); }

        .field-err {
          font-size: 12px;
          color: var(--color-against);
          font-weight: 500;
          display: flex;
          align-items: flex-start;
          gap: 5px;
          line-height: 1.4;
        }
        .field-err::before {
          content: '!';
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--color-against);
          color: #fff;
          font-size: 9px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .field-ok {
          font-size: 12px;
          color: var(--color-for);
          font-weight: 600;
        }

        /* ── Password strength bar ── */
        .pw-strength {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 4px;
        }
        .pw-bar {
          display: flex;
          gap: 4px;
          flex: 1;
        }
        .pw-bar-seg {
          flex: 1;
          height: 4px;
          border-radius: 4px;
          transition: background 0.2s ease;
        }
        .pw-bar-label {
          font-size: 11.5px;
          font-weight: 700;
          min-width: 60px;
          text-align: right;
          transition: color 0.2s ease;
        }

        /* ── Password rules checklist ── */
        .pw-rules {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
          background: var(--color-primary-tint);
          border: 1px solid rgba(62,98,89,0.12);
          border-radius: 10px;
          padding: 12px 14px;
          margin-top: 4px;
        }
        .pw-rule {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--color-muted);
          transition: color 0.15s ease;
        }
        .pw-rule--pass { color: var(--color-for); font-weight: 600; }

        /* ── Server error ── */
        .server-err {
          background: rgba(193,102,107,0.09);
          border: 1.5px solid rgba(193,102,107,0.3);
          border-radius: 10px;
          padding: 11px 14px;
          font-size: 13px;
          color: var(--color-against);
          font-weight: 500;
        }

        /* ── Submit button ── */
        .auth-submit {
          width: 100%;
          padding: 13px;
          background: var(--color-primary);
          color: #fff;
          border: none;
          border-radius: 11px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
          box-shadow: 0 4px 16px rgba(62,98,89,0.28);
          margin-top: 4px;
        }
        .auth-submit:hover:not(:disabled) {
          background: var(--color-primary-dark);
          transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(62,98,89,0.36);
        }
        .auth-submit:disabled { cursor: not-allowed; }

        /* ── Switch link ── */
        .auth-switch {
          text-align: center;
          font-size: 13px;
          color: var(--color-muted);
          margin-top: 4px;
        }
        .auth-switch-btn {
          background: none;
          border: none;
          color: var(--color-primary);
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        /* ══════ RESPONSIVE ══════ */
        @media (max-width: 860px) {
          .auth-page { grid-template-columns: 1fr; }
          .auth-left  { display: none; }
          .auth-right { min-height: 100dvh; padding: 32px 24px; }
        }
        @media (max-width: 400px) {
          .auth-right { padding: 24px 16px; }
        }
      `}</style>
    </>
  );
}