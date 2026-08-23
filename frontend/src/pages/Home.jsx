import React, { useState, useMemo } from "react";
import AppNavbar from "../components/AppNavbar";
import CategorySidebar from "../components/CategorySidebar";
import PostCard from "../components/PostCard";
import AddPostModal from "../components/AddPostModal";
import { mockPosts } from "../data/mockPosts";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "mostLiked", label: "Most Liked" },
  { value: "mostVoted", label: "Most Voted" },
];

const Home = () => {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [posts, setPosts] = useState(mockPosts);
  const [showModal, setShowModal] = useState(false);
  const [sort, setSort] = useState("newest");

  const filteredPosts = useMemo(() => {
    return posts
      .filter((p) => (selectedCategories.length ? selectedCategories.includes(p.category) : true))
      .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (sort === "newest")    return new Date(b.createdAt) - new Date(a.createdAt);
        if (sort === "mostLiked") return b.likes.length - a.likes.length;
        if (sort === "mostVoted") return (b.votesFor.length + b.votesAgainst.length) - (a.votesFor.length + a.votesAgainst.length);
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

  const totalVotes = posts.reduce((acc, p) => acc + p.votesFor.length + p.votesAgainst.length, 0);

  return (
    <>
      <div className="home">
        <AppNavbar search={search} setSearch={setSearch} />

        <div className="home-body">
          <CategorySidebar selected={selectedCategories} setSelected={setSelectedCategories} />

          <main className="home-feed">

            {/* Stats banner */}
            <div className="stats-banner">
              <div className="stat-pill">
                <span className="stat-num">{posts.length}</span>
                <span className="stat-lbl">Debates</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-pill">
                <span className="stat-num">{totalVotes}</span>
                <span className="stat-lbl">Votes Cast</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-pill">
                <span className="stat-num">5</span>
                <span className="stat-lbl">Topics</span>
              </div>

              <button className="add-post-btn" onClick={() => setShowModal(true)}>
                <span className="add-post-icon">+</span>
                Start a Debate
              </button>
            </div>

            {/* Feed header */}
            <div className="feed-header">
              <div className="feed-header-left">
                <h2 className="feed-title">
                  {selectedCategories.length > 0
                    ? selectedCategories.join(" · ")
                    : "All Debates"}
                </h2>
                {filteredPosts.length > 0 && (
                  <span className="feed-count">{filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}</span>
                )}
              </div>

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
            </div>

            {/* Posts or empty state */}
            {filteredPosts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg viewBox="0 0 64 64" fill="none" width="52" height="52">
                    <circle cx="32" cy="32" r="30" stroke="var(--color-border)" strokeWidth="2" />
                    <path d="M20 32h24M32 20v24" stroke="var(--color-muted)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
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
                    style={{ animationDelay: `${i * 60}ms` }}
                    className="feed-item-enter"
                  >
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            )}
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

        .home-body {
          display: flex;
          max-width: 1100px;
          margin: 0 auto;
          align-items: flex-start;
        }

        /* ── Feed ── */
        .home-feed {
          flex: 1;
          padding: 28px 28px 80px;
          min-width: 0;
        }

        /* ── Stats banner ── */
        .stats-banner {
          display: flex;
          align-items: center;
          gap: 0;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          border-radius: 16px;
          padding: 18px 24px;
          margin-bottom: 24px;
          box-shadow: 0 6px 24px rgba(62, 98, 89, 0.22);
        }

        .stat-pill {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 20px;
        }
        .stat-num {
          font-family: 'Fraunces', serif;
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }
        .stat-lbl {
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.65);
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-top: 3px;
        }

        .stat-divider {
          width: 1px;
          height: 36px;
          background: rgba(255,255,255,0.2);
        }

        .add-post-btn {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 20px;
          background: rgba(255,255,255,0.15);
          border: 1.5px solid rgba(255,255,255,0.35);
          border-radius: 10px;
          color: #fff;
          font-size: 13.5px;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: background 0.18s ease, transform 0.18s ease;
        }
        .add-post-btn:hover {
          background: rgba(255,255,255,0.25);
          transform: translateY(-1px);
        }
        .add-post-icon {
          font-size: 18px;
          line-height: 1;
          font-weight: 400;
        }

        /* ── Feed header ── */
        .feed-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .feed-header-left {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }

        .feed-title {
          font-family: 'Fraunces', serif;
          font-size: 22px;
          font-weight: 600;
          color: var(--color-primary-dark);
        }

        .feed-count {
          font-size: 12px;
          font-weight: 600;
          color: var(--color-muted);
          background: var(--color-primary-tint);
          padding: 3px 10px;
          border-radius: 20px;
        }

        /* Sort pills */
        .feed-sort {
          display: flex;
          gap: 6px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 4px;
        }
        .sort-btn {
          padding: 6px 14px;
          border: none;
          background: transparent;
          border-radius: 7px;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--color-muted);
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .sort-btn:hover { background: var(--color-primary-tint); color: var(--color-primary); }
        .sort-btn--active {
          background: var(--color-primary);
          color: #fff;
        }

        /* ── Feed list ── */
        .feed-list { }

        @keyframes feedEnter {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .feed-item-enter {
          animation: feedEnter 0.35s ease both;
        }

        /* ── Empty state ── */
        .empty-state {
          text-align: center;
          padding: 80px 24px;
          background: var(--color-surface);
          border-radius: 16px;
          border: 1.5px dashed var(--color-border);
        }
        .empty-icon {
          margin: 0 auto 16px;
          width: 64px;
          height: 64px;
          background: var(--color-primary-tint);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .empty-state h4 {
          font-size: 18px;
          font-family: 'Fraunces', serif;
          color: var(--color-primary-dark);
          margin-bottom: 8px;
        }
        .empty-state p {
          color: var(--color-muted);
          font-size: 14px;
          margin-bottom: 20px;
        }

        @media (max-width: 768px) {
          .home-feed { padding: 20px 16px 60px; }
          .stats-banner {
            padding: 14px 16px;
            gap: 0;
            flex-wrap: wrap;
          }
          .stat-pill { padding: 0 12px; }
          .add-post-btn { width: 100%; justify-content: center; margin-top: 12px; }
          .feed-header { flex-direction: column; align-items: flex-start; }
          .feed-sort { order: -1; }
        }
      `}</style>
    </>
  );
};

export default Home;