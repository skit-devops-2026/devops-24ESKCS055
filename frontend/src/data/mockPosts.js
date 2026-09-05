export const CATEGORIES = [
  "Law & Justice",
  "Politics & Governance",
  "Society & Culture",
  "Education",
  "Environment",
  "Economy & Business",
  "Technology & AI",
  "Health",
  "Current Affairs",
  "Lifestyle",
];

export const mockPosts = [
  {
    _id: "1",
    title: "Should college education be free for everyone?",
    category: "Education",
    description:
      "With rising tuition costs, many argue that higher education should be a public good funded by taxes rather than a personal loan burden. Others say free education removes personal accountability and strains public budgets. Where do you stand, and why?",
    author: { _id: "u1", fullName: "Aditi Sharma", username: "aditi_s" },
    likes: ["u2", "u3"],
    votesFor: ["u2", "u4", "u5"],
    votesAgainst: ["u3"],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "Our cities desperately need better public transport",
    category: "Society & Culture",
    description:
      "Traffic congestion in major cities has worsened significantly. A dedicated metro expansion or improved bus networks could ease this — but it needs government backing and public funding. Is this the right priority, or should resources go elsewhere?",
    author: { _id: "u2", fullName: "Rohan Verma", username: "rohanv" },
    likes: ["u1"],
    votesFor: ["u1", "u3"],
    votesAgainst: [],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: "3",
    title: "Is remote work here to stay globally?",
    category: "Economy & Business",
    description:
      "Post-pandemic, many companies pushed for return-to-office. But productivity data and employee satisfaction studies suggest hybrid models work better long-term. Is the return-to-office push a step backward for modern work culture?",
    author: { _id: "u3", fullName: "Emily Chen", username: "emily_c" },
    likes: ["u1", "u2", "u4"],
    votesFor: ["u1", "u2"],
    votesAgainst: ["u4", "u5"],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    _id: "4",
    title: "Should AI-generated content be labelled by law?",
    category: "Technology & AI",
    description:
      "As AI tools produce more text, images, and video, there are growing calls for mandatory disclosure. Should governments require all AI-generated content to carry a visible label — or does that infringe on creative freedom and make enforcement impractical?",
    author: { _id: "u4", fullName: "Samir Joshi", username: "samir_j" },
    likes: ["u1"],
    votesFor: ["u1", "u3"],
    votesAgainst: ["u2"],
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    _id: "5",
    title: "Should the voting age be lowered to 16?",
    category: "Politics & Governance",
    description:
      "16-year-olds pay taxes, drive, and are directly affected by government policies — yet they cannot vote. Some countries have experimented with lowering the voting age. Is this a democratic necessity, or does it risk uninformed participation?",
    author: { _id: "u5", fullName: "Priya Kapoor", username: "priya_k" },
    likes: ["u2", "u4"],
    votesFor: ["u2"],
    votesAgainst: ["u4", "u5"],
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
];