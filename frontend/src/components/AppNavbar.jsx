import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AppNavbar = ({ search = "", setSearch }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [localSearch, setLocalSearch] = useState(search);

  // Sync internal state when search prop changes (e.g., when Clear Filters is clicked)
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Debounce search update to parent state by ~250ms
  useEffect(() => {
    if (!setSearch) return;
    const timer = setTimeout(() => {
      setSearch(localSearch);
    }, 250);
    return () => clearTimeout(timer);
  }, [localSearch, setSearch]);

  const handleClear = () => {
    setLocalSearch("");
    if (setSearch) setSearch("");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <nav className="an-nav">
        <div className="an-inner">

          {/* Logo — left */}
          <Link to={user?.role === "admin" ? "/admin" : "/home"} className="an-logo">
            <span className="an-say">Say</span><span className="an-so">So</span>
            {user?.role === "admin" && (
              <span className="an-admin-tag">ADMIN</span>
            )}
          </Link>

          {/* Search — center, takes remaining space */}
          {setSearch ? (
            <div className="an-search-wrap">
              <svg className="an-search-icon" viewBox="0 0 18 18" fill="none" width="14" height="14">
                <circle cx="7.5" cy="7.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 12l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                className="an-search"
                placeholder="Search debates by title or description…"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
              {localSearch && (
                <button
                  type="button"
                  className="an-clear-btn"
                  onClick={handleClear}
                  aria-label="Clear search"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          ) : (
            <div className="an-search-spacer" />
          )}

          {/* Right group: settings + profile + logout */}
          <div className="an-right">

            {/* Settings link for standard user */}
            {user?.role !== "admin" && (
              <button
                type="button"
                className="an-nav-action-btn"
                onClick={() => navigate("/settings")}
                title="Account Settings"
              >
                Settings
              </button>
            )}

            {/* Profile Display */}
            <div className="an-profile">
              <div className="an-avatar">
                {user?.fullName?.charAt(0) || user?.username?.charAt(0) || "U"}
              </div>
              <span className="an-username">{user?.fullName || user?.username}</span>
            </div>

            {/* Logout available on every logged-in page */}
            <button
              type="button"
              className="an-logout-btn"
              onClick={handleLogout}
              title="Log Out"
            >
              Logout
            </button>

          </div>
        </div>
      </nav>

      <style>{`
        /* ── Navbar shell — full width, sticky ── */
        .an-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(248, 246, 241, 0.93);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--color-border);
        }

        /* ── Inner: constrained + centred, same max-width as the page ── */
        .an-inner {
          max-width: 1140px;
          margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        /* Logo */
        .an-logo {
          display: flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .an-say {
          font-family: 'Fraunces', serif;
          font-size: 22px;
          font-weight: 700;
          color: var(--color-primary);
          letter-spacing: -0.3px;
        }
        .an-so {
          font-family: 'Fraunces', serif;
          font-size: 22px;
          font-weight: 700;
          color: var(--color-accent);
          letter-spacing: -0.3px;
        }
        .an-admin-tag {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.8px;
          padding: 2px 6px;
          background: var(--color-primary);
          color: #fff;
          border-radius: 4px;
          margin-left: 2px;
        }

        /* Search — grows to fill remaining space */
        .an-search-wrap {
          flex: 1;
          position: relative;
          min-width: 0;
        }
        .an-search-spacer {
          flex: 1;
        }
        .an-search-icon {
          position: absolute;
          left: 11px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-muted);
          pointer-events: none;
        }
        .an-search {
          width: 100%;
          padding: 9px 34px 9px 34px;
          border: 1.5px solid var(--color-border);
          border-radius: 9px;
          font-size: 13.5px;
          font-family: 'Inter', sans-serif;
          background: var(--color-surface);
          color: var(--color-text);
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .an-search::placeholder { color: var(--color-muted); }
        .an-search:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(62,98,89,0.08);
        }
        .an-clear-btn {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--color-muted);
          cursor: pointer;
          font-size: 13px;
          padding: 2px 6px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
        .an-clear-btn:hover {
          color: var(--color-text);
          background: rgba(0, 0, 0, 0.06);
        }

        /* Right group */
        .an-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .an-nav-action-btn {
          padding: 7px 12px;
          background: transparent;
          border: 1.5px solid var(--color-border);
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          color: var(--color-text);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .an-nav-action-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        /* Profile display */
        .an-profile {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 6px;
          border-radius: 9px;
          user-select: none;
        }
        .an-avatar {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: var(--color-primary);
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .an-username {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-text);
          white-space: nowrap;
        }

        /* Logout button */
        .an-logout-btn {
          padding: 7px 12px;
          background: transparent;
          border: 1.5px solid var(--color-border);
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          color: var(--color-muted);
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }
        .an-logout-btn:hover {
          border-color: var(--color-against);
          color: var(--color-against);
          background: rgba(217, 107, 39, 0.05);
        }

        @media (max-width: 680px) {
          .an-inner { padding: 0 14px; gap: 8px; }
          .an-username { display: none; }
          .an-nav-action-btn { display: none; }
        }
      `}</style>
    </>
  );
};

export default AppNavbar;