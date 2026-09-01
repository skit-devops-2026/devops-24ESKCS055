import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import CategorySidebar from "../components/CategorySidebar";
import PostCard from "../components/PostCard";
import AddPostModal from "../components/AddPostModal";
import { mockPosts } from "../data/mockPosts";
import "./Home.css";

const SORT_OPTIONS = [
  { value: "newest",    label: "Newest"    },
  { value: "mostLiked", label: "Most Liked" },
];

const Home = () => {
  const [search, setSearch]                       = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [posts, setPosts]                         = useState(mockPosts);
  const [showModal, setShowModal]                 = useState(false);
  const [sort, setSort]                           = useState("newest");

  const filteredPosts = useMemo(() => {
    return posts
      .filter((p) => (selectedCategories.length ? selectedCategories.includes(p.category) : true))
      .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (sort === "newest")       return new Date(b.createdAt) - new Date(a.createdAt);
        if (sort === "mostLiked")    return b.likes.length - a.likes.length;
        if (sort === "mostOpinions") return (b.votesFor.length + b.votesAgainst.length) - (a.votesFor.length + a.votesAgainst.length);
        return 0;
      });
  }, [posts, selectedCategories, search, sort]);

  const handleAddPost = (data) => {
    const newPost = {
      _id: Date.now().toString(),
      ...data,
      author: { _id: "me", fullName: "You", username: "you" },
      likes: [],
      votesFor: [],
      votesAgainst: [],
      createdAt: new Date().toISOString(),
    };
    setPosts([newPost, ...posts]);
  };

  return (
    <>
      <div className="home">
        <AppNavbar search={search} setSearch={setSearch} />

        <div className="home-body">
          {/* Left sidebar */}
          <CategorySidebar
            selected={selectedCategories}
            setSelected={setSelectedCategories}
          />

          {/* Main feed */}
          <main className="home-feed">
            <div className="feed-inner">

            {/* Feed header */}
            <div className="feed-header">
              <div className="feed-header-left">
                <h2 className="feed-title">
                  {selectedCategories.length > 0
                    ? selectedCategories.join(" · ")
                    : "All Debates"}
                </h2>
                {filteredPosts.length > 0 && (
                  <span className="feed-count">
                    {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <div className="feed-header-right">
                <div className="feed-sort">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      className={`sort-btn ${sort === opt.value ? "sort-btn--active" : ""}`}
                      onClick={() => setSort(opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <button className="new-debate-btn" onClick={() => setShowModal(true)}>
                  + New Debate
                </button>
              </div>
            </div>

            {/* Posts */}
            {filteredPosts.length === 0 ? (
              <div className="empty-state">
                <svg viewBox="0 0 48 48" fill="none" width="44" height="44">
                  <circle cx="24" cy="24" r="22" stroke="var(--color-border)" strokeWidth="1.5"/>
                  <path d="M16 24h16M24 16v16" stroke="var(--color-muted)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <h4>No debates found</h4>
                <p>Try a different search or category, or start a debate yourself.</p>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                  Start a Debate
                </button>
              </div>
            ) : (
              <div className="feed-list">
                {filteredPosts.map((post, i) => (
                  <div
                    key={post._id}
                    className="feed-item-enter"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            )}
            </div>{/* /feed-inner */}
          </main>
        </div>
      </div>

      {showModal && (
        <AddPostModal onClose={() => setShowModal(false)} onSubmit={handleAddPost} />
      )}

          </>
  );
};

export default Home;