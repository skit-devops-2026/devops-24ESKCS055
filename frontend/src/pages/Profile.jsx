import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockPosts } from "../data/mockPosts";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import AddPostModal from "../components/AddPostModal";
import AppNavbar from "../components/AppNavbar";
import api from "../api/axios";

const Profile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const profileId = id || user?._id;
  const isOwnProfile = !id || (user?._id && profileId === user._id.toString());

  const [profileUser, setProfileUser] = useState(isOwnProfile ? user : null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileId) return;
      try {
        setLoading(true);
        const res = await api.get(`/users/${profileId}`);
        setProfileUser(res.data.user);
        setPosts(res.data.posts || []);
        if (user?._id && res.data.user?.followers) {
          setIsFollowing(
            res.data.user.followers.some(
              (fId) => (fId?._id || fId).toString() === user._id.toString()
            )
          );
        }
      } catch (err) {
        console.warn("Could not fetch user from backend, using fallback data", err);
        if (isOwnProfile) {
          setProfileUser(user || { fullName: "User", username: "user", followers: [], following: [] });
          setPosts(mockPosts.filter((p) => p.author?.fullName === user?.fullName));
        } else {
          const fallbackPost = mockPosts.find((p) => p.author?._id === profileId);
          if (fallbackPost) {
            setProfileUser({ ...fallbackPost.author, followers: [], following: [] });
            setPosts(mockPosts.filter((p) => p.author?._id === profileId));
          } else {
            setProfileUser(user);
            setPosts([]);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId, user, isOwnProfile]);

  const handleToggleFollow = async () => {
    if (!profileId || isOwnProfile) return;
    try {
      const res = await api.post(`/users/${profileId}/follow`);
      setIsFollowing(res.data.isFollowing);
      if (res.data.targetFollowers) {
        setProfileUser((prev) => ({ ...prev, followers: res.data.targetFollowers }));
      }
    } catch (err) {
      console.warn("Follow error", err);
      setIsFollowing(!isFollowing);
    }
  };

  const handleAddPost = async (formData) => {
    try {
      const res = await api.post("/posts", formData);
      setPosts((prev) => [res.data, ...prev]);
    } catch (err) {
      console.warn("Create post API error, using local fallback", err);
      const newPost = {
        _id: Date.now().toString(),
        ...formData,
        author: { _id: user?._id, fullName: user?.fullName, username: user?.username },
        likes: [],
        votesFor: [],
        votesAgainst: [],
        createdAt: new Date().toISOString(),
      };
      setPosts((prev) => [newPost, ...prev]);
    }
  };

  if (loading && !profileUser) {
    return (
      <>
        <AppNavbar />
        <div className="profile page-container" style={{ textAlign: "center", padding: "60px 0" }}>
          Loading profile...
        </div>
      </>
    );
  }

  return (
    <>
      <AppNavbar onOpenCreate={() => setShowModal(true)} />
      <div className="profile page-container">
        <div className="profile-header card">
          <div className="profile-avatar">
            {profileUser?.fullName?.charAt(0) || "U"}
          </div>

          <div className="profile-info">
            <h2>{profileUser?.fullName || "User"}</h2>
            <p className="profile-username">@{profileUser?.username || "username"}</p>
            {profileUser?.bio && <p className="profile-bio">{profileUser.bio}</p>}
            <div className="profile-stats">
              <span><strong>{profileUser?.followers?.length ?? 0}</strong> Followers</span>
              <span><strong>{profileUser?.following?.length ?? 0}</strong> Following</span>
              <span><strong>{posts.length}</strong> Debates Posted</span>
            </div>
          </div>

          {isOwnProfile ? (
            <button className="btn btn-outline" onClick={() => navigate("/settings")}>
              Settings
            </button>
          ) : (
            <button
              className={`btn ${isFollowing ? "btn-outline" : "btn-primary"}`}
              onClick={handleToggleFollow}
            >
              {isFollowing ? "Following" : "+ Follow"}
            </button>
          )}
        </div>

        <div className="profile-section-header">
          <h3 className="profile-section-title">
            {isOwnProfile ? "My Debates" : `${profileUser?.fullName || "User"}'s Debates`}
          </h3>
          {isOwnProfile && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              + Start Debate
            </button>
          )}
        </div>

        {posts.length === 0 && (
          <p className="no-posts">
            {isOwnProfile
              ? "You haven't posted any debates yet."
              : "No debates posted yet."}
          </p>
        )}
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {showModal && (
        <AddPostModal onClose={() => setShowModal(false)} onSubmit={handleAddPost} />
      )}

      <style>{`
        .profile { padding: 32px 24px 60px; max-width: 840px; }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 24px;
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
        .profile-username { color: var(--color-muted); font-size: 14px; margin-bottom: 6px; }
        .profile-bio { font-size: 14px; color: var(--color-text); margin-bottom: 12px; }

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