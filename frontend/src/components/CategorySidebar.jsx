import React from "react";

const CATEGORY_META = {
  Political: { icon: "⚖", color: "#5B6FA6" },
  Local:     { icon: "📌", color: "#8B6F47" },
  Global:    { icon: "🌐", color: "#4C8C5B" },
  Educational: { icon: "📖", color: "#7A5BA6" },
  Social:    { icon: "💬", color: "#C9A66B" },
};

const CATEGORIES = Object.keys(CATEGORY_META);

const CategorySidebar = ({ selected, setSelected }) => {
  const toggleCategory = (cat) => {
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <>
      <aside className="category-sidebar">
        <div className="cs-header">
          <div className="cs-header-line" />
          <span className="cs-header-label">Filter</span>
          <div className="cs-header-line" />
        </div>

        <ul className="cs-list">
          {CATEGORIES.map((cat) => {
            const meta = CATEGORY_META[cat];
            const isActive = selected.includes(cat);
            return (
              <li
                key={cat}
                className={`cs-item ${isActive ? "cs-item--active" : ""}`}
                style={{ "--cat-color": meta.color }}
                onClick={() => toggleCategory(cat)}
              >
                <span className="cs-icon">{meta.icon}</span>
                <span className="cs-label">{cat}</span>
                {isActive && <span className="cs-check">✓</span>}
              </li>
            );
          })}
        </ul>

        {selected.length > 0 && (
          <button className="cs-clear" onClick={() => setSelected([])}>
            Clear all
          </button>
        )}

        <div className="cs-divider" />

        <div className="cs-tip">
          <p>Select one or more categories to filter the feed.</p>
        </div>
      </aside>

      <style>{`
        .category-sidebar {
          width: 210px;
          flex-shrink: 0;
          padding: 28px 16px 24px;
          position: sticky;
          top: 64px;
          height: calc(100dvh - 64px);
          overflow-y: auto;
          border-right: 1px solid var(--color-border);
        }

        /* Header */
        .cs-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 18px;
        }
        .cs-header-line {
          flex: 1;
          height: 1px;
          background: var(--color-border);
        }
        .cs-header-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: var(--color-muted);
        }

        /* List */
        .cs-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .cs-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 500;
          color: var(--color-text);
          cursor: pointer;
          transition: background 0.15s ease, transform 0.15s ease;
          border: 1.5px solid transparent;
          position: relative;
          user-select: none;
        }
        .cs-item:hover {
          background: var(--color-primary-tint);
          transform: translateX(2px);
        }
        .cs-item--active {
          background: linear-gradient(
            135deg,
            rgba(62, 98, 89, 0.1),
            rgba(62, 98, 89, 0.05)
          );
          border-color: var(--color-primary);
          color: var(--color-primary-dark);
          font-weight: 600;
        }
        .cs-icon {
          font-size: 15px;
          flex-shrink: 0;
          width: 20px;
          text-align: center;
        }
        .cs-label { flex: 1; }
        .cs-check {
          font-size: 11px;
          font-weight: 700;
          color: var(--color-primary);
          background: var(--color-primary-tint);
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Clear */
        .cs-clear {
          margin-top: 14px;
          width: 100%;
          padding: 8px 12px;
          background: transparent;
          border: 1.5px solid var(--color-border);
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          color: var(--color-muted);
          cursor: pointer;
          transition: border-color 0.15s ease, color 0.15s ease;
          font-family: 'Inter', sans-serif;
        }
        .cs-clear:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        /* Divider + tip */
        .cs-divider {
          height: 1px;
          background: var(--color-border);
          margin: 20px 0 14px;
        }
        .cs-tip p {
          font-size: 11.5px;
          color: var(--color-muted);
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .category-sidebar {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export { CATEGORIES };
export default CategorySidebar;