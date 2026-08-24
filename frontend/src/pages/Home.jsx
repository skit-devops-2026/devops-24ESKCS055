import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import CategorySidebar from "../components/CategorySidebar";
import PostCard from "../components/PostCard";
import AddPostModal from "../components/AddPostModal";
import { mockPosts } from "../data/mockPosts";

const SORT_OPTIONS = [
  { value: "newest",    label: "Newest"    },
  { value: "mostLiked", label: "Most Liked" },
  { value: "mostOpinions", label: "Most Active" },
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

      <style>{`
        .home {
          min-height: 100dvh;
          background: var(--color-bg);
        }

        /* ── Layout: sidebar flush-left + feed ── */
        .home-body {
          display: flex;
          align-items: flex-start;
          min-height: calc(100dvh - 64px);
        }

        /* ── Main feed ── */
        .home-feed {
          flex: 1;
          min-width: 0;
          padding: 28px 40px 80px 36px;
        }

        /* Centers the debate cards in the available feed space */
        .feed-inner {
          max-width: 720px;
          margin: 0 auto;
        }

        /* ── Feed header ── */
        .feed-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .feed-header-left {
          display: flex;
          align-items: baseline;
          gap: 10px;
          flex-wrap: wrap;
        }

        .feed-title {
          font-family: 'Fraunces', serif;
          font-size: 22px;
          font-weight: 600;
          color: var(--color-primary-dark);
          line-height: 1;
        }

        .feed-count {
          font-size: 12px;
          font-weight: 600;
          color: var(--color-muted);
          background: var(--color-primary-tint);
          padding: 3px 10px;
          border-radius: 20px;
        }

        .feed-header-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* ── Sort pills ── */
        .feed-sort {
          display: flex;
          gap: 4px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 9px;
          padding: 3px;
        }
        .sort-btn {
          padding: 6px 13px;
          border: none;
          background: transparent;
          border-radius: 7px;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--color-muted);
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .sort-btn:hover  { background: var(--color-primary-tint); color: var(--color-primary); }
        .sort-btn--active { background: var(--color-primary); color: #fff; }

        /* ── New debate button ── */
        .new-debate-btn {
          padding: 8px 16px;
          background: var(--color-primary);
          color: #fff;
          border: none;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: background 0.15s, transform 0.15s;
          white-space: nowrap;
        }
        .new-debate-btn:hover {
          background: var(--color-primary-dark);
          transform: translateY(-1px);
        }

        /* ── Feed list ── */
        @keyframes feedEnter {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .feed-item-enter {
          animation: feedEnter 0.3s ease both;
        }

        /* ── Empty state ── */
        .empty-state {
          text-align: center;
          padding: 72px 24px;
          background: var(--color-surface);
          border-radius: 14px;
          border: 1.5px dashed var(--color-border);
          color: var(--color-muted);
        }
        .empty-state svg { margin-bottom: 14px; }
        .empty-state h4 {
          font-family: 'Fraunces', serif;
          font-size: 18px;
          color: var(--color-primary-dark);
          margin-bottom: 6px;
        }
        .empty-state p {
          font-size: 14px;
          margin-bottom: 20px;
          line-height: 1.6;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .home-feed { padding: 20px 16px 60px; }
          .feed-header { flex-direction: column; align-items: flex-start; }
          .feed-header-right { width: 100%; justify-content: space-between; }
        }
      `}</style>
    </>
  );
};

export default Home;