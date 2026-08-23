import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AppNavbar = ({ search, setSearch }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <nav className="app-navbar">
        <Link to="/home" className="an-logo">
          <span className="an-logo-say">Say</span>
          <span className="an-logo-so">So</span>
          <span className="an-logo-dot" />
        </Link>

        <div className="an-search-wrap">
          <svg className="an-search-icon" viewBox="0 0 20 20" fill="none">
            <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            className="an-search"
            placeholder="Search topics, issues, debates…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="an-right">
          <button className="an-profile-btn" onClick={() => navigate(`/profile/${user._id}`)}>
            <div className="an-avatar-ring">
              <div className="an-avatar">{user?.fullName?.charAt(0) || "U"}</div>
            </div>
            <span className="an-username">{user?.username}</span>
          </button>
        </div>
      </nav>

      <style>{`
        .app-navbar {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 0 32px;
          height: 64px;
          background: rgba(248, 246, 241, 0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--color-border);
          position: sticky;
          top: 0;
          z-index: 50;
          box-shadow: 0 1px 0 rgba(255,255,255,0.7), 0 4px 20px rgba(43, 43, 43, 0.04);
        }

        /* Logo */
        .an-logo {
          display: flex;
          align-items: center;
          gap: 2px;
          text-decoration: none;
          flex-shrink: 0;
          position: relative;
        }
        .an-logo-say {
          font-family: 'Fraunces', serif;
          font-size: 22px;
          font-weight: 700;
          color: var(--color-primary);
          letter-spacing: -0.5px;
        }
        .an-logo-so {
          font-family: 'Fraunces', serif;
          font-size: 22px;
          font-weight: 700;
          color: var(--color-accent);
          letter-spacing: -0.5px;
        }
        .an-logo-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-accent);
          position: absolute;
          bottom: 2px;
          right: -8px;
        }

        /* Search */
        .an-search-wrap {
          flex: 1;
          max-width: 500px;
          margin: 0 auto;
          position: relative;
        }
        .an-search-icon {
          width: 16px;
          height: 16px;
          color: var(--color-muted);
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }
        .an-search {
          width: 100%;
          padding: 10px 14px 10px 40px;
          border: 1.5px solid var(--color-border);
          border-radius: 10px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          background: var(--color-surface);
          color: var(--color-text);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .an-search:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(62, 98, 89, 0.1);
        }
        .an-search::placeholder { color: var(--color-muted); }

        /* Right section */
        .an-right { display: flex; align-items: center; flex-shrink: 0; }

        .an-profile-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px 10px;
          border-radius: 10px;
          transition: background 0.15s ease;
        }
        .an-profile-btn:hover { background: var(--color-primary-tint); }

        .an-avatar-ring {
          padding: 2px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
        }
        .an-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: var(--color-primary);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          border: 2px solid var(--color-bg);
        }
        .an-username {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-text);
        }

        @media (max-width: 600px) {
          .app-navbar { padding: 0 16px; gap: 12px; }
          .an-username { display: none; }
          .an-search-wrap { max-width: unset; }
        }
      `}</style>
    </>
  );
};

export default AppNavbar;