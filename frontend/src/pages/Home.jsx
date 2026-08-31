import React, { useState, useEffect, useMemo } from "react";
import AppNavbar from "../components/AppNavbar";
import CategorySidebar from "../components/CategorySidebar";
import PostCard from "../components/PostCard";
import AddPostModal from "../components/AddPostModal";
import { mockPosts } from "../data/mockPosts";
import api from "../api/axios";

const Home = () => {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/posts");
      if (Array.isArray(res.data) && res.data.length > 0) {
        setPosts(res.data);
      } else {
        setPosts(res.data || []);
      }
    } catch (error) {
      console.warn("Could not fetch posts from backend, using fallback data", error);
      setPosts(mockPosts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (formData) => {
    try {
      const res = await api.post("/posts", formData);
      setPosts((prev) => [res.data, ...prev]);
    } catch (error) {
      console.error("Failed to create post via API", error);
      const fallbackPost = {
        _id: Date.now().toString(),
        ...formData,
        author: { fullName: "You", username: "you" },
        likes: [],
        votesFor: [],
        votesAgainst: [],
        createdAt: new Date().toISOString(),
      };
      setPosts((prev) => [fallbackPost, ...prev]);
    }
  };

  const filteredPosts = useMemo(() => {
    return posts
      .filter((p) => (selectedCategories.length ? selectedCategories.includes(p.category) : true))
      .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [posts, selectedCategories, search]);

  return (
    <>
      <div className="home">
        <AppNavbar search={search} setSearch={setSearch} onOpenCreate={() => setShowModal(true)} />

        <div className="home-body">
          <CategorySidebar selected={selectedCategories} setSelected={setSelectedCategories} />

          <main className="home-feed">
            <div className="feed-header">
              <h2>Debates & Discussions</h2>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                + Start Debate
              </button>
            </div>

            {loading ? (
              <p className="no-posts">Loading debates...</p>
            ) : filteredPosts.length === 0 ? (
              <p className="no-posts">No debates found.</p>
            ) : (
              filteredPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            )}
          </main>
        </div>
      </div>

      {showModal && (
        <AddPostModal onClose={() => setShowModal(false)} onSubmit={handleCreatePost} />
      )}

      <style>{`
        .home-body {
          display: flex;
          max-width: 1100px;
          margin: 0 auto;
          align-items: flex-start;
        }

        .home-feed {
          flex: 1;
          padding: 24px 24px 60px;
        }

        .feed-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .no-posts { color: var(--color-muted); text-align: center; padding: 40px 0; }
      `}</style>
    </>
  );
};

export default Home;