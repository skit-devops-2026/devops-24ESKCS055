import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockPosts } from "../data/mockPosts";
import { useAuth } from "../context/AuthContext";
import AppNavbar from "../components/AppNavbar";

/* ── Seed opinions so For/Against panels feel alive ── */
const SEED_OPINIONS = {
  "1": {
    for: [
      { id: 1, author: "Rohan V.", time: "2h ago",  text: "Education is a fundamental right. Every country that invests in free higher education sees a long-term boost to its economy and social mobility. The debt burden on students today is an injustice." },
      { id: 2, author: "Sneha P.", time: "5h ago",  text: "Public universities in Germany are essentially free and produce world-class graduates. The idea that quality disappears without fees is a myth — it depends on government investment, not student tuition." },
    ],
    against: [
      { id: 3, author: "Arjun M.", time: "3h ago",  text: "Free for whom? Taxpayers fund it, including people who never attended college. It is a wealth transfer from the less educated to the more educated. A targeted scholarship system is fairer." },
      { id: 4, author: "Priya K.", time: "6h ago",  text: "When education is free, universities lose the incentive to improve. Competition and accountability require that institutions depend on satisfied students — not just guaranteed government cheques." },
    ],
  },
  "2": {
    for: [
      { id: 1, author: "Aditi S.", time: "1h ago",  text: "City dwellers spend over 2 hours daily in traffic. A functioning metro system would not only reduce pollution but give people back hundreds of hours a year. This is a quality-of-life issue." },
    ],
    against: [
      { id: 2, author: "Rahul G.", time: "4h ago",  text: "Public transport projects in India have repeatedly gone over budget and underserved the actual commuter population. Before building more infrastructure, we need to fix what already exists." },
    ],
  },
};

const getSeeded = (postId) =>
  SEED_OPINIONS[postId] || { for: [], against: [] };

const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const OpinionCard = ({ opinion, side }) => (
  <div className={`opinion-card opinion-card--${side}`}>
    <div className="oc-header">
      <div className="oc-avatar">{opinion.author.charAt(0)}</div>
      <div>
        <span className="oc-author">{opinion.author}</span>
        <span className="oc-time">{opinion.time}</span>
      </div>
    </div>
    <p className="oc-text">{opinion.text}</p>
  </div>
);

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

      <style>{`
        .pd-page {
          min-height: 100dvh;
          background: var(--color-bg);
          padding: 32px 20px 80px;
        }
        .pd-container {
          max-width: 720px;
          margin: 0 auto;
        }
        .pd-not-found {
          padding: 60px;
          text-align: center;
          color: var(--color-muted);
        }

        /* Back button */
        .pd-back {
          background: none;
          border: none;
          font-size: 13.5px;
          font-weight: 600;
          color: var(--color-muted);
          cursor: pointer;
          padding: 0;
          margin-bottom: 22px;
          font-family: 'Inter', sans-serif;
          transition: color 0.15s;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
        .pd-back:hover { color: var(--color-primary); }

        /* Post header */
        .pd-header {
          background: var(--color-surface);
          border: 1.5px solid var(--color-border);
          border-radius: 14px;
          padding: 24px 26px 20px;
          margin-bottom: 2px;
        }
        .pd-category {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          color: var(--color-primary);
          background: var(--color-primary-tint);
          padding: 3px 12px;
          border-radius: 20px;
          margin-bottom: 12px;
          letter-spacing: 0.3px;
        }
        .pd-title {
          font-family: 'Fraunces', serif;
          font-size: clamp(20px, 4vw, 28px);
          font-weight: 700;
          color: var(--color-primary-dark);
          line-height: 1.3;
          margin-bottom: 18px;
          letter-spacing: -0.3px;
        }
        .pd-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .pd-author-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .pd-avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: var(--color-primary);
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .pd-author-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text);
          display: block;
        }
        .pd-time {
          font-size: 12px;
          color: var(--color-muted);
          display: block;
          margin-top: 1px;
        }
        .pd-actions { display: flex; gap: 8px; align-items: center; }
        .pd-like-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px;
          border-radius: 8px;
          border: 1.5px solid var(--color-border);
          background: var(--color-surface);
          font-size: 13px; font-weight: 600;
          color: var(--color-muted);
          cursor: pointer; font-family: 'Inter', sans-serif;
          transition: all 0.15s;
        }
        .pd-like-btn:hover { border-color: var(--color-against); color: var(--color-against); }
        .pd-like-btn--active { border-color: var(--color-against); color: var(--color-against); background: rgba(193,102,107,0.07); }
        .pd-delete-btn {
          padding: 7px 14px;
          border-radius: 8px;
          border: 1.5px solid var(--color-border);
          background: transparent;
          font-size: 13px; font-weight: 600;
          color: var(--color-muted);
          cursor: pointer; font-family: 'Inter', sans-serif;
          transition: all 0.15s;
        }
        .pd-delete-btn:hover { border-color: var(--color-against); color: var(--color-against); }

        /* Description */
        .pd-body {
          background: var(--color-surface);
          border: 1.5px solid var(--color-border);
          border-top: none;
          border-radius: 0 0 14px 14px;
          padding: 20px 26px 24px;
          margin-bottom: 24px;
        }
        .pd-description {
          font-size: 15px;
          line-height: 1.85;
          color: var(--color-text);
        }

        /* ── Opinions section ── */
        .pd-opinions {
          background: var(--color-surface);
          border: 1.5px solid var(--color-border);
          border-radius: 14px;
          padding: 24px 26px;
        }
        .pd-opinions-heading {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          font-weight: 600;
          color: var(--color-primary-dark);
          margin-bottom: 0;
        }
        .pd-opinions-top {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 20px;
        }

        /* For / Against percentage bar */
        .pd-pct-wrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .pd-pct-labels {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          font-weight: 700;
        }
        .pd-pct-for     { color: var(--color-for); }
        .pd-pct-against { color: var(--color-against); }
        .pd-pct-bar {
          height: 8px;
          border-radius: 8px;
          background: rgba(193,102,107,0.2);
          overflow: hidden;
        }
        .pd-pct-fill {
          height: 100%;
          background: var(--color-for);
          border-radius: 8px;
          transition: width 0.4s ease;
        }
        .pd-pct-note {
          font-size: 12px;
          color: var(--color-muted);
        }

        /* Tabs */
        .pd-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }
        .pd-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 20px;
          border-radius: 9px;
          border: 1.5px solid var(--color-border);
          background: transparent;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          color: var(--color-muted);
          transition: all 0.15s;
        }
        .pd-tab--for:hover     { border-color: var(--color-for); color: var(--color-for); }
        .pd-tab--against:hover { border-color: var(--color-against); color: var(--color-against); }
        .pd-tab--active-for {
          background: rgba(76,140,91,0.09);
          border-color: var(--color-for);
          color: var(--color-for);
        }
        .pd-tab--active-against {
          background: rgba(193,102,107,0.09);
          border-color: var(--color-against);
          color: var(--color-against);
        }
        .pd-tab-count {
          background: rgba(0,0,0,0.07);
          border-radius: 20px;
          font-size: 11.5px;
          padding: 1px 8px;
          font-weight: 700;
        }

        /* Compose area */
        .pd-compose {
          border-radius: 10px;
          border: 1.5px solid var(--color-border);
          overflow: hidden;
          margin-bottom: 22px;
          background: var(--color-bg);
          transition: border-color 0.15s;
        }
        .pd-compose--for:focus-within     { border-color: var(--color-for); }
        .pd-compose--against:focus-within { border-color: var(--color-against); }
        .pd-compose-input {
          width: 100%;
          padding: 14px 16px;
          border: none;
          background: transparent;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          color: var(--color-text);
          resize: none;
          outline: none;
          display: block;
          line-height: 1.6;
        }
        .pd-compose-input::placeholder { color: var(--color-muted); }
        .pd-compose-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 14px;
          border-top: 1px solid var(--color-border);
          background: var(--color-surface);
        }
        .pd-compose-hint {
          font-size: 11.5px;
          color: var(--color-muted);
        }
        .pd-submit-btn {
          padding: 7px 18px;
          border-radius: 8px;
          border: none;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: opacity 0.15s, transform 0.15s;
        }
        .pd-submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .pd-submit-btn--for {
          background: var(--color-for);
          color: #fff;
        }
        .pd-submit-btn--against {
          background: var(--color-against);
          color: #fff;
        }
        .pd-submit-btn:not(:disabled):hover { opacity: 0.88; transform: translateY(-1px); }

        /* Opinion cards */
        .pd-opinion-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .pd-no-opinions {
          text-align: center;
          padding: 36px;
          color: var(--color-muted);
          font-size: 14px;
          background: var(--color-bg);
          border-radius: 10px;
          border: 1.5px dashed var(--color-border);
        }
        .opinion-card {
          border-radius: 10px;
          padding: 14px 16px;
          border-left: 3px solid transparent;
        }
        .opinion-card--for {
          background: rgba(76,140,91,0.05);
          border-left-color: var(--color-for);
        }
        .opinion-card--against {
          background: rgba(193,102,107,0.05);
          border-left-color: var(--color-against);
        }
        .oc-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 9px;
        }
        .oc-avatar {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: var(--color-primary);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .oc-author {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: var(--color-text);
        }
        .oc-time {
          display: block;
          font-size: 11.5px;
          color: var(--color-muted);
        }
        .oc-text {
          font-size: 14px;
          line-height: 1.7;
          color: var(--color-text);
        }

        @media (max-width: 600px) {
          .pd-page { padding: 20px 12px 60px; }
          .pd-header, .pd-body, .pd-opinions { padding: 18px 16px; }
          .pd-title { font-size: 20px; }
          .pd-tabs { flex-wrap: wrap; }
        }
      `}</style>
    </>
  );
}