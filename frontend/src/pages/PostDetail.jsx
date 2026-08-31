import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { mockPosts } from "../data/mockPosts";
import { useAuth } from "../context/AuthContext";
import VoteBar from "../components/VoteBar";
import AppNavbar from "../components/AppNavbar";
import api from "../api/axios";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.warn("Could not fetch post from backend, searching fallback data", err);
        const fallback = mockPosts.find((p) => p._id === id);
        if (fallback) setPost(fallback);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container" style={{ padding: "60px 24px", textAlign: "center" }}>
        Loading debate...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="page-container" style={{ padding: "60px 24px", textAlign: "center" }}>
        <h3>Debate not found.</h3>
        <Link to="/home" className="btn btn-primary" style={{ marginTop: 16, display: "inline-block" }}>
          Back to Home
        </Link>
      </div>
    );
  }

  const authorId = post.author?._id || post.author;
  const isOwner = user?._id && authorId && authorId.toString() === user._id.toString();
  const isLiked = user?._id && post.likes?.some((uId) => (uId?._id || uId).toString() === user._id.toString());
  const authorName = post.author?.fullName || "Anonymous";
  const authorUsername = post.author?.username || "";

  const handleLike = async () => {
    try {
      const res = await api.post(`/posts/${id}/like`);
      setPost(res.data);
    } catch (err) {
      console.warn("API like failed, using local update", err);
      setPost((prev) => {
        const liked = prev.likes?.includes(user?._id);
        return {
          ...prev,
          likes: liked ? prev.likes.filter((i) => i !== user?._id) : [...(prev.likes || []), user?._id],
        };
      });
    }
  };

  const handleVote = async (stance) => {
    try {
      const res = await api.post(`/posts/${id}/vote`, { stance });
      setPost(res.data);
    } catch (err) {
      console.warn("API vote failed, using local update", err);
      setPost((prev) => ({
        ...prev,
        votesFor: stance === "for" ? [...(prev.votesFor || []), user?._id] : prev.votesFor?.filter((i) => i !== user?._id) || [],
        votesAgainst: stance === "against" ? [...(prev.votesAgainst || []), user?._id] : prev.votesAgainst?.filter((i) => i !== user?._id) || [],
      }));
    }
  };

  const handleFollow = async () => {
    if (!authorId || isOwner) return;
    try {
      const res = await api.post(`/users/${authorId}/follow`);
      setFollowing(res.data.isFollowing);
    } catch (err) {
      console.warn("API follow failed, using local toggle", err);
      setFollowing(!following);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this debate?")) return;
    try {
      await api.delete(`/posts/${id}`);
    } catch (err) {
      console.warn("Delete API failed", err);
    }
    navigate("/home");
  };

  return (
    <>
      <AppNavbar />
      <div className="post-detail page-container">
        <Link to="/home" className="pd-back">← Back to Debates</Link>

        <div className="pd-main card">
          <div className="pd-meta">
            <span className="tag">{post.category}</span>
            <span className="pd-date">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}</span>
          </div>

          <h1>{post.title}</h1>
          <div className="pd-author-row">
            <Link to={`/profile/${authorId}`} className="pd-author-link">
              by <strong>{authorName}</strong> {authorUsername ? `@${authorUsername}` : ""}
            </Link>
            {!isOwner && authorId && (
              <button
                className={`btn btn-sm ${following ? "btn-primary" : "btn-outline"}`}
                onClick={handleFollow}
              >
                {following ? "Following" : "+ Follow"}
              </button>
            )}
          </div>

          <p className="pd-description">{post.description}</p>

          <VoteBar
            votesFor={post.votesFor?.length || 0}
            votesAgainst={post.votesAgainst?.length || 0}
            onVote={handleVote}
          />

          <div className="pd-actions">
            <button className={`btn ${isLiked ? "btn-primary" : "btn-outline"}`} onClick={handleLike}>
              ❤ {post.likes?.length || 0} {post.likes?.length === 1 ? "Like" : "Likes"}
            </button>
            {isOwner && (
              <button className="btn btn-ghost pd-delete" onClick={handleDelete}>
                Delete Debate
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .post-detail { padding: 32px 24px 60px; max-width: 760px; }
        .pd-back { display: inline-block; margin-bottom: 20px; font-size: 14px; font-weight: 600; color: var(--color-primary); }
        .pd-back:hover { text-decoration: underline; }
        .pd-main { padding: 32px; }
        .pd-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .pd-date { font-size: 13px; color: var(--color-muted); }
        .post-detail h1 { margin: 8px 0 12px; font-size: 28px; line-height: 1.35; }
        .pd-author-row { display: flex; align-items: center; gap: 12px; margin-bottom: 22px; }
        .pd-author-link { font-size: 14px; color: var(--color-muted); }
        .pd-author-link strong { color: var(--color-primary); }
        .btn-sm { padding: 6px 14px; font-size: 12px; border-radius: 6px; }
        .pd-description { line-height: 1.8; color: var(--color-text); font-size: 16px; margin-bottom: 14px; white-space: pre-line; }
        .pd-actions { display: flex; gap: 12px; margin-top: 24px; align-items: center; }
        .pd-delete { color: var(--color-against); border-color: var(--color-against); }
        .pd-delete:hover { background: var(--color-against); color: #fff; }
      `}</style>
    </>
  );
};

export default PostDetail;