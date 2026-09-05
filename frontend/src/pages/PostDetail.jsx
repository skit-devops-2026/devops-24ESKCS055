import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockPosts } from "../data/mockPosts";
import { useAuth } from "../context/AuthContext";
import AppNavbar from "../components/AppNavbar";
import "./PostDetail.css";

import { getSeeded, timeAgo, OpinionCard } from "../utils/postDetailUtils";

export default function PostDetail() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const { user }    = useAuth();

  const found = mockPosts.find((p) => p._id === id);
  const [post, setPost] = useState(found);

  const seeded = getSeeded(id);
  const [opinions, setOpinions] = useState(seeded);

  const [activeTab, setActiveTab]   = useState("for");
  const [draftFor, setDraftFor]     = useState("");
  const [draftAgainst, setDraftAgainst] = useState("");
  const [liked, setLiked]           = useState(false);
  const [search, setSearch]         = useState("");

  if (!post) {
    return (
      <>
        <AppNavbar search={search} setSearch={setSearch} />
        <div className="pd-not-found">Post not found. <button onClick={() => navigate("/home")}>Go back</button></div>
      </>
    );
  }

  const isOwner = post.author._id === user?._id;
  const initials = (post.author?.fullName || "?").charAt(0).toUpperCase();

  const handleLike = () => {
    setLiked((v) => !v);
    setPost((prev) => ({
      ...prev,
      likes: liked ? prev.likes.slice(0, -1) : [...prev.likes, user._id],
    }));
  };

  const submitOpinion = (side) => {
    const text = side === "for" ? draftFor.trim() : draftAgainst.trim();
    if (!text) return;
    const newOp = {
      id:     Date.now(),
      author: user?.fullName || "You",
      time:   "just now",
      text,
    };
    setOpinions((prev) => ({
      ...prev,
      [side]: [newOp, ...prev[side]],
    }));
    side === "for" ? setDraftFor("") : setDraftAgainst("");
    setActiveTab(side);
  };

  const forCount     = opinions.for.length;
  const againstCount = opinions.against.length;

  return (
    <>
      <AppNavbar search={search} setSearch={setSearch} />

      <div className="pd-page">
        <div className="pd-container">

          {/* Back */}
          <button className="pd-back" onClick={() => navigate("/home")}>
            ← Back to debates
          </button>

          {/* Post header */}
          <div className="pd-header">
            <span className="pd-category">{post.category}</span>
            <h1 className="pd-title">{post.title}</h1>

            <div className="pd-meta-row">
              <div className="pd-author-wrap">
                <div className="pd-avatar">{initials}</div>
                <div>
                  <span className="pd-author-name">{post.author.fullName}</span>
                  <span className="pd-time">{timeAgo(post.createdAt)}</span>
                </div>
              </div>

              <div className="pd-actions">
                <button
                  className={`pd-like-btn ${liked ? "pd-like-btn--active" : ""}`}
                  onClick={handleLike}
                >
                  <svg viewBox="0 0 18 18" fill={liked ? "currentColor" : "none"} width="15" height="15" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 15.5S2 11 2 6a5 5 0 0 1 7-4.58A5 5 0 0 1 16 6c0 5-7 9.5-7 9.5z"/>
                  </svg>
                  {post.likes.length}
                </button>

                {isOwner && (
                  <button className="pd-delete-btn" onClick={() => navigate("/home")}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Full description */}
          <div className="pd-body">
            <p className="pd-description">{post.description}</p>
          </div>

          {/* ── Opinion section ── */}
          <div className="pd-opinions">
            <div className="pd-opinions-top">
              <h3 className="pd-opinions-heading">Opinions</h3>

              {/* For/Against percentage based on opinion count */}
              {(forCount + againstCount) > 0 && (
                <div className="pd-pct-wrap">
                  <div className="pd-pct-labels">
                    <span className="pd-pct-for">
                      For — {Math.round((forCount / (forCount + againstCount)) * 100)}%
                    </span>
                    <span className="pd-pct-against">
                      Against — {Math.round((againstCount / (forCount + againstCount)) * 100)}%
                    </span>
                  </div>
                  <div className="pd-pct-bar">
                    <div
                      className="pd-pct-fill"
                      style={{ width: `${Math.round((forCount / (forCount + againstCount)) * 100)}%` }}
                    />
                  </div>
                  <p className="pd-pct-note">{forCount + againstCount} opinion{forCount + againstCount !== 1 ? "s" : ""} shared</p>
                </div>
              )}
            </div>

            {/* Tab switcher */}
            <div className="pd-tabs">
              <button
                className={`pd-tab pd-tab--for ${activeTab === "for" ? "pd-tab--active-for" : ""}`}
                onClick={() => setActiveTab("for")}
              >
                For
                <span className="pd-tab-count">{forCount}</span>
              </button>
              <button
                className={`pd-tab pd-tab--against ${activeTab === "against" ? "pd-tab--active-against" : ""}`}
                onClick={() => setActiveTab("against")}
              >
                Against
                <span className="pd-tab-count">{againstCount}</span>
              </button>
            </div>

            {/* Write opinion */}
            <div className={`pd-compose pd-compose--${activeTab}`}>
              <textarea
                className="pd-compose-input"
                placeholder={
                  activeTab === "for"
                    ? "Write your argument in favour of this topic…"
                    : "Write your argument against this topic…"
                }
                value={activeTab === "for" ? draftFor : draftAgainst}
                onChange={(e) =>
                  activeTab === "for"
                    ? setDraftFor(e.target.value)
                    : setDraftAgainst(e.target.value)
                }
                rows={3}
              />
              <div className="pd-compose-footer">
                <span className="pd-compose-hint">
                  Be respectful. Make your reasoning clear.
                </span>
                <button
                  className={`pd-submit-btn pd-submit-btn--${activeTab}`}
                  onClick={() => submitOpinion(activeTab)}
                  disabled={activeTab === "for" ? !draftFor.trim() : !draftAgainst.trim()}
                >
                  Post {activeTab === "for" ? "For" : "Against"}
                </button>
              </div>
            </div>

            {/* Opinion list */}
            <div className="pd-opinion-list">
              {opinions[activeTab].length === 0 ? (
                <div className="pd-no-opinions">
                  No {activeTab === "for" ? "For" : "Against"} opinions yet.
                  Be the first to share your view.
                </div>
              ) : (
                opinions[activeTab].map((op) => (
                  <OpinionCard key={op.id} opinion={op} side={activeTab} />
                ))
              )}
            </div>
          </div>

        </div>
      </div>

          </>
  );
}