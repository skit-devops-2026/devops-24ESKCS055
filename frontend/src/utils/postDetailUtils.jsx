export /* ── Seed opinions so For/Against panels feel alive ── */
const SEED_OPINIONS = {
  "1": {
    for: [
      { id: 1, author: "Rohan V.", time: "2h ago",  text: "Education is a fundamental right. Every country that invests in free higher education sees a long-term boost to its economy and social mobility. The debt burden on students today is an injustice." },
      { id: 2, author: "Sneha P.", time: "5h ago",  text: "Public universities in Germany are essentially free and produce world-class graduates. The idea that quality disappears without fees is a myth — it depends on government investment, not student tuition." },
    ],
    against: [
      { id: 3, author: "Arjun M.", time: "3h ago",  text: "Free for whom? Taxpayers fund it, including people who never attended college. It is a wealth transfer from the less educated to the more educated. A targeted scholarship system is fairer." },
      { id: 4, author: "Priya K.", time: "6h ago",  text: "When education is free, universities lose the incentive to improve. Competition and accountability require that institutions depend on satisfied students — not just guaranteed government cheques." },
    ],
  },
  "2": {
    for: [
      { id: 1, author: "Aditi S.", time: "1h ago",  text: "City dwellers spend over 2 hours daily in traffic. A functioning metro system would not only reduce pollution but give people back hundreds of hours a year. This is a quality-of-life issue." },
    ],
    against: [
      { id: 2, author: "Rahul G.", time: "4h ago",  text: "Public transport projects in India have repeatedly gone over budget and underserved the actual commuter population. Before building more infrastructure, we need to fix what already exists." },
    ],
  },
};

export const getSeeded = (postId) =>
  SEED_OPINIONS[postId] || { for: [], against: [] };

export const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

import React from "react";

export const OpinionCard = ({ opinion, side }) => (
  <div className={`opinion-card opinion-card--${side}`}>
    <div className="oc-header">
      <div className="oc-avatar">{opinion.author.charAt(0)}</div>
      <div>
        <span className="oc-author">{opinion.author}</span>
        <span className="oc-time">{opinion.time}</span>
      </div>
    </div>
    <p className="oc-text">{opinion.text}</p>
  </div>
);

