import { useState, useEffect } from "react";
import AppNavbar from "../components/AppNavbar";
import { CATEGORIES } from "../mock/mockData";
import { getDebates, postDebate } from "../mock/mockData";
import "./Home.css";

/**
 * Administrator dashboard for publishing new weekly debates,
 * inspecting active and archived topics, and reviewing civic commentary.
 */
const AdminDashboard = () => {
  const [debates, setDebates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Post New Debate Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0] || "Society & Culture");
  const [formErrors, setFormErrors] = useState({});
  const [publishSuccessMsg, setPublishSuccessMsg] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  // Track expanded state for debates
  const [expandedDebates, setExpandedDebates] = useState({});

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

  const handlePostDebate = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!title.trim()) errors.title = "Debate title is required.";
    if (!description.trim()) errors.description = "Debate description is required.";
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
      setCategory(CATEGORIES[0] || "Society & Culture");
      setPublishSuccessMsg("New weekly debate published successfully! Previous topic has been archived.");
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

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <AppNavbar />

      <div className="home-page-wrap">
        <div className="home-layout" style={{ display: "block", maxWidth: 960, margin: "0 auto", padding: "24px 20px" }}>
          <main className="home-main" style={{ width: "100%", maxWidth: "100%" }}>
            {/* ═════════ 1. ADMIN POST NEW DEBATE FORM ═════════ */}
            <section className="admin-post-section" aria-label="Create New Debate">
              <div className="section-eyebrow-row">
                <span className="eyebrow-tag">EDITORIAL DESK</span>
                <span className="eyebrow-date">Curator Console</span>
              </div>

              <div className="admin-form-card">
                <h1 className="admin-card-title font-serif">Publish New Weekly Debate</h1>
                <p className="admin-card-sub">
                  Publishing a new topic automatically archives the current debate and begins a fresh community voting cycle.
                </p>

                <form onSubmit={handlePostDebate} className="admin-debate-form" noValidate>
                  {/* Title */}
                  <div className="form-group">
                    <label className="form-label">
                      Debate Topic / Proposition <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${formErrors.title ? "form-input--error" : ""}`}
                      placeholder="e.g. Should central city districts be completely pedestrianized?"
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
                      Thematic Category <span className="required-star">*</span>
                    </label>
                    <select
                      className={`form-select ${formErrors.category ? "form-input--error" : ""}`}
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
                      <p className="inline-field-error">{formErrors.category}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="form-group">
                    <label className="form-label">
                      Full Description & Framing <span className="required-star">*</span>
                    </label>
                    <textarea
                      className={`form-textarea ${formErrors.description ? "form-input--error" : ""}`}
                      rows="4"
                      placeholder="Provide background context and outline both perspectives fairly…"
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        setFormErrors((prev) => ({ ...prev, description: "" }));
                      }}
                    />
                    {formErrors.description && (
                      <p className="inline-field-error">{formErrors.description}</p>
                    )}
                  </div>

                  {formErrors.submit && (
                    <p className="inline-field-error submit-err">{formErrors.submit}</p>
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
            <section className="admin-debates-list-section" aria-label="All Platform Debates">
              <h2 className="admin-section-heading font-serif" style={{ marginTop: 40, marginBottom: 16 }}>
                All Debates ({debates.length})
              </h2>

              {loading ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "var(--color-muted)" }}>
                  Loading debates…
                </div>
              ) : debates.length === 0 ? (
                <div className="empty-state">
                  <h4>No debates found</h4>
                  <p>Publish a new weekly debate using the form above.</p>
                </div>
              ) : (
                <div className="archived-debates-list">
                  {debates.map((deb) => {
                    const isExpanded = Boolean(expandedDebates[deb.id || deb._id]);

                    return (
                      <article
                        key={deb.id || deb._id}
                        className={`archived-debate-card ${
                          deb.status === "current" ? "admin-current-border" : ""
                        }`}
                      >
                        <div className="arch-top-meta">
                          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <span className="debate-cat-badge">{deb.category}</span>
                            {deb.status === "current" ? (
                              <span className="active-status-badge">CURRENT TOPIC</span>
                            ) : (
                              <span className="arch-status-pill">ARCHIVED</span>
                            )}
                          </div>
                          <span className="arch-date">{formatDate(deb.postedAt)}</span>
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
                          onClick={() => toggleExpand(deb.id || deb._id)}
                        >
                          {isExpanded
                            ? "Hide Description & Responses ▲"
                            : `View Description & Responses (${deb.responses?.length || 0}) ▼`}
                        </button>

                        {/* Expanded Details without filter tabs */}
                        {isExpanded && (
                          <div className="archived-expanded-body">
                            <p className="arch-description">{deb.description}</p>

                            <div className="admin-readonly-notice">
                              <span>Admin View: Read-only access to community responses.</span>
                            </div>

                            <div className="responses-header-row">
                              <h4 className="arch-resp-title">
                                All Responses ({deb.responses?.length || 0})
                              </h4>
                            </div>

                            {(!deb.responses || deb.responses.length === 0) ? (
                              <div className="no-responses-msg">
                                No responses recorded yet for this debate.
                              </div>
                            ) : (
                              <div className="responses-list">
                                {deb.responses.map((r) => (
                                  <div key={r.id || r._id} className="response-item-card">
                                    <div className="resp-card-top">
                                      <span className="resp-author">@{r.username}</span>
                                      <span className={`resp-stance-tag resp-stance-tag--${r.stance}`}>
                                        {r.stance}
                                      </span>
                                      <span className="resp-date">{formatDate(r.createdAt)}</span>
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
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
