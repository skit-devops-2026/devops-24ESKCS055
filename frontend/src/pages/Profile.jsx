import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockPosts } from "../data/mockPosts";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import AddPostModal from "../components/AddPostModal";
import AppNavbar from "../components/AppNavbar";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts]       = useState(mockPosts);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch]     = useState("");

  const myPosts = posts.filter((p) => p.author._id === user?._id || p.author.fullName === user?.fullName);

  const handleAddPost = (data) => {
    const newPost = {
      _id: Date.now().toString(),
      ...data,
      author: { _id: user._id, fullName: user.fullName, username: user.username },
      likes: [],
      votesFor: [],
      votesAgainst: [],
      createdAt: new Date().toISOString(),
    };
    setPosts([newPost, ...posts]);
  };

  const initials = (user?.fullName || "U").charAt(0).toUpperCase();

  return (
    <>
      <AppNavbar search={search} setSearch={setSearch} />

      <div className="pf-page">
        <div className="pf-container">

          {/* ── Profile card ── */}
          <div className="pf-card">
            {/* Avatar */}
            <div className="pf-avatar-wrap">
              <div className="pf-avatar">{initials}</div>
            </div>

            {/* Info */}
            <div className="pf-info">
              <h2 className="pf-name">{user?.fullName}</h2>
              <p className="pf-username">@{user?.username}</p>

              {/* Bio */}
              {user?.bio && (
                <p className="pf-bio">{user.bio}</p>
              )}

              {/* Stats row */}
              <div className="pf-stats">
                <div className="pf-stat">
                  <span className="pf-stat-num">{myPosts.length}</span>
                  <span className="pf-stat-lbl">Debates</span>
                </div>
                <div className="pf-stat-divider" />
                <div className="pf-stat">
                  <span className="pf-stat-num">128</span>
                  <span className="pf-stat-lbl">Followers</span>
                </div>
                <div className="pf-stat-divider" />
                <div className="pf-stat">
                  <span className="pf-stat-num">84</span>
                  <span className="pf-stat-lbl">Following</span>
                </div>
              </div>
            </div>

            {/* Settings button */}
            <button className="pf-settings-btn" onClick={() => navigate("/settings")}>
              <svg viewBox="0 0 20 20" fill="none" width="15" height="15" stroke="currentColor" strokeWidth="1.5">
                <circle cx="10" cy="10" r="3"/>
                <path d="M10 1v2M10 17v2M1 10h2M17 10h2M3.2 3.2l1.4 1.4M15.4 15.4l1.4 1.4M3.2 16.8l1.4-1.4M15.4 4.6l1.4-1.4"/>
              </svg>
              Settings
            </button>
          </div>

          {/* ── Posts section ── */}
          <div className="pf-posts-section">
            <div className="pf-posts-header">
              <h3 className="pf-posts-title">
                My Debates
                {myPosts.length > 0 && (
                  <span className="pf-posts-count">{myPosts.length}</span>
                )}
              </h3>
              <button className="pf-new-btn" onClick={() => setShowModal(true)}>
                + New Debate
              </button>
            </div>

            {myPosts.length === 0 ? (
              <div className="pf-empty">
                <p>You haven't posted any debates yet.</p>
                <button className="pf-new-btn" onClick={() => setShowModal(true)}>
                  Start your first debate
                </button>
              </div>
            ) : (
              <div className="pf-posts-list">
                {myPosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {showModal && (
        <AddPostModal onClose={() => setShowModal(false)} onSubmit={handleAddPost} />
      )}

      <style>{`
        .pf-page {
          min-height: 100dvh;
          background: var(--color-bg);
          padding: 36px 24px 80px;
        }

        .pf-container {
          max-width: 720px;
          margin: 0 auto;
        }

        /* ── Profile card ── */
        .pf-card {
          background: var(--color-surface);
          border: 1.5px solid var(--color-border);
          border-radius: 16px;
          padding: 28px;
          display: flex;
          align-items: flex-start;
          gap: 22px;
          margin-bottom: 28px;
          position: relative;
        }

        /* Avatar */
        .pf-avatar-wrap { flex-shrink: 0; }
        .pf-avatar {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
          color: #fff;
          font-family: 'Fraunces', serif;
          font-size: 30px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid var(--color-primary-tint);
        }

        /* Info */
        .pf-info { flex: 1; min-width: 0; }

        .pf-name {
          font-family: 'Fraunces', serif;
          font-size: 22px;
          font-weight: 700;
          color: var(--color-primary-dark);
          margin-bottom: 2px;
          letter-spacing: -0.2px;
        }

        .pf-username {
          font-size: 13.5px;
          color: var(--color-muted);
          margin-bottom: 12px;
          font-weight: 500;
        }

        /* Bio */
        .pf-bio {
          font-size: 14px;
          line-height: 1.65;
          color: var(--color-text);
          margin-bottom: 16px;
          padding: 12px 14px;
          background: var(--color-primary-tint);
          border-left: 3px solid var(--color-primary);
          border-radius: 0 8px 8px 0;
        }

        /* Stats */
        .pf-stats {
          display: flex;
          align-items: center;
          gap: 0;
        }
        .pf-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 18px 0 0;
        }
        .pf-stat:first-child { padding-left: 0; }
        .pf-stat-num {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          font-weight: 700;
          color: var(--color-primary-dark);
          line-height: 1;
        }
        .pf-stat-lbl {
          font-size: 11.5px;
          font-weight: 600;
          color: var(--color-muted);
          margin-top: 2px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .pf-stat-divider {
          width: 1px;
          height: 32px;
          background: var(--color-border);
          margin-right: 18px;
        }

        /* Settings button */
        .pf-settings-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: 1.5px solid var(--color-border);
          border-radius: 9px;
          background: transparent;
          font-size: 13px;
          font-weight: 600;
          color: var(--color-muted);
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          flex-shrink: 0;
          transition: border-color 0.15s, color 0.15s;
          align-self: flex-start;
        }
        .pf-settings-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        /* ── Posts section ── */
        .pf-posts-section { }

        .pf-posts-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .pf-posts-title {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          font-weight: 600;
          color: var(--color-primary-dark);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pf-posts-count {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: var(--color-primary);
          background: var(--color-primary-tint);
          padding: 2px 10px;
          border-radius: 20px;
        }

        .pf-new-btn {
          padding: 8px 16px;
          background: var(--color-primary);
          color: #fff;
          border: none;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: background 0.15s, transform 0.15s;
        }
        .pf-new-btn:hover {
          background: var(--color-primary-dark);
          transform: translateY(-1px);
        }

        /* Empty state */
        .pf-empty {
          text-align: center;
          padding: 56px 24px;
          background: var(--color-surface);
          border: 1.5px dashed var(--color-border);
          border-radius: 14px;
          color: var(--color-muted);
          font-size: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }

        /* Posts list */
        .pf-posts-list { }

        /* Responsive */
        @media (max-width: 600px) {
          .pf-page   { padding: 20px 14px 60px; }
          .pf-card   { flex-direction: column; align-items: center; text-align: center; }
          .pf-bio    { text-align: left; }
          .pf-stats  { justify-content: center; }
          .pf-settings-btn { align-self: center; }
        }
      `}</style>
    </>
  );
};

export default Profile;