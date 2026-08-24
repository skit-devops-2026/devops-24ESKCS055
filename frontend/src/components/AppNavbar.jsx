import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BellIcon = () => (
  <svg viewBox="0 0 22 22" fill="none" width="18" height="18"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 9A6 6 0 0 0 5 9c0 4-2 5-2 5h16s-2-1-2-5"/>
    <path d="M12.73 19a2 2 0 0 1-3.46 0"/>
  </svg>
);

const AppNavbar = ({ search, setSearch }) => {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    { id: 1, text: "Rohan Verma shared a For opinion on your post.", time: "2m ago" },
    { id: 2, text: "Your debate got 5 new opinions.",                time: "1h ago" },
    { id: 3, text: "Priya Kapoor started following you.",            time: "3h ago" },
  ];

  return (
    <>
      <nav className="an-nav">
        <div className="an-inner">

          {/* Logo — left */}
          <Link to="/home" className="an-logo">
            <span className="an-say">Say</span><span className="an-so">So</span>
          </Link>

          {/* Search — center, takes remaining space */}
          <div className="an-search-wrap">
            <svg className="an-search-icon" viewBox="0 0 18 18" fill="none" width="14" height="14">
              <circle cx="7.5" cy="7.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M12 12l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              className="an-search"
              placeholder="Search debates…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Right group: notification + profile */}
          <div className="an-right">

            {/* Bell */}
            <div className="an-notif-wrap">
              <button
                className={`an-bell ${notifOpen ? "an-bell--open" : ""}`}
                onClick={() => setNotifOpen((v) => !v)}
                aria-label="Notifications"
              >
                <BellIcon />
                <span className="an-badge">{notifications.length}</span>
              </button>

              {notifOpen && (
                <>
                  <div className="an-backdrop" onClick={() => setNotifOpen(false)} />
                  <div className="an-dropdown">
                    <div className="an-dropdown-title">Notifications</div>
                    <ul className="an-notif-list">
                      {notifications.map((n) => (
                        <li key={n.id} className="an-notif-item">
                          <span className="an-notif-dot" />
                          <div>
                            <p className="an-notif-text">{n.text}</p>
                            <span className="an-notif-time">{n.time}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>

            {/* Profile */}
            <button className="an-profile" onClick={() => navigate(`/profile/${user._id}`)}>
              <div className="an-avatar">{user?.fullName?.charAt(0) || "U"}</div>
              <span className="an-username">{user?.username}</span>
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
          align-items: baseline;
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

        /* Search — grows to fill remaining space */
        .an-search-wrap {
          flex: 1;
          position: relative;
          min-width: 0;
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
          padding: 9px 14px 9px 34px;
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

        /* Right group */
        .an-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        /* Bell button */
        .an-notif-wrap { position: relative; }
        .an-bell {
          width: 38px;
          height: 38px;
          border-radius: 9px;
          border: 1.5px solid var(--color-border);
          background: var(--color-surface);
          color: var(--color-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
        }
        .an-bell:hover, .an-bell--open {
          border-color: var(--color-primary);
          color: var(--color-primary);
          background: var(--color-primary-tint);
        }
        .an-badge {
          position: absolute;
          top: -4px; right: -4px;
          width: 15px; height: 15px;
          background: var(--color-against);
          color: #fff;
          font-size: 9px;
          font-weight: 700;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid var(--color-bg);
        }

        /* Notification dropdown */
        .an-backdrop {
          position: fixed;
          inset: 0;
          z-index: 98;
        }
        .an-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 290px;
          background: var(--color-surface);
          border: 1.5px solid var(--color-border);
          border-radius: 12px;
          box-shadow: 0 8px 28px rgba(43,43,43,0.11);
          z-index: 99;
          overflow: hidden;
        }
        .an-dropdown-title {
          padding: 12px 16px;
          font-size: 12px;
          font-weight: 700;
          color: var(--color-primary-dark);
          border-bottom: 1px solid var(--color-border);
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }
        .an-notif-list { list-style: none; }
        .an-notif-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 11px 16px;
          border-bottom: 1px solid var(--color-border);
          cursor: pointer;
          transition: background 0.12s;
        }
        .an-notif-item:last-child { border-bottom: none; }
        .an-notif-item:hover { background: var(--color-primary-tint); }
        .an-notif-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--color-primary);
          flex-shrink: 0;
          margin-top: 4px;
        }
        .an-notif-text {
          font-size: 13px;
          color: var(--color-text);
          line-height: 1.45;
          margin-bottom: 2px;
        }
        .an-notif-time {
          font-size: 11.5px;
          color: var(--color-muted);
        }

        /* Profile button */
        .an-profile {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px 8px;
          border-radius: 9px;
          transition: background 0.15s;
        }
        .an-profile:hover { background: var(--color-primary-tint); }
        .an-avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: var(--color-primary);
          color: #fff;
          font-size: 14px;
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
        }

        @media (max-width: 640px) {
          .an-inner    { padding: 0 14px; gap: 10px; }
          .an-username { display: none; }
        }
      `}</style>
    </>
  );
};

export default AppNavbar;