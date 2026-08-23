import React, { useState, useMemo } from "react";
import AppNavbar from "../components/AppNavbar";
import CategorySidebar from "../components/CategorySidebar";
import PostCard from "../components/PostCard";
import { mockPosts } from "../data/mockPosts";

const Home = () => {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [posts] = useState(mockPosts);

  const filteredPosts = useMemo(() => {
    return posts
      .filter((p) => (selectedCategories.length ? selectedCategories.includes(p.category) : true))
      .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [posts, selectedCategories, search]);

  return (
    <>
      <div className="home">
        <AppNavbar search={search} setSearch={setSearch} />

        <div className="home-body">
          <CategorySidebar selected={selectedCategories} setSelected={setSelectedCategories} />

          <main className="home-feed">
            <div className="feed-header">
              <h2>Debates & Discussions</h2>
            </div>

            {filteredPosts.length === 0 && <p className="no-posts">No posts found.</p>}

            {filteredPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </main>
        </div>
      </div>

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