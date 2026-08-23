import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockPosts } from "../data/mockPosts";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import AddPostModal from "../components/AddPostModal";

  const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState(mockPosts);
  const [showModal, setShowModal] = useState(false);

  const myPosts = posts.filter((p) => p.author.fullName === user?.fullName);

  const handleAddPost = (data) => {
    const newPost = {
      _id: Date.now().toString(),
      ...data,
      author: { _id: user._id, fullName: user.fullName },
      likes: [],
      votesFor: [],
      votesAgainst: [],
      createdAt: new Date().toISOString(),
    };
    setPosts([newPost, ...posts]);
  };

  return (
    <>
      <div className="profile page-container">
        <div className="profile-header card">
          <div className="profile-avatar">{user?.fullName?.charAt(0)}</div>

          <div className="profile-info">
            <h2>{user?.fullName}</h2>
            <p className="profile-username">@{user?.username}</p>
            <div className="profile-stats">
              <span><strong>128</strong> Followers</span>
              <span><strong>84</strong> Following</span>
              <span><strong>{myPosts.length}</strong> Debates Joined</span>
            </div>
          </div>

          <button className="btn btn-outline" onClick={() => navigate("/settings")}>Settings</button>
        </div>

        <div className="profile-section-header">
          <h3 className="profile-section-title">My Posts</h3>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Post</button>
        </div>

        {myPosts.length === 0 && <p className="no-posts">You haven't posted anything yet.</p>}
        {myPosts.map((post) => <PostCard key={post._id} post={post} />)}
      </div>

      {showModal && <AddPostModal onClose={() => setShowModal(false)} onSubmit={handleAddPost} />}

      <style>{`
        .profile { padding: 40px 24px 60px; }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 28px;
          margin-bottom: 30px;
        }

        .profile-avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: var(--color-primary);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .profile-info { flex: 1; }
        .profile-username { color: var(--color-muted); font-size: 14px; margin-bottom: 10px; }

        .profile-stats {
          display: flex;
          gap: 20px;
          font-size: 14px;
          color: var(--color-muted);
        }

        .profile-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .profile-section-title { font-size: 20px; }
        .no-posts { color: var(--color-muted); text-align: center; padding: 40px 0; }
      `}</style>
    </>
  );
};

export default Profile;