import React from "react";

const VoteBar = ({ votesFor, votesAgainst, onVote }) => {
  const total = votesFor + votesAgainst || 1;
  const forPct = Math.round((votesFor / total) * 100);

  return (
    <>
      <div className="vote-bar-wrap">
        <div className="vote-bar">
          <div className="vote-bar-for" style={{ width: `${forPct}%` }} />
        </div>
        <div className="vote-buttons">
          <button className="btn vote-for" onClick={() => onVote("for")}>
            For ({votesFor})
          </button>
          <button className="btn vote-against" onClick={() => onVote("against")}>
            Against ({votesAgainst})
          </button>
        </div>
      </div>

      <style>{`
        .vote-bar-wrap { margin: 20px 0; }

        .vote-bar {
          height: 10px;
          border-radius: 6px;
          background: var(--color-against);
          overflow: hidden;
          margin-bottom: 14px;
        }

        .vote-bar-for { height: 100%; background: var(--color-for); }

        .vote-buttons { display: flex; gap: 12px; }

        .vote-for {
          background: var(--color-for);
          color: #fff;
          flex: 1;
        }
        .vote-against {
          background: var(--color-against);
          color: #fff;
          flex: 1;
        }
      `}</style>
    </>
  );
};

export default VoteBar;