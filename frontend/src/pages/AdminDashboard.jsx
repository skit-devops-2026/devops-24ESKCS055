import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import AppNavbar from "../components/AppNavbar";
import CategorySidebar from "../components/CategorySidebar";
import { CATEGORIES } from "../mock/mockData";
import { getDebates, postDebate } from "../mock/mockData";
import "./Home.css";

/**
 * Admin Dashboard page allowing platform administrators to publish new weekly debates,
 * view all current and archived topics, and inspect community responses.
 *
 * @returns {JSX.Element} The rendered AdminDashboard page.
 */
const AdminDashboard = () => {
  const { user } = useAuth();
  const [debates, setDebates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Category Filters (AND logic)
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Post New Debate Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0] || "");
  const [formErrors, setFormErrors] = useState({});
  const [publishSuccessMsg, setPublishSuccessMsg] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  // Response filters and expansion state for each debate
  const [expandedDebates, setExpandedDebates] = useState({});
  const [responseFilters, setResponseFilters] = useState({}); // { [debateId]: "all" | "for" | "against" | "neutral" }

  const fetchDebates = async () => {
    try {
      const data = await getDebates();
      setDebates(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebates();
  }, []);

  const filteredDebates = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();
    return debates.filter((debate) => {
      if (!debate) return false;
      const titleMatch = debate.title.toLowerCase().includes(cleanSearch);
      const descMatch = (debate.description || "")
        .toLowerCase()
        .includes(cleanSearch);
      const searchMatch = !cleanSearch || titleMatch || descMatch;
      const categoryMatch =
        selectedCategory === "All" || debate.category === selectedCategory;
      return searchMatch && categoryMatch;
    });
  }, [debates, search, selectedCategory]);

  const hasActiveFilters = Boolean(search.trim() || selectedCategory !== "All");

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
  };

  const handlePostDebate = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!title.trim()) errors.title = "Debate title is required.";
    if (!description.trim())
      errors.description = "Debate description is required.";
    if (!category.trim()) errors.category = "Category is required.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsPublishing(true);
    setPublishSuccessMsg("");

    try {
      await postDebate({
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
      });
      setTitle("");
      setDescription("");
      setCategory(CATEGORIES[0] || "");
      setPublishSuccessMsg(
        "New weekly debate published successfully! Previous topic has been archived."
      );
      setTimeout(() => setPublishSuccessMsg(""), 6000);
      await fetchDebates();
    } catch (err) {
      setFormErrors({ submit: err?.message || "Failed to publish debate." });
    } finally {
      setIsPublishing(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedDebates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recent";
    }
  };

  const getFilteredResponses = (responses, filter) => {
    if (!responses) return [];
    if (!filter || filter === "all") return responses;
    return responses.filter((r) => r.stance === filter);
  };

  return (
    <div className="home">
      <AppNavbar search={search} setSearch={setSearch} />

      <div className="home-body">
        {/* Left Category Sidebar */}
        <CategorySidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Main Admin Feed */}
        <main className="home-feed">
          <div className="feed-inner">
            {/* Header */}
            <div className="feed-header">
              <div className="feed-header-left">
                <h1 className="feed-title">Admin Management Dashboard</h1>
                <span className="feed-count">
                  {filteredDebates.length} debate
                  {filteredDebates.length !== 1 ? "s" : ""} found
                </span>
              </div>

              {hasActiveFilters && (
                <div className="feed-header-right">
                  <button
                    type="button"
                    className="cat-clear-inline"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            {/* ═════════ 1. POST NEW DEBATE FORM ═════════ */}
            <section
              className="admin-form-section"
              aria-label="Post New Debate Form"
            >
              <div className="admin-form-card">
                <h2 className="admin-section-heading font-serif">
                  Post New Weekly Debate
                </h2>
                <p className="admin-section-sub">
                  Publishing a new topic automatically sets it as the active
                  "current" debate and archives the previous one.
                </p>

                <form
                  onSubmit={handlePostDebate}
                  className="admin-new-debate-form"
                  noValidate
                >
                  {/* Title */}
                  <div className="form-group">
                    <label className="form-label">
                      Debate Title <span className="required-star">*</span>
                    </label>
                    <input
                      className={`form-input ${
                        formErrors.title ? "form-input--error" : ""
                      }`}
                      placeholder="e.g., Should central city districts ban personal motor vehicles?"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        setFormErrors((prev) => ({ ...prev, title: "" }));
                      }}
                    />
                    {formErrors.title && (
                      <p className="inline-field-error">{formErrors.title}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div className="form-group">
                    <label className="form-label">
                      Category <span className="required-star">*</span>
                    </label>
                    <select
                      className={`form-select ${
                        formErrors.category ? "form-input--error" : ""
                      }`}
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setFormErrors((prev) => ({ ...prev, category: "" }));
                      }}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {formErrors.category && (
                      <p className="inline-field-error">
                        {formErrors.category}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="form-group">
                    <label className="form-label">
                      Full Description & Framing{" "}
                      <span className="required-star">*</span>
                    </label>
                    <textarea
                      className={`form-textarea ${
                        formErrors.description ? "form-input--error" : ""
                      }`}
                      rows="4"
                      placeholder="Provide background context and outline both perspectives fairly…"
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        setFormErrors((prev) => ({ ...prev, description: "" }));
                      }}
                    />
                    {formErrors.description && (
                      <p className="inline-field-error">
                        {formErrors.description}
                      </p>
                    )}
                  </div>

                  {formErrors.submit && (
                    <p className="inline-field-error submit-err">
                      {formErrors.submit}
                    </p>
                  )}
                  {publishSuccessMsg && (
                    <div className="admin-success-banner" role="status">
                      {publishSuccessMsg}
                    </div>
                  )}

                  <div className="admin-form-submit-row">
                    <button
                      type="submit"
                      className="admin-publish-btn"
                      disabled={isPublishing}
                    >
                      {isPublishing ? "Publishing…" : "Publish Weekly Debate"}
                    </button>
                  </div>
                </form>
              </div>
            </section>

            {/* ═════════ 2. VIEW ALL DEBATES (CURRENT FIRST, THEN ARCHIVED) ═════════ */}
            <section
              className="admin-debates-list-section"
              aria-label="All Platform Debates"
            >
              <h2
                className="admin-section-heading font-serif"
                style={{ marginTop: 40, marginBottom: 16 }}
              >
                All Debates ({filteredDebates.length})
              </h2>

              {loading ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 0",
                    color: "var(--color-muted)",
                  }}
                >
                  Loading debates…
                </div>
              ) : filteredDebates.length === 0 ? (
                <div className="empty-state">
                  <h4>No debates match your filters</h4>
                  <p>
                    No debates match '{search}' in {selectedCategory}. Try another
                    keyword or clear filters.
                  </p>
                  <button
                    type="button"
                    className="btn-primary-sm"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="archived-debates-list">
                  {filteredDebates.map((deb) => {
                    const debKey = deb.id || deb._id;
                    const isExpanded = Boolean(expandedDebates[debKey]);
                    const currentFilter = responseFilters[debKey] || "all";
                    const filteredResponses = getFilteredResponses(
                      deb.responses,
                      currentFilter
                    );

                    return (
                      <article
                        key={debKey}
                        className={`archived-debate-card ${
                          deb.status === "current" ? "admin-current-border" : ""
                        }`}
                      >
                        <div className="arch-top-meta">
                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              alignItems: "center",
                            }}
                          >
                            <span className="debate-cat-badge">
                              {deb.category}
                            </span>
                            {deb.status === "current" ? (
                              <span className="active-status-badge">
                                CURRENT TOPIC
                              </span>
                            ) : (
                              <span className="arch-status-pill">ARCHIVED</span>
                            )}
                          </div>
                          <span className="arch-date">
                            {formatDate(deb.postedAt)}
                          </span>
                        </div>

                        <h3 className="arch-title font-serif">{deb.title}</h3>

                        {/* Counts breakdown */}
                        <div className="arch-counts-row">
                          <span className="stance-count-pill stance-count-pill--for">
                            For: {deb.counts?.for || 0}
                          </span>
                          <span className="stance-count-pill stance-count-pill--against">
                            Against: {deb.counts?.against || 0}
                          </span>
                          <span className="stance-count-pill stance-count-pill--neutral">
                            Neutral: {deb.counts?.neutral || 0}
                          </span>
                          <span className="stance-count-pill stance-count-pill--total">
                            Total: {deb.counts?.total || 0}
                          </span>
                        </div>

                        {/* Expand / Collapse toggle */}
                        <button
                          type="button"
                          className="btn-toggle-expand"
                          onClick={() => toggleExpand(debKey)}
                        >
                          {isExpanded
                            ? "Hide Description & Responses ▲"
                            : `View Description & Responses (${
                                deb.responses?.length || 0
                              }) ▼`}
                        </button>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="archived-expanded-body">
                            <p className="arch-description">
                              {deb.description}
                            </p>

                            <div className="admin-readonly-notice">
                              <span>
                                Admin View: Read-only access to community
                                responses.
                              </span>
                            </div>

                            {/* Response Stance Filter Tabs */}
                            <div className="responses-header-row">
                              <h4 className="arch-resp-title">
                                All Responses ({deb.responses?.length || 0})
                              </h4>

                              <div className="response-filter-tabs">
                                <button
                                  type="button"
                                  className={`rf-tab ${
                                    currentFilter === "all"
                                      ? "rf-tab--active"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    setResponseFilters((prev) => ({
                                      ...prev,
                                      [debKey]: "all",
                                    }))
                                  }
                                >
                                  All ({deb.responses?.length || 0})
                                </button>
                                <button
                                  type="button"
                                  className={`rf-tab ${
                                    currentFilter === "for"
                                      ? "rf-tab--active"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    setResponseFilters((prev) => ({
                                      ...prev,
                                      [debKey]: "for",
                                    }))
                                  }
                                >
                                  For ({deb.counts?.for || 0})
                                </button>
                                <button
                                  type="button"
                                  className={`rf-tab ${
                                    currentFilter === "against"
                                      ? "rf-tab--active"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    setResponseFilters((prev) => ({
                                      ...prev,
                                      [debKey]: "against",
                                    }))
                                  }
                                >
                                  Against ({deb.counts?.against || 0})
                                </button>
                                <button
                                  type="button"
                                  className={`rf-tab ${
                                    currentFilter === "neutral"
                                      ? "rf-tab--active"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    setResponseFilters((prev) => ({
                                      ...prev,
                                      [debKey]: "neutral",
                                    }))
                                  }
                                >
                                  Neutral ({deb.counts?.neutral || 0})
                                </button>
                              </div>
                            </div>

                            {/* Responses List */}
                            {filteredResponses.length === 0 ? (
                              <div className="no-responses-msg">
                                No responses recorded in this stance group.
                              </div>
                            ) : (
                              <div className="responses-list">
                                {filteredResponses.map((r) => (
                                  <div
                                    key={r.id || r._id}
                                    className="response-item-card"
                                  >
                                    <div className="resp-card-top">
                                      <span className="resp-author">
                                        @{r.username}
                                      </span>
                                      <span
                                        className={`resp-stance-tag resp-stance-tag--${r.stance}`}
                                      >
                                        {r.stance}
                                      </span>
                                      <span className="resp-date">
                                        {formatDate(r.createdAt)}
                                      </span>
                                    </div>
                                    <p className="resp-text">{r.text}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      <style>{`
        .admin-form-card {
          background: var(--color-surface);
          border: 1.5px solid var(--color-border);
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 4px 20px rgba(43,43,43,0.06);
        }
        .admin-section-heading {
          font-size: 22px;
          font-weight: 700;
          color: var(--color-primary-dark);
          margin-bottom: 6px;
        }
        .admin-section-sub {
          font-size: 13.5px;
          color: var(--color-muted);
          margin-bottom: 22px;
          line-height: 1.5;
        }
        .admin-new-debate-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        .form-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-text);
          margin-bottom: 6px;
        }
        .required-star {
          color: var(--color-against);
        }
        .form-input, .form-select, .form-textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid var(--color-border);
          border-radius: 8px;
          font-family: inherit;
          font-size: 14px;
          color: var(--color-text);
          background: var(--color-bg);
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.15s ease;
        }
        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: var(--color-primary);
          background: #fff;
        }
        .form-input--error {
          border-color: var(--color-against) !important;
        }
        .inline-field-error {
          font-size: 12.5px;
          color: var(--color-against);
          margin-top: 4px;
        }
        .submit-err {
          text-align: center;
        }
        .admin-success-banner {
          padding: 10px 14px;
          background: rgba(44, 74, 67, 0.1);
          border: 1px solid var(--color-for);
          border-radius: 8px;
          color: var(--color-for);
          font-size: 13.5px;
          font-weight: 600;
          text-align: center;
        }
        .admin-form-submit-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 6px;
        }
        .admin-publish-btn {
          padding: 10px 22px;
          background: var(--color-primary);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.15s ease, transform 0.1s ease;
        }
        .admin-publish-btn:hover:not(:disabled) {
          opacity: 0.92;
        }
        .admin-publish-btn:active:not(:disabled) {
          transform: scale(0.98);
        }
        .admin-publish-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .admin-current-border {
          border-left: 4px solid var(--color-primary);
        }
        .arch-status-pill {
          font-size: 10.5px;
          font-weight: 700;
          padding: 2px 8px;
          background: var(--color-border);
          color: var(--color-muted);
          border-radius: 9999px;
        }
        .stance-count-pill--total {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          color: var(--color-text);
        }
        .admin-readonly-notice {
          font-size: 12px;
          color: var(--color-muted);
          background: var(--color-bg);
          padding: 6px 12px;
          border-radius: 6px;
          margin-bottom: 14px;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
