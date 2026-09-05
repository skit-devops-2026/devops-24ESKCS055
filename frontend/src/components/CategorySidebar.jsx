import React from "react";
import { CATEGORIES } from "../data/mockPosts";

const CategorySidebar = ({ selected, setSelected }) => {
  const toggle = (cat) => {
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <>
      <aside className="cat-sidebar">
        <div className="cat-heading">Categories</div>

        <ul className="cat-list">
          {CATEGORIES.map((cat) => {
            const active = selected.includes(cat);
            return (
              <li
                key={cat}
                className={`cat-item ${active ? "cat-item--active" : ""}`}
                onClick={() => toggle(cat)}
              >
                {cat}
                {active && <span className="cat-tick">✓</span>}
              </li>
            );
          })}
        </ul>

        {selected.length > 0 && (
          <button className="cat-clear" onClick={() => setSelected([])}>
            Clear filters
          </button>
        )}
      </aside>

      <style>{`
        .cat-sidebar {
          width: 220px;
          flex-shrink: 0;
          padding: 28px 16px 40px 24px;
          background: #EAF3EE;
          border-right: 1px solid rgba(62, 98, 89, 0.12);
          position: sticky;
          top: 64px;
          height: calc(100dvh - 64px);
          overflow-y: auto;
        }

        .cat-heading {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          color: var(--color-primary);
          margin-bottom: 14px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(62, 98, 89, 0.15);
          opacity: 0.7;
        }

        .cat-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .cat-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: var(--color-primary-dark);
          cursor: pointer;
          transition: background 0.15s;
          user-select: none;
        }
        .cat-item:hover {
          background: rgba(62, 98, 89, 0.1);
        }
        .cat-item--active {
          background: var(--color-primary);
          color: #fff;
          font-weight: 600;
        }
        .cat-item--active:hover {
          background: var(--color-primary-dark);
        }

        .cat-tick {
          font-size: 10px;
          font-weight: 700;
          opacity: 0.9;
        }

        .cat-clear {
          margin-top: 16px;
          width: 100%;
          padding: 8px 0;
          background: transparent;
          border: 1.5px solid rgba(62, 98, 89, 0.25);
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          color: var(--color-primary);
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: background 0.15s, border-color 0.15s;
        }
        .cat-clear:hover {
          background: rgba(62, 98, 89, 0.1);
          border-color: var(--color-primary);
        }

        @media (max-width: 768px) {
          .cat-sidebar { display: none; }
        }
      `}</style>
    </>
  );
};

export default CategorySidebar;