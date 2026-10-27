import { useState, useEffect, useMemo, useCallback } from "react";
import AppNavbar from "../components/AppNavbar";
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
 * Main User Dashboard displaying current active debate,
 * stance locking prompt, reasoned response submissions, and previous closed debates.
 * Fully styled according to SaySo's design system.
 *
 * @returns {JSX.Element} The rendered Home dashboard.
 */
const Home = () => {
  const { user } = useAuth();

  const [debates, setDebates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stance confirmation modal state
  const [pendingStance, setPendingStance] = useState(null); // { debateId, stance }
  const [userStances, setUserStances] = useState({});

  // Response form state for the current debate
  const [responseText, setResponseText] = useState("");
  const [responseError, setResponseError] = useState("");
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  const [responseSuccessMsg, setResponseSuccessMsg] = useState("");

  // Track expanded state of closed debates: { [debateId]: boolean }
  const [expandedDebates, setExpandedDebates] = useState({});

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

  // Separate current active debate and closed debates
  const currentDebate = useMemo(
    () => debates.find((d) => d.status === "current") || null,
    [debates]
  );

  const closedDebates = useMemo(
    () => debates.filter((d) => d.status !== "current"),
    [debates]
  );

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

  // Toggle expand for closed debate
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

  return (
    <div className="home">
      <AppNavbar />

      <div className="home-body" style={{ justifyContent: "center" }}>
        {/* Main Feed Centered */}
        <main className="home-feed" style={{ maxWidth: 780, margin: "0 auto", padding: "32px 24px 80px" }}>
          <div className="feed-inner">
            {/* Feed Header */}
            <div className="feed-header">
              <div className="feed-header-left">
                <h1 className="feed-title">Debates</h1>
                <span className="feed-count">
                  {debates.length} debate{debates.length !== 1 ? "s" : ""}
                </span>
              </div>
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
            ) : debates.length === 0 ? (
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
                <h4>No debates available</h4>
                <p>There are no debates posted yet. Please check back soon.</p>
              </div>
            ) : (
              <>
                {/* ═════════ 1. CURRENT ACTIVE DEBATE ═════════ */}
                {currentDebate && (
                  <section
                    className="current-debate-section"
                    aria-label="Current Active Debate"
                  >
                    <div className="section-eyebrow-row">
                      <span className="eyebrow-tag">ACTIVE TOPIC</span>
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

                      {/* Community Responses */}
                      <div className="debate-responses-section">
                        <div className="responses-header-row">
                          <h4 className="responses-section-title">
                            Community Responses (
                            {currentDebate.responses?.length || 0})
                          </h4>
                        </div>

                        {/* Responses list */}
                        {(!currentDebate.responses || currentDebate.responses.length === 0) ? (
                          <div className="no-responses-msg">
                            No responses posted yet. Be the first to share your perspective!
                          </div>
                        ) : (
                          <div className="responses-list">
                            {currentDebate.responses.map((r) => (
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
                    There is currently no active debate. Please check back soon or explore closed debates below.
                  </div>
                )}

                {/* ═════════ 2. CLOSED DEBATES ═════════ */}
                {closedDebates.length > 0 && (
                  <section
                    className="previous-debates-section"
                    aria-label="Closed Debates"
                  >
                    <h3 className="previous-section-title font-serif">
                      Closed Debates
                    </h3>

                    <div className="archived-debates-list">
                      {closedDebates.map((arch) => {
                        const archKey = arch.id || arch._id;
                        const isExpanded = Boolean(expandedDebates[archKey]);

                        return (
                          <article key={archKey} className="archived-debate-card">
                            <div className="arch-top-meta">
                              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                <span className="debate-cat-badge">
                                  {arch.category}
                                </span>
                                <span className="arch-status-pill">CLOSED</span>
                              </div>
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
                                : `View Description & Responses (${arch.responses?.length || 0}) ▼`}
                            </button>

                            {/* Expanded Read-Only Content */}
                            {isExpanded && (
                              <div className="archived-expanded-body">
                                <p className="arch-description">
                                  {arch.description}
                                </p>

                                <div className="arch-read-only-banner">
                                  <span>
                                    🔒 This debate is closed. Stance taking
                                    and new responses are closed.
                                  </span>
                                </div>

                                <div className="responses-header-row">
                                  <h5 className="arch-resp-title">
                                    All Responses ({arch.responses?.length || 0})
                                  </h5>
                                </div>

                                {(!arch.responses || arch.responses.length === 0) ? (
                                  <div className="no-responses-msg">
                                    No responses recorded for this debate.
                                  </div>
                                ) : (
                                  <div className="responses-list">
                                    {arch.responses.map((r) => (
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