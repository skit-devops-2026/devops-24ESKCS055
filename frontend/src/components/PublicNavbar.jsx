import React from "react";
import { Link } from "react-router-dom";

const PublicNavbar = () => {
  return (
    <>
      <nav className="public-navbar">
        <div className="pn-logo">Sayso</div>
        <Link to="/auth" className="btn btn-primary">Login / Sign Up</Link>
      </nav>

      <style>{`
        .public-navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 48px;
          background: var(--color-surface);
          border-bottom: 1px solid var(--color-border);
        }

        .pn-logo {
          font-family: 'Fraunces', serif;
          font-size: 26px;
          font-weight: 700;
          color: var(--color-primary);
        }
      `}</style>
    </>
  );
};

export default PublicNavbar;