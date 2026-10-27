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
                Real discussions.<br />One stance per topic.
              </h2>
              <p className="auth-left-sub">
                Read the debate topic, pick your side, and write your response.
                Closed debates stay open to read any time.
              </p>

              <ul className="auth-left-list">
                {[
                  "A shared debate topic for everyone",
                  "Choose For, Against, or Neutral",
                  "Your stance is locked once confirmed",
                  "Browse closed debates anytime",
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
