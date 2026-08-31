import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AppNavbar = ({ search, setSearch, onOpenCreate }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (user?._id) {
      navigate(`/profile/${user._id}`);
    } else {
      navigate("/home");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  return (
    <>
      <nav className="app-navbar">
        <Link to="/home" className="an-logo">
          Sayso
        </Link>

        {setSearch ? (
          <input
            className="an-search input-field"
            placeholder="Search topics, issues, debates..."
            value={search || ""}
            onChange={(e) => setSearch(e.target.value)}
          />
        ) : (
          <div className="an-spacer" />
        )}

        <div className="an-right">
          {onOpenCreate && (
            <button className="btn btn-primary an-create-btn" onClick={onOpenCreate}>
              + Start Debate
            </button>
          )}

          <button
            className="an-profile"
            onClick={handleProfileClick}
            title={user?.fullName || "Your Profile"}
          >
            <div className="an-avatar">{user?.fullName?.charAt(0) || "U"}</div>
          </button>

          <button
            className="btn btn-ghost an-logout-btn"
            onClick={handleLogout}
            title="Log out"
          >
            Logout
          </button>
        </div>
      </nav>

      <style>{`
        .app-navbar {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 12px 32px;
          background: var(--color-surface);
          border-bottom: 1px solid var(--color-border);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .an-logo {
          font-family: 'Fraunces', serif;
          font-size: 24px;
          font-weight: 700;
          color: var(--color-primary);
          flex-shrink: 0;
        }

        .an-search {
          flex: 1;
          max-width: 440px;
          margin: 0 auto;
        }

        .an-spacer { flex: 1; }

        .an-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .an-create-btn {
          padding: 8px 16px;
          font-size: 13px;
        }

        .an-profile {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
        }

        .an-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--color-primary);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
          transition: opacity 0.2s;
        }
        .an-avatar:hover { opacity: 0.85; }

        .an-logout-btn {
          padding: 6px 12px;
          font-size: 12px;
        }
      `}</style>
    </>
  );
};

export default AppNavbar;