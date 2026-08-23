import React from "react";
import { CATEGORIES } from "../data/mockPosts";

const CategorySidebar = ({ selected, setSelected }) => {
  const toggleCategory = (cat) => {
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <>
      <aside className="category-sidebar">
        <h4>Categories</h4>
        <ul>
          {CATEGORIES.map((cat) => (
            <li
              key={cat}
              className={selected.includes(cat) ? "cat-active" : ""}
              onClick={() => toggleCategory(cat)}
            >
              {cat}
            </li>
          ))}
        </ul>
        {selected.length > 0 && (
          <button className="btn-ghost btn" onClick={() => setSelected([])}>
            Clear filters
          </button>
        )}
      </aside>

      <style>{`
        .category-sidebar {
          width: 200px;
          flex-shrink: 0;
          padding: 24px 16px;
        }

        .category-sidebar h4 {
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--color-muted);
          margin-bottom: 14px;
        }

        .category-sidebar ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .category-sidebar li {
          padding: 9px 12px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text);
          cursor: pointer;
        }

        .category-sidebar li:hover { background: var(--color-primary-tint); }

        .cat-active {
          background: var(--color-primary) !important;
          color: #fff !important;
        }

        .category-sidebar button { margin-top: 16px; width: 100%; font-size: 13px; }
      `}</style>
    </>
  );
};

export default CategorySidebar;