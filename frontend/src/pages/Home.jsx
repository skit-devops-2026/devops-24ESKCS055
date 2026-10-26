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
 * Main User Dashboard displaying current active weekly debate,
 * stance locking prompt, response submissions, and previous archived debates.
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

  // Track expanded state of archived debates: { [debateId]: boolean }
  const [expandedDebates, setExpandedDebates] = useState({});

  // Load debates from service
  const fetchDebates = useCallback(async () => {
    try {
      const data = await getDebates();
      setDebates(data);

      if (user?._id) {
        const stancesMap = {};
        data.forEach((d) => {
          const st = getStance(user._id, d.id || d._id);
          if (st) stancesMap[d.id || d._id] = st;
        });
        setUserStances(stancesMap);

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

  // Stance selection trigger
  const handleSelectStance = (stance) => {
    if (!currentDebate) return;
    setPendingStance({ debateId: currentDebate.id || currentDebate._id, stance });
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

  // Post or edit response
  const handlePostResponse = async (e) => {
    e.preventDefault();
    setResponseError("");
    setResponseSuccessMsg("");

    const text = responseText.trim();
    if (!text) {
      setResponseError("Please enter your reasoned response.");
      return;
    }
    if (text.length > 1000) {
      setResponseError("Response must be 1000 characters or fewer.");
      return;
    }

    const debateKey = currentDebate.id || currentDebate._id;
    const lockedStance = userStances[debateKey];
    if (!lockedStance) {
      setResponseError("You must choose and lock your stance before posting.");
      return;
    }

    try {
      setIsSubmittingResponse(true);
      await postResponse({
        debateId: debateKey,
        userId: user._id,
        username: user.username,
        stance: lockedStance,
        text,
      });

      setResponseSuccessMsg("Your response has been published successfully!");
      await fetchDebates();
    } catch (err) {
      setResponseError(err.message || "Failed to submit response.");
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  // Toggle accordion expand for archived debates
  const toggleExpand = (id) => {
    setExpandedDebates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Format date helper
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
            {loading ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "var(--color-muted)" }}>
                Loading debates…
              </div>
            ) : debates.length === 0 ? (
              <div className="empty-state">
                <h4>No debates available</h4>
                <p>There are no active debates at the moment. Please check back soon.</p>
              </div>
            ) : (
              <>
                {/* ═════════ 1. THIS WEEK'S DEBATE (TOP) ═════════ */}
                {currentDebate && (
                  <section className="current-debate-section" aria-label="This Week's Debate">
                    <div className="section-eyebrow-row">
                      <span className="eyebrow-tag">THIS WEEK'S TOPIC</span>
                      <span className="eyebrow-date">{formatDate(currentDebate.postedAt)}</span>
                    </div>

                    <article className="current-debate-card">
                      <div className="debate-meta-top">
                        <span className="debate-cat-badge">{currentDebate.category}</span>
                        <span className="active-status-badge">CURRENT</span>
                      </div>

                      <h2 className="current-debate-title font-serif">{currentDebate.title}</h2>
                      <p className="current-debate-desc">{currentDebate.description}</p>

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
                          <div className="stance-select-prompt">
                            <p className="srb-instruction">
                              Choose your stance before responding. Once confirmed, your stance is permanently locked for this debate.
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
                          <div className="stance-locked-container">
                            <div className="stance-locked-banner">
                              <span>Your stance is locked:</span>
                              <strong
                                className={`locked-badge locked-badge--${userStances[currentDebate.id || currentDebate._id]}`}
                              >
                                {userStances[currentDebate.id || currentDebate._id] === "for"
                                  ? "For"
                                  : userStances[currentDebate.id || currentDebate._id] === "against"
                                  ? "Against"
                                  : "Neutral"}
                              </strong>
                              <span className="locked-note">(Cannot be changed for this debate)</span>
                            </div>

                            {/* Response submission / edit form */}
                            <form onSubmit={handlePostResponse} className="response-form">
                              <label className="response-form-label">
                                {currentDebate.responses?.some((r) => r.userId === user._id)
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
                                    1000 - responseText.length < 50 ? "char-counter--warn" : ""
                                  }`}
                                >
                                  {1000 - responseText.length} characters remaining
                                </span>

                                <button
                                  type="submit"
                                  className="btn-submit-response"
                                  disabled={isSubmittingResponse || !responseText.trim()}
                                >
                                  {isSubmittingResponse
                                    ? "Saving…"
                                    : currentDebate.responses?.some((r) => r.userId === user._id)
                                    ? "Update Response"
                                    : "Post Response"}
                                </button>
                              </div>

                              {responseError && (
                                <p className="response-error-msg">{responseError}</p>
                              )}
                              {responseSuccessMsg && (
                                <p className="response-success-msg">{responseSuccessMsg}</p>
                              )}
                            </form>
                          </div>
                        )}
                      </div>

                      {/* Responses section without filter tabs */}
                      <div className="debate-responses-section">
                        <div className="responses-header-row">
                          <h4 className="responses-section-title">
                            Community Responses ({currentDebate.responses?.length || 0})
                          </h4>
                        </div>

                        {(!currentDebate.responses || currentDebate.responses.length === 0) ? (
                          <div className="no-responses-msg">
                            No responses yet. Be the first to share your position!
                          </div>
                        ) : (
                          <div className="responses-list">
                            {currentDebate.responses.map((r) => (
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
                    </article>
                  </section>
                )}

                {/* ═════════ 2. PREVIOUS DEBATES (ARCHIVED) ═════════ */}
                {archivedDebates.length > 0 && (
                  <section className="previous-debates-section" aria-label="Previous Debates">
                    <h3 className="previous-section-title font-serif">Previous Debates</h3>

                    <div className="archived-debates-list">
                      {archivedDebates.map((arch) => {
                        const isExpanded = Boolean(expandedDebates[arch.id || arch._id]);

                        return (
                          <article key={arch.id || arch._id} className="archived-debate-card">
                            <div className="arch-top-meta">
                              <span className="debate-cat-badge">{arch.category}</span>
                              <span className="arch-date">{formatDate(arch.postedAt)}</span>
                            </div>

                            <h4 className="arch-title font-serif">{arch.title}</h4>

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
                              <span className="stance-count-pill stance-count-pill--total">
                                Total: {arch.counts?.total || 0}
                              </span>
                            </div>

                            <button
                              type="button"
                              className="btn-toggle-expand"
                              onClick={() => toggleExpand(arch.id || arch._id)}
                            >
                              {isExpanded ? "Hide Description & Responses ▲" : "View Description & Responses ▼"}
                            </button>

                            {/* Expanded Read-Only Content */}
                            {isExpanded && (
                              <div className="archived-expanded-body">
                                <p className="arch-description">{arch.description}</p>

                                <div className="arch-read-only-banner">
                                  <span>🔒 This debate is archived. Stance taking and new responses are closed.</span>
                                </div>

                                <div className="responses-header-row">
                                  <h5 className="arch-resp-title">
                                    Responses ({arch.responses?.length || 0})
                                  </h5>
                                </div>

                                {(!arch.responses || arch.responses.length === 0) ? (
                                  <div className="no-responses-msg">
                                    No responses recorded for this debate.
                                  </div>
                                ) : (
                                  <div className="responses-list">
                                    {arch.responses.map((r) => (
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
                  </section>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {pendingStance && (
        <StanceModal
          stance={pendingStance.stance}
          onConfirm={handleConfirmStance}
          onCancel={() => setPendingStance(null)}
        />
      )}
    </>
  );
};

export default Home;