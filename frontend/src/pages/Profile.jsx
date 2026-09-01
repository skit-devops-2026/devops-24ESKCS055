import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockPosts } from "../data/mockPosts";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import AddPostModal from "../components/AddPostModal";
import AppNavbar from "../components/AppNavbar";
import "./Profile.css";

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

          </>
  );
};

export default Profile;