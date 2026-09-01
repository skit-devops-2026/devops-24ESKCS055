import React from "react";

/* ── Debate card data — shows user opinions, not vote tallies ── */
export const FEATURED_DEBATE = {
  category: "Politics & Governance",
  catColor: "#5B6FA6",
  catBg: "rgba(91,111,166,0.12)",
  title: "Should reservation policies be based on economic status instead of caste?",
  author: "Aditi Sharma",
  forOpinion: "Economic backwardness is the real barrier today. A poor upper-caste student suffers as much as a poor lower-caste one. Shifting to income-based reservation would be more just and reduce social division.",
  againstOpinion: "Caste discrimination is not just about income — it is about centuries of systemic exclusion. Economic criteria alone cannot address the structural disadvantage that caste creates in education and employment.",
  forPct: 54,
  totalVotes: 3210,
};

export const SIDE_DEBATES = [
  {
    category: "Society & Culture",
    catColor: "#8B6F47",
    catBg: "rgba(139,111,71,0.12)",
    title: "Should India conduct a nationwide caste census?",
    forOpinion: "Accurate data is the foundation of good policy. Without knowing the real population share of each caste group, welfare schemes are designed on assumptions rather than facts.",
    againstOpinion: "A caste census will deepen caste identities at the very moment we should be moving beyond them. It risks fuelling political exploitation rather than addressing genuine backwardness.",
    forPct: 61,
  },
  {
    category: "Politics & Governance",
    catColor: "#5B6FA6",
    catBg: "rgba(91,111,166,0.12)",
    title: "Should political parties be allowed to make promises that significantly increase government spending?",
    forOpinion: "In a democracy, parties must be accountable to voters through promises. Restricting what they can offer limits political freedom and ultimately disenfranchises citizens.",
    againstOpinion: "Freebies funded by debt burden future generations. An independent fiscal authority should assess whether election promises are economically viable before they are made.",
    forPct: 43,
  },
];

export const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: "Post Your Take",
    desc: "Write about any issue — local, political, global, or social. Every voice deserves to be heard.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <path d="M3 6h18M3 12h18M3 18h18" />
        <circle cx="19" cy="6" r="2" fill="currentColor" />
        <circle cx="5" cy="18" r="2" fill="currentColor" />
      </svg>
    ),
    title: "Share Your Opinion",
    desc: "Don't just vote — write your For or Against reasoning. Your words shape the debate.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
    title: "Discover Perspectives",
    desc: "See how people across backgrounds think about the same issue. Insight, not noise.",
  },
];

export const STEPS = [
  { num: "01", title: "Create your account", desc: "Sign up in under a minute. No lengthy verification, no waiting." },
  { num: "02", title: "Browse or start a debate", desc: "Find a topic that matters to you, or raise a new one yourself." },
  { num: "03", title: "Write your For or Against", desc: "Give your actual opinion — not just a thumbs up. Make it count." },
];



