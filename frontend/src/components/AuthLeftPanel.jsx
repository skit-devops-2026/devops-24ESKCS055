import React from "react";
import { Link } from "react-router-dom";

export default function AuthLeftPanel() {
  return (
    <>
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
    </>
  );
}
