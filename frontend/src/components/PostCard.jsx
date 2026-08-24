import React from "react";
import { useNavigate } from "react-router-dom";

const CATEGORY_COLORS = {
  "Law & Justice":        { bg: "rgba(139, 90,  60, 0.1)",  text: "#8B5A3C" },
  "Politics & Governance":{ bg: "rgba(91,  111, 166, 0.1)", text: "#5B6FA6" },
  "Society & Culture":    { bg: "rgba(166, 91,  130, 0.1)", text: "#A65B82" },
  "Education":            { bg: "rgba(122, 91,  166, 0.1)", text: "#7A5BA6" },
  "Environment":          { bg: "rgba(62,  120,  70, 0.1)", text: "#3E7846" },
  "Economy & Business":   { bg: "rgba(139, 111,  71, 0.1)", text: "#8B6F47" },
  "Technology & AI":      { bg: "rgba(50,  120, 160, 0.1)", text: "#3278A0" },
  "Health":               { bg: "rgba(76,  140,  91, 0.1)", text: "#4C8C5B" },
  "Current Affairs":      { bg: "rgba(180,  90,  90, 0.1)", text: "#B45A5A" },
  "Lifestyle":            { bg: "rgba(180, 140,  60, 0.1)", text: "#B48C3C" },
};

const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const catStyle = CATEGORY_COLORS[post.category] || {
    bg: "rgba(62, 98, 89, 0.1)",
    text: "var(--color-primary)",
  };
  const initials  = (post.author?.fullName || "?").charAt(0).toUpperCase();
  const opinions  = post.votesFor.length + post.votesAgainst.length;

  return (
    <>
      <article
        className="post-card"
        onClick={() => navigate(`/post/${post._id}`)}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && navigate(`/post/${post._id}`)}
        role="button"
        aria-label={`Open debate: ${post.title}`}
      >
        {/* Hover accent bar */}
        <div className="pc-accent-bar" />

        {/* Top: category + time */}
        <div className="pc-top">
          <span className="pc-category" style={{ background: catStyle.bg, color: catStyle.text }}>
            {post.category}
          </span>
          <span className="pc-time">{timeAgo(post.createdAt)}</span>
        </div>

        {/* Title */}
        <h3 className="pc-title">{post.title}</h3>

        {/* Excerpt */}
        <p className="pc-excerpt">
          {post.description.length > 120
            ? post.description.slice(0, 120) + "…"
            : post.description}
        </p>

        {/* Footer */}
        <div className="pc-footer">
          <div className="pc-author">
            <div className="pc-avatar">{initials}</div>
            <span className="pc-author-name">{post.author?.fullName}</span>
          </div>

          <div className="pc-meta">
            <span className="pc-meta-item pc-for">
              For · {post.votesFor.length}
            </span>
            <span className="pc-meta-sep">·</span>
            <span className="pc-meta-item pc-against">
              Against · {post.votesAgainst.length}
            </span>
          </div>
        </div>
      </article>

      <style>{`
        .post-card {
          position: relative;
          background: var(--color-surface);
          border: 1.5px solid var(--color-border);
          border-radius: 14px;
          padding: 20px 22px 18px 22px;
          margin-bottom: 12px;
          cursor: pointer;
          outline: none;
          transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
          overflow: hidden;
        }
        .post-card:hover {
          box-shadow: 0 6px 24px rgba(43,43,43,0.09);
          transform: translateY(-2px);
          border-color: var(--color-primary);
        }
        .post-card:focus-visible {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }

        /* Left accent bar — visible only on hover */
        .pc-accent-bar {
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, var(--color-primary), var(--color-accent));
          border-radius: 3px 0 0 3px;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .post-card:hover .pc-accent-bar { opacity: 1; }

        /* Top row */
        .pc-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .pc-category {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 20px;
          letter-spacing: 0.2px;
        }
        .pc-time {
          font-size: 12px;
          color: var(--color-muted);
        }

        /* Title */
        .pc-title {
          font-family: 'Fraunces', serif;
          font-size: 17px;
          font-weight: 600;
          color: var(--color-primary-dark);
          line-height: 1.4;
          margin-bottom: 8px;
          letter-spacing: -0.2px;
        }

        /* Excerpt */
        .pc-excerpt {
          font-size: 13.5px;
          color: var(--color-muted);
          line-height: 1.65;
          margin-bottom: 16px;
        }

        /* Footer */
        .pc-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .pc-author {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .pc-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--color-primary);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .pc-author-name {
          font-size: 12.5px;
          font-weight: 600;
          color: var(--color-text);
        }
        .pc-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
        }
        .pc-meta-sep { color: var(--color-border); }
        .pc-for     { color: var(--color-for); }
        .pc-against { color: var(--color-against); }

        @media (max-width: 600px) {
          .post-card { padding: 16px 14px; }
          .pc-title  { font-size: 15px; }
        }
      `}</style>
    </>
  );
};

export default PostCard;