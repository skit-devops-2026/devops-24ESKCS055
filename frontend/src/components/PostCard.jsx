import React from "react";
import { useNavigate } from "react-router-dom";

const PostCard = ({ post }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="post-card card" onClick={() => navigate(`/post/${post._id}`)}>
        <div className="pc-top">
          <span className="tag">{post.category}</span>
          <span className="pc-author">by {post.author.fullName}</span>
        </div>
        <h3>{post.title}</h3>
        <p>{post.description.slice(0, 140)}...</p>
        <div className="pc-stats">
          <span>❤ {post.likes.length}</span>
          <span className="for">For {post.votesFor.length}</span>
          <span className="against">Against {post.votesAgainst.length}</span>
        </div>
      </div>

      <style>{`
        .post-card {
          padding: 22px;
          margin-bottom: 16px;
          cursor: pointer;
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }

        .post-card:hover {
          box-shadow: var(--shadow-hover);
          transform: translateY(-2px);
        }

        .pc-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .pc-author { font-size: 13px; color: var(--color-muted); }

        .post-card h3 { font-size: 19px; margin-bottom: 8px; }

        .post-card p { font-size: 14px; color: var(--color-muted); line-height: 1.6; }

        .pc-stats {
          display: flex;
          gap: 18px;
          margin-top: 14px;
          font-size: 13px;
          font-weight: 600;
          color: var(--color-muted);
        }

        .pc-stats .for { color: var(--color-for); }
        .pc-stats .against { color: var(--color-against); }
      `}</style>
    </>
  );
};

export default PostCard;