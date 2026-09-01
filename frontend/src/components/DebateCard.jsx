import React, { useState } from "react";

const DebateCard = ({ debate, size = "full" }) => {
  const [tab, setTab] = useState("for");
  const againstPct = 100 - debate.forPct;

  return (
    <div className={`dc ${size === "small" ? "dc--small" : ""}`}>
      <div className="dc-top">
        <span className="dc-cat" style={{ background: debate.catBg, color: debate.catColor }}>
          {debate.category}
        </span>
        {size === "full" && (
          <span className="dc-author">by {debate.author}</span>
        )}
      </div>

      <h4 className="dc-title">{debate.title}</h4>

      {/* Opinion toggle */}
      <div className="dc-tabs">
        <button
          className={`dc-tab dc-tab--for ${tab === "for" ? "dc-tab--active-for" : ""}`}
          onClick={() => setTab("for")}
        >
          For
        </button>
        <button
          className={`dc-tab dc-tab--against ${tab === "against" ? "dc-tab--active-against" : ""}`}
          onClick={() => setTab("against")}
        >
          Against
        </button>
      </div>

      <div className={`dc-opinion ${tab === "for" ? "dc-opinion--for" : "dc-opinion--against"}`}>
        <span className="dc-opinion-quote">"</span>
        {tab === "for" ? debate.forOpinion : debate.againstOpinion}
      </div>

      {/* Vote bar */}
      <div className="dc-bar-wrap">
        <div className="dc-bar">
          <div className="dc-bar-for" style={{ width: `${debate.forPct}%` }} />
        </div>
        <div className="dc-bar-labels">
          <span className="dcbl-for">For {debate.forPct}%</span>
          <span className="dcbl-against">Against {againstPct}%</span>
        </div>
      </div>
    </div>
  );
};

export default DebateCard;
