import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AppNavbar = ({ search, setSearch }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <nav className="app-navbar">
        <Link to="/home" className="an-logo">Sayso</Link>

        <input
          className="an-search input-field"
          placeholder="Search topics, issues, debates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="an-profile" onClick={() => navigate(`/profile/${user._id}`)}>
          <div className="an-avatar">{user?.fullName?.charAt(0) || "U"}</div>
        </button>
      </nav>

      <style>{`
        .app-navbar {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 14px 32px;
          background: var(--color-surface);
          border-bottom: 1px solid var(--color-border);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .an-logo {
          font-family: 'Fraunces', serif;
          font-size: 22px;
          font-weight: 700;
          color: var(--color-primary);
          flex-shrink: 0;
        }

        .an-search {
          flex: 1;
          max-width: 480px;
          margin: 0 auto;
        }

        .an-profile {
          background: none;
          border: none;
          flex-shrink: 0;
        }

        .an-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--color-primary);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }
      `}</style>
    </>
  );
};

export default AppNavbar;