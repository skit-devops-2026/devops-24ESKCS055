import React from "react";
import { Link } from "react-router-dom";

const PublicNavbar = () => {
  return (
    <>
      <nav className="pub-nav">
        <div className="pub-nav-inner">

          {/* Logo — left */}
          <div className="pub-logo">
            <span className="pub-logo-s1">S</span>
            <span className="pub-logo-ay">ay</span>
            <span className="pub-logo-s2">S</span>
            <span className="pub-logo-o">o</span>
          </div>

          {/* Links — center */}
          <div className="pub-nav-links">
            <a href="#features" className="pub-nav-link">Features</a>
            <a href="#how" className="pub-nav-link">How it works</a>
            <a href="#topics" className="pub-nav-link">Topics</a>
          </div>

          {/* CTA — right */}
          <Link to="/auth" className="pub-nav-cta">Login / Sign Up</Link>

        </div>
      </nav>

      <style>{`
        .pub-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          background: rgba(248, 246, 241, 0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(229, 225, 216, 0.7);
        }
        .pub-nav-inner {
          max-width: 1140px;
          margin: 0 auto;
          padding: 0 40px;
          height: 66px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* ── Logo ── */
        .pub-logo {
          display: flex;
          align-items: baseline;
          cursor: default;
          user-select: none;
          flex-shrink: 0;
        }
        .pub-logo-s1, .pub-logo-ay, .pub-logo-s2, .pub-logo-o {
          font-family: 'Fraunces', serif;
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        .pub-logo-s1 { color: var(--color-primary); }
        .pub-logo-ay { color: var(--color-primary); }
        .pub-logo-s2 { color: var(--color-accent); }
        .pub-logo-o  { color: var(--color-accent); }

        /* ── Center links ── */
        .pub-nav-links {
          display: flex;
          align-items: center;
          gap: 36px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        .pub-nav-link {
          font-size: 14px;
          font-weight: 500;
          color: var(--color-muted);
          text-decoration: none;
          transition: color 0.15s ease;
          white-space: nowrap;
        }
        .pub-nav-link:hover { color: var(--color-primary-dark); }

        /* ── CTA ── */
        .pub-nav-cta {
          flex-shrink: 0;
          padding: 10px 22px;
          background: var(--color-primary);
          color: #fff;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.15s ease, transform 0.15s ease;
          white-space: nowrap;
        }
        .pub-nav-cta:hover {
          background: var(--color-primary-dark);
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .pub-nav-inner { padding: 0 20px; }
          .pub-nav-links { display: none; }
        }
        @media (max-width: 400px) {
          .pub-logo-s1, .pub-logo-ay, .pub-logo-s2, .pub-logo-o { font-size: 22px; }
          .pub-nav-cta { font-size: 12px; padding: 8px 14px; }
        }
      `}</style>
    </>
  );
};

export default PublicNavbar;