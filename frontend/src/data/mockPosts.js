export const CATEGORIES = ["Political", "Local", "Global", "Educational", "Social"];

export const mockPosts = [
  {
    _id: "1",
    title: "Should college education be free?",
    category: "Educational",
    description:
      "With rising tuition costs, many argue higher education should be a public good funded by taxes rather than a personal loan burden. Others say it removes personal accountability and strains public budgets. Where do you stand?",
    author: { _id: "u1", fullName: "Aditi Sharma", username: "aditi_s" },
    likes: ["u2", "u3"],
    votesFor: ["u2", "u4", "u5"],
    votesAgainst: ["u3"],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "Our city needs better public transport",
    category: "Local",
    description:
      "Traffic congestion in Jaipur has gotten worse over the last two years. A dedicated metro expansion could ease this, but it needs city council backing. Should local government prioritize this over road widening projects?",
    author: { _id: "u2", fullName: "Rohan Verma", username: "rohanv" },
    likes: ["u1"],
    votesFor: ["u1", "u3"],
    votesAgainst: [],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: "3",
    title: "Is remote work here to stay globally?",
    category: "Global",
    description:
      "Post-pandemic, many companies pushed for return-to-office. But productivity data and employee satisfaction studies suggest hybrid models work better long-term. Is the return-to-office push a step backward?",
    author: { _id: "u3", fullName: "Emily Chen", username: "emily_c" },
    likes: ["u1", "u2", "u4"],
    votesFor: ["u1", "u2"],
    votesAgainst: ["u4", "u5"],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];