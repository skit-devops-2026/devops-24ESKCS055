import { useState, useEffect, useMemo, useCallback } from "react";
import AppNavbar from "../components/AppNavbar";
import CategorySidebar from "../components/CategorySidebar";
import StanceModal from "../components/StanceModal";
import { useAuth } from "../context/AuthContext";
import {
  getDebates,
  getStance,
  setStance as saveStance,
  postResponse,
} from "../mock/mockData";
import "./Home.css";

/**
 * Main User Dashboard displaying current active weekly debate,
 * stance locking prompt, reasoned response submissions, and previous archived debates.
 * Fully styled according to SaySo's design system.
 *
 * @returns {JSX.Element} The rendered Home dashboard.
 */
const Home = () => {
  const { user } = useAuth();

  const [debates, setDebates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Category Filters (AND logic)
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Stance confirmation modal state
  const [pendingStance, setPendingStance] = useState(null); // { debateId, stance }
  const [userStances, setUserStances] = useState({});

  // Response form state for the current debate
  const [responseText, setResponseText] = useState("");
  const [responseError, setResponseError] = useState("");
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  const [responseSuccessMsg, setResponseSuccessMsg] = useState("");

  // Stance filter for current debate responses: "all" | "for" | "against" | "neutral"
  const [currentResponseFilter, setCurrentResponseFilter] = useState("all");

  // Track expanded state of archived debates: { [debateId]: boolean }
  const [expandedDebates, setExpandedDebates] = useState({});
  // Stance filter for each archived debate: { [debateId]: "all" | "for" | "against" | "neutral" }
  const [archivedResponseFilters, setArchivedResponseFilters] = useState({});

  // Load debates from data service
  const fetchDebates = useCallback(async () => {
    try {
      const data = await getDebates();
      setDebates(data);

      // Load user stances for each debate
      if (user?._id) {
        const stancesMap = {};
        data.forEach((d) => {
          const key = d.id || d._id;
          const st = getStance(user._id, key);
          if (st) stancesMap[key] = st;
        });
        setUserStances(stancesMap);

        // Preload user's existing response for the current debate if present
        const current = data.find((d) => d.status === "current");
        if (current) {
          const userResp = current.responses?.find((r) => r.userId === user._id);
          if (userResp) {
            setResponseText(userResp.text);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchDebates();
  }, [fetchDebates]);

  // Separate current weekly debate and archived debates
  const currentDebate = useMemo(
    () => debates.find((d) => d.status === "current") || null,
    [debates]
  );

  const archivedDebates = useMemo(
    () => debates.filter((d) => d.status === "archived"),
    [debates]
  );

  // Filter helper: search covers title & description, category matches
  const matchesFilter = useCallback(
    (debate) => {
      if (!debate) return false;
      const cleanSearch = search.trim().toLowerCase();
      const titleMatch = debate.title.toLowerCase().includes(cleanSearch);
      const descMatch = (debate.description || "")
        .toLowerCase()
        .includes(cleanSearch);
      const searchMatch = !cleanSearch || titleMatch || descMatch;

      const categoryMatch =
        selectedCategory === "All" || debate.category === selectedCategory;

      return searchMatch && categoryMatch;
    },
    [search, selectedCategory]
  );

  const currentMatches = useMemo(
    () => (currentDebate ? matchesFilter(currentDebate) : false),
    [currentDebate, matchesFilter]
  );

  const filteredArchived = useMemo(
    () => archivedDebates.filter(matchesFilter),
    [archivedDebates, matchesFilter]
  );

  // Total matching debates count
  const totalMatchesCount = (currentMatches ? 1 : 0) + filteredArchived.length;

  const hasActiveFilters = Boolean(search.trim() || selectedCategory !== "All");

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
  };

  // Stance selection trigger
  const handleSelectStance = (stance) => {
    if (!currentDebate) return;
    const key = currentDebate.id || currentDebate._id;
    setPendingStance({ debateId: key, stance });
  };

  // Confirm stance lock
  const handleConfirmStance = async () => {
    if (!pendingStance || !user?._id) return;
    try {
      await saveStance({
        debateId: pendingStance.debateId,
        userId: user._id,
        stance: pendingStance.stance,
      });
      setUserStances((prev) => ({
        ...prev,
        [pendingStance.debateId]: pendingStance.stance,
      }));
    } finally {
      setPendingStance(null);
    }
  };

  // Handle Response Submission for current debate
  const handlePostResponse = async (e) => {
    e.preventDefault();
    if (!currentDebate) return;

    const key = currentDebate.id || currentDebate._id;
    const lockedStance = userStances[key];
    if (!lockedStance) {
      setResponseError("You must choose a stance before posting a response.");
      return;
    }

    const trimmed = responseText.trim();
    if (!trimmed) {
      setResponseError("Response cannot be empty or whitespace-only.");
      return;
    }
    if (trimmed.length > 1000) {
      setResponseError("Response cannot exceed 1000 characters.");
      return;
    }

    setResponseError("");
    setIsSubmittingResponse(true);
    setResponseSuccessMsg("");

    try {
      await postResponse({
        debateId: key,
        userId: user._id,
        username: user.username,
        stance: lockedStance,
        text: trimmed,
      });
      setResponseSuccessMsg("Your response has been published.");
      setTimeout(() => setResponseSuccessMsg(""), 4000);
      await fetchDebates();
    } catch (err) {
      setResponseError(err?.message || "Failed to post response.");
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  // Toggle expand for archived debate
  const toggleExpand = (id) => {
    setExpandedDebates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Format date helper
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

  // Filter responses by stance
  const getFilteredResponses = (responses, filter) => {
    if (!responses) return [];
    if (filter === "all") return responses;
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

        {/* Main Feed */}
        <main className="home-feed">
          <div className="feed-inner">
            {/* Feed Header with result count & clear action */}
            <div className="feed-header">
              <div className="feed-header-left">
                <h1 className="feed-title">
                  {selectedCategory === "All"
                    ? "Weekly Debates"
                    : selectedCategory}
                </h1>
                <span className="feed-count">
                  {totalMatchesCount} debate
                  {totalMatchesCount !== 1 ? "s" : ""} found
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

            {loading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 0",
                  color: "var(--color-muted)",
                }}
              >
                Loading debates…
              </div>
            ) : totalMatchesCount === 0 ? (
              /* Empty result state */
              <div className="empty-state">
                <svg viewBox="0 0 48 48" fill="none" width="44" height="44">
                  <circle
                    cx="24"
                    cy="24"
                    r="22"
                    stroke="var(--color-border)"
                    strokeWidth="2"
                  />
                  <path
                    d="M16 24h16M24 16v16"
                    stroke="var(--color-muted)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <h4>No matching debates</h4>
                <p>
                  No debates match your current search and filter settings. Try
                  adjusting your query.
                </p>
                <button
                  type="button"
                  className="cat-clear-inline"
                  onClick={clearFilters}
                  style={{ marginTop: 8 }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                {/* ═════════ 1. THIS WEEK'S DEBATE (TOP) ═════════ */}
                {currentMatches && currentDebate && (
                  <section
                    className="current-debate-section"
                    aria-label="This Week's Debate"
                  >
                    <div className="section-eyebrow-row">
                      <span className="eyebrow-tag">THIS WEEK'S TOPIC</span>
                      <span className="eyebrow-date">
                        {formatDate(currentDebate.postedAt)}
                      </span>
                    </div>

                    <article className="current-debate-card">
                      <div className="debate-meta-top">
                        <span className="debate-cat-badge">
                          {currentDebate.category}
                        </span>
                        <span className="active-status-badge">CURRENT</span>
                      </div>

                      <h2 className="current-debate-title font-serif">
                        {currentDebate.title}
                      </h2>
                      <p className="current-debate-desc">
                        {currentDebate.description}
                      </p>

                      {/* Stance counts summary bar */}
                      <div className="stance-counts-row">
                        <span className="stance-count-pill stance-count-pill--for">
                          For: {currentDebate.counts?.for || 0}
                        </span>
                        <span className="stance-count-pill stance-count-pill--against">
                          Against: {currentDebate.counts?.against || 0}
                        </span>
                        <span className="stance-count-pill stance-count-pill--neutral">
                          Neutral: {currentDebate.counts?.neutral || 0}
                        </span>
                      </div>

                      {/* Area to take a stance and respond */}
                      <div className="stance-response-box">
                        <h3 className="srb-heading">Your Position</h3>

                        {!userStances[currentDebate.id || currentDebate._id] ? (
                          /* Stance not yet chosen */
                          <div className="stance-select-prompt">
                            <p className="srb-instruction">
                              Choose your stance before responding. Once
                              confirmed, your stance is permanently locked for
                              this debate.
                            </p>
                            <div className="stance-buttons-trio">
                              <button
                                type="button"
                                className="stance-btn stance-btn--for"
                                onClick={() => handleSelectStance("for")}
                              >
                                + For
                              </button>
                              <button
                                type="button"
                                className="stance-btn stance-btn--against"
                                onClick={() => handleSelectStance("against")}
                              >
                                – Against
                              </button>
                              <button
                                type="button"
                                className="stance-btn stance-btn--neutral"
                                onClick={() => handleSelectStance("neutral")}
                              >
                                • Neutral
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Stance locked */
                          <div className="stance-locked-container">
                            <div className="stance-locked-banner">
                              <span>Your stance is locked:</span>
                              <strong
                                className={`locked-badge locked-badge--${
                                  userStances[
                                    currentDebate.id || currentDebate._id
                                  ]
                                }`}
                              >
                                {userStances[
                                  currentDebate.id || currentDebate._id
                                ] === "for"
                                  ? "For"
                                  : userStances[
                                      currentDebate.id || currentDebate._id
                                    ] === "against"
                                  ? "Against"
                                  : "Neutral"}
                              </strong>
                              <span className="locked-note">
                                (Cannot be changed for this debate)
                              </span>
                            </div>

                            {/* Response submission / edit form */}
                            <form
                              onSubmit={handlePostResponse}
                              className="response-form"
                            >
                              <label className="response-form-label">
                                {currentDebate.responses?.some(
                                  (r) => r.userId === user._id
                                )
                                  ? "Edit Your Response:"
                                  : "Write Your Reasoned Response:"}
                              </label>

                              <textarea
                                className="response-textarea"
                                rows="4"
                                maxLength={1000}
                                placeholder="Explain the reasoning behind your position (max 1000 characters)…"
                                value={responseText}
                                onChange={(e) => {
                                  setResponseText(e.target.value);
                                  setResponseError("");
                                }}
                              />

                              <div className="response-form-footer">
                                <span
                                  className={`char-counter ${
                                    1000 - responseText.length < 50
                                      ? "char-counter--warn"
                                      : ""
                                  }`}
                                >
                                  {1000 - responseText.length} characters
                                  remaining
                                </span>

                                <button
                                  type="submit"
                                  className="btn-submit-response"
                                  disabled={
                                    isSubmittingResponse || !responseText.trim()
                                  }
                                >
                                  {isSubmittingResponse
                                    ? "Saving…"
                                    : currentDebate.responses?.some(
                                        (r) => r.userId === user._id
                                      )
                                    ? "Update Response"
                                    : "Post Response"}
                                </button>
                              </div>

                              {responseError && (
                                <p className="response-error-msg">
                                  {responseError}
                                </p>
                              )}
                              {responseSuccessMsg && (
                                <p className="response-success-msg">
                                  {responseSuccessMsg}
                                </p>
                              )}
                            </form>
                          </div>
                        )}
                      </div>

                      {/* Responses grouped/filtered */}
                      <div className="debate-responses-section">
                        <div className="responses-header-row">
                          <h4 className="responses-section-title">
                            Community Responses (
                            {currentDebate.responses?.length || 0})
                          </h4>

                          {/* Filter Tabs */}
                          <div className="response-filter-tabs">
                            <button
                              type="button"
                              className={`rf-tab ${
                                currentResponseFilter === "all"
                                  ? "rf-tab--active"
                                  : ""
                              }`}
                              onClick={() => setCurrentResponseFilter("all")}
                            >
                              All ({currentDebate.responses?.length || 0})
                            </button>
                            <button
                              type="button"
                              className={`rf-tab ${
                                currentResponseFilter === "for"
                                  ? "rf-tab--active"
                                  : ""
                              }`}
                              onClick={() => setCurrentResponseFilter("for")}
                            >
                              For ({currentDebate.counts?.for || 0})
                            </button>
                            <button
                              type="button"
                              className={`rf-tab ${
                                currentResponseFilter === "against"
                                  ? "rf-tab--active"
                                  : ""
                              }`}
                              onClick={() => setCurrentResponseFilter("against")}
                            >
                              Against ({currentDebate.counts?.against || 0})
                            </button>
                            <button
                              type="button"
                              className={`rf-tab ${
                                currentResponseFilter === "neutral"
                                  ? "rf-tab--active"
                                  : ""
                              }`}
                              onClick={() => setCurrentResponseFilter("neutral")}
                            >
                              Neutral ({currentDebate.counts?.neutral || 0})
                            </button>
                          </div>
                        </div>

                        {/* Responses list */}
                        {getFilteredResponses(
                          currentDebate.responses,
                          currentResponseFilter
                        ).length === 0 ? (
                          <div className="no-responses-msg">
                            No responses in this stance group yet.
                          </div>
                        ) : (
                          <div className="responses-list">
                            {getFilteredResponses(
                              currentDebate.responses,
                              currentResponseFilter
                            ).map((r) => (
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
                    </article>
                  </section>
                )}

                {/* If there is no current debate at all */}
                {!currentDebate && (
                  <div className="no-current-banner">
                    There is currently no active debate for this week. Please
                    check back soon or explore previous debates below.
                  </div>
                )}

                {/* ═════════ 2. PREVIOUS DEBATES (ARCHIVED) ═════════ */}
                {filteredArchived.length > 0 && (
                  <section
                    className="previous-debates-section"
                    aria-label="Previous Debates"
                  >
                    <h3 className="previous-section-title font-serif">
                      Previous Debates
                    </h3>

                    <div className="archived-debates-list">
                      {filteredArchived.map((arch) => {
                        const archKey = arch.id || arch._id;
                        const isExpanded = Boolean(expandedDebates[archKey]);
                        const activeFilter =
                          archivedResponseFilters[archKey] || "all";
                        const filteredList = getFilteredResponses(
                          arch.responses,
                          activeFilter
                        );

                        return (
                          <article key={archKey} className="archived-debate-card">
                            <div className="arch-top-meta">
                              <span className="debate-cat-badge">
                                {arch.category}
                              </span>
                              <span className="arch-date">
                                {formatDate(arch.postedAt)}
                              </span>
                            </div>

                            <h4 className="arch-title font-serif">
                              {arch.title}
                            </h4>

                            <div className="arch-counts-row">
                              <span className="stance-count-pill stance-count-pill--for">
                                For: {arch.counts?.for || 0}
                              </span>
                              <span className="stance-count-pill stance-count-pill--against">
                                Against: {arch.counts?.against || 0}
                              </span>
                              <span className="stance-count-pill stance-count-pill--neutral">
                                Neutral: {arch.counts?.neutral || 0}
                              </span>
                            </div>

                            {/* Expand/Collapse Button */}
                            <button
                              type="button"
                              className="btn-toggle-expand"
                              onClick={() => toggleExpand(archKey)}
                            >
                              {isExpanded
                                ? "Hide Description & Responses ▲"
                                : "View Description & Responses ▼"}
                            </button>

                            {/* Expanded Read-Only Content */}
                            {isExpanded && (
                              <div className="archived-expanded-body">
                                <p className="arch-description">
                                  {arch.description}
                                </p>

                                <div className="arch-read-only-banner">
                                  <span>
                                    🔒 This debate is archived. Stance taking
                                    and new responses are closed.
                                  </span>
                                </div>

                                {/* Responses Filter Tabs */}
                                <div className="responses-header-row">
                                  <h5 className="arch-resp-title">
                                    All Responses ({arch.responses?.length || 0}
                                    )
                                  </h5>

                                  <div className="response-filter-tabs">
                                    <button
                                      type="button"
                                      className={`rf-tab ${
                                        activeFilter === "all"
                                          ? "rf-tab--active"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        setArchivedResponseFilters((prev) => ({
                                          ...prev,
                                          [archKey]: "all",
                                        }))
                                      }
                                    >
                                      All
                                    </button>
                                    <button
                                      type="button"
                                      className={`rf-tab ${
                                        activeFilter === "for"
                                          ? "rf-tab--active"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        setArchivedResponseFilters((prev) => ({
                                          ...prev,
                                          [archKey]: "for",
                                        }))
                                      }
                                    >
                                      For
                                    </button>
                                    <button
                                      type="button"
                                      className={`rf-tab ${
                                        activeFilter === "against"
                                          ? "rf-tab--active"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        setArchivedResponseFilters((prev) => ({
                                          ...prev,
                                          [archKey]: "against",
                                        }))
                                      }
                                    >
                                      Against
                                    </button>
                                    <button
                                      type="button"
                                      className={`rf-tab ${
                                        activeFilter === "neutral"
                                          ? "rf-tab--active"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        setArchivedResponseFilters((prev) => ({
                                          ...prev,
                                          [archKey]: "neutral",
                                        }))
                                      }
                                    >
                                      Neutral
                                    </button>
                                  </div>
                                </div>

                                {filteredList.length === 0 ? (
                                  <div className="no-responses-msg">
                                    No responses recorded in this stance group.
                                  </div>
                                ) : (
                                  <div className="responses-list">
                                    {filteredList.map((r) => (
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
                  </section>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Confirmation Dialog before locking stance */}
      <StanceModal
        isOpen={Boolean(pendingStance)}
        stance={pendingStance?.stance}
        onConfirm={handleConfirmStance}
        onCancel={() => setPendingStance(null)}
      />
    </div>
  );
};

export default Home;