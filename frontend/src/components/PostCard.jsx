import React from "react";
import { useNavigate } from "react-router-dom";

const CATEGORY_COLORS = {
  Political:    { bg: "rgba(91, 111, 166, 0.12)",  text: "#5B6FA6" },
  Local:        { bg: "rgba(139, 111, 71, 0.12)",  text: "#8B6F47" },
  Global:       { bg: "rgba(76, 140, 91, 0.12)",   text: "#4C8C5B" },
  Educational:  { bg: "rgba(122, 91, 166, 0.12)",  text: "#7A5BA6" },
  Social:       { bg: "rgba(201, 166, 107, 0.15)", text: "#9A7340" },
};

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const catStyle = CATEGORY_COLORS[post.category] || {
    bg: "rgba(62, 98, 89, 0.1)",
    text: "var(--color-primary)",
  };

  const totalVotes = post.votesFor.length + post.votesAgainst.length;
  const forPct = totalVotes > 0
    ? Math.round((post.votesFor.length / totalVotes) * 100)
    : 0;

  const timeAgo = (date) => {
    const diff = (Date.now() - new Date(date)) / 1000;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const initials = (post.author.fullName || "?").charAt(0).toUpperCase();

  return (
    <>
      <article
        className="post-card"
        onClick={() => navigate(`/post/${post._id}`)}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && navigate(`/post/${post._id}`)}
      >
        {/* Top row: category badge + time */}
        <div className="pc-top">
          <span
            className="pc-category"
            style={{ background: catStyle.bg, color: catStyle.text }}
          >
            {post.category}
          </span>
          <span className="pc-time">{timeAgo(post.createdAt)}</span>
        </div>

        {/* Title */}
        <h3 className="pc-title">{post.title}</h3>

        {/* Excerpt */}
        <p className="pc-excerpt">
          {post.description.length > 130
            ? post.description.slice(0, 130) + "…"
            : post.description}
        </p>

        {/* Vote bar */}
        {totalVotes > 0 && (
          <div className="pc-vote-track">
            <div className="pc-vote-fill" style={{ width: `${forPct}%` }} />
          </div>
        )}

        {/* Footer */}
        <div className="pc-footer">
          <div className="pc-author">
            <div className="pc-author-avatar">{initials}</div>
            <span className="pc-author-name">{post.author.fullName}</span>
          </div>

          <div className="pc-stats">
            <span className="pc-stat">
              <svg viewBox="0 0 16 16" fill="none" width="13" height="13">
                <path d="M8 14s-6-3.8-6-8a6 6 0 0 1 12 0c0 4.2-6 8-6 8z" stroke="currentColor" strokeWidth="1.4"/>
              </svg>
              {post.likes.length}
            </span>
            <span className="pc-stat pc-stat--for">
              For {post.votesFor.length}
            </span>
            <span className="pc-stat pc-stat--against">
              Against {post.votesAgainst.length}
            </span>
          </div>
        </div>

        <div className="pc-read-more">Read debate →</div>
      </article>

      <style>{`
        .post-card {
          background: var(--color-surface);
          border: 1.5px solid var(--color-border);
          border-radius: 16px;
          padding: 22px 24px 18px;
          margin-bottom: 14px;
          cursor: pointer;
          transition: box-shadow 0.22s ease, transform 0.22s ease, border-color 0.22s ease;
          position: relative;
          overflow: hidden;
          outline: none;
        }
        .post-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3.5px;
          background: linear-gradient(180deg, var(--color-primary), var(--color-accent));
          border-radius: 3px 0 0 3px;
          opacity: 0;
          transition: opacity 0.22s ease;
        }
        .post-card:hover {
          box-shadow: 0 8px 32px rgba(43, 43, 43, 0.1);
          transform: translateY(-3px);
          border-color: var(--color-primary);
        }
        .post-card:hover::before { opacity: 1; }
        .post-card:focus-visible {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }

        /* Top row */
        .pc-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .pc-category {
          display: inline-block;
          padding: 4px 11px;
          border-radius: 20px;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.3px;
        }
        .pc-time {
          font-size: 12px;
          color: var(--color-muted);
        }

        /* Title */
        .pc-title {
          font-family: 'Fraunces', serif;
          font-size: 18px;
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
          margin-bottom: 14px;
        }

        /* Vote track */
        .pc-vote-track {
          height: 4px;
          border-radius: 4px;
          background: rgba(193, 102, 107, 0.2);
          margin-bottom: 16px;
          overflow: hidden;
        }
        .pc-vote-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-for), #6EC87A);
          border-radius: 4px;
          transition: width 0.3s ease;
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
        .pc-author-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pc-author-name {
          font-size: 12.5px;
          font-weight: 600;
          color: var(--color-text);
        }

        .pc-stats {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .pc-stat {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 600;
          color: var(--color-muted);
        }
        .pc-stat--for  { color: var(--color-for); }
        .pc-stat--against { color: var(--color-against); }

        /* Read more hint */
        .pc-read-more {
          position: absolute;
          bottom: 18px;
          right: 22px;
          font-size: 11.5px;
          font-weight: 700;
          color: var(--color-primary);
          opacity: 0;
          transform: translateX(-6px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          pointer-events: none;
        }
        .post-card:hover .pc-read-more {
          opacity: 1;
          transform: translateX(0);
        }
        .post-card:hover .pc-stats { opacity: 0; transition: opacity 0.1s ease; }

        @media (max-width: 600px) {
          .post-card { padding: 18px 16px 16px; }
          .pc-title { font-size: 16px; }
          .pc-read-more { display: none; }
          .post-card:hover .pc-stats { opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default PostCard;