import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockPosts } from "../data/mockPosts";
import { useAuth } from "../context/AuthContext";
import VoteBar from "../components/VoteBar";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(mockPosts.find((p) => p._id === id));
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);

  if (!post) return <div className="page-container">Post not found.</div>;

  const isOwner = post.author._id === user._id;

  const handleLike = () => {
    setLiked(!liked);
    setPost((prev) => ({
      ...prev,
      likes: liked ? prev.likes.slice(0, -1) : [...prev.likes, user._id],
    }));
  };

  const handleVote = (stance) => {
    setPost((prev) => ({
      ...prev,
      votesFor: stance === "for" ? [...prev.votesFor, user._id] : prev.votesFor,
      votesAgainst: stance === "against" ? [...prev.votesAgainst, user._id] : prev.votesAgainst,
    }));
  };

  const handleDelete = () => {
    navigate("/home");
  };

  return (
    <>
      <div className="post-detail page-container">
        <span className="tag">{post.category}</span>
        <h1>{post.title}</h1>
        <p className="pd-author">by {post.author.fullName}</p>

        <p className="pd-description">{post.description}</p>

        <VoteBar votesFor={post.votesFor.length} votesAgainst={post.votesAgainst.length} onVote={handleVote} />

        <div className="pd-actions">
          <button className={`btn ${liked ? "btn-primary" : "btn-outline"}`} onClick={handleLike}>
            ❤ {post.likes.length} Like{post.likes.length !== 1 ? "s" : ""}
          </button>
          {!isOwner && (
            <button className={`btn ${following ? "btn-primary" : "btn-outline"}`} onClick={() => setFollowing(!following)}>
              {following ? "Following" : "Follow"}
            </button>
          )}
          {isOwner && (
            <button className="btn btn-ghost" onClick={handleDelete}>Delete Post</button>
          )}
        </div>
      </div>

      <style>{`
        .post-detail { padding: 40px 24px 60px; max-width: 720px; }
        .post-detail h1 { margin: 14px 0 6px; font-size: 30px; }
        .pd-author { color: var(--color-muted); margin-bottom: 20px; font-size: 14px; }
        .pd-description { line-height: 1.8; color: var(--color-text); margin-bottom: 10px; }
        .pd-actions { display: flex; gap: 12px; margin-top: 26px; }
      `}</style>
    </>
  );
};

export default PostDetail;