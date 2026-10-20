// TEMPORARY: replace with Express API + MongoDB

import { CATEGORIES } from "../data/mockPosts";

export { CATEGORIES };

// Initial hardcoded seed accounts
export const INITIAL_USERS = [
  {
    _id: "admin_01",
    fullName: "Platform Administrator",
    username: "admin",
    password: "123456",
    email: "admin@sayso.org",
    role: "admin",
    bio: "Editorial curator and platform administrator.",
  },
  {
    _id: "user_01",
    fullName: "Elena Vane",
    username: "user",
    password: "123456",
    email: "elena@sayso.org",
    role: "user",
    bio: "Civic debates and urban infrastructure enthusiast.",
  },
];

// Initial seed debates: 1 current and 4 archived
export const INITIAL_DEBATES = [
  {
    id: "deb-curr-1",
    title: "Should cities ban personal motor vehicles from their central districts?",
    description:
      "Urban congestion, air pollution, and pedestrian safety have driven multiple metropolitan areas to pilot vehicle-free zones. Proponents highlight cleaner air, revitalized street life, and faster public transit. Critics warn of economic friction for small retail businesses, accessibility challenges for elderly or disabled residents, and displacement of traffic to outer residential borders.",
    category: "Society & Culture",
    postedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    status: "current",
  },
  {
    id: "deb-arch-1",
    title: "Should governments mandate AI transparency and watermarking for all public models?",
    description:
      "As generative AI becomes ubiquitous in media and administration, transparency legislation has been proposed to require visible provenance and training watermarks. Advocates argue this safeguards democratic discourse against synthetic disinformation. Detractors claim watermarks can be trivially stripped and heavy compliance slows down open-source innovation.",
    category: "Technology & AI",
    postedAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
    status: "archived",
  },
  {
    id: "deb-arch-2",
    title: "Should higher education institutions eliminate standardized testing in admissions?",
    description:
      "Decades of standardized test usage in university admissions face growing scrutiny regarding demographic parity and predictive validity. Supporters of test-optional models emphasize holistic candidate review, whereas defenders maintain that standardized metrics remain the only objective safeguard against high school grade inflation.",
    category: "Education",
    postedAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
    status: "archived",
  },
  {
    id: "deb-arch-3",
    title: "Is carbon pricing the most effective policy tool to combat climate change?",
    description:
      "Economists widely promote carbon taxes and cap-and-trade systems to internalize environmental externalities. Opponents argue that carbon taxation creates regressive cost burdens on low-income households and that direct green infrastructure subsidies yield faster technological transitions.",
    category: "Environment",
    postedAt: new Date(Date.now() - 22 * 24 * 3600 * 1000).toISOString(),
    status: "archived",
  },
  {
    id: "deb-arch-4",
    title: "Should remote workers be subject to localized salary adjustments?",
    description:
      "Global distributed teams have sparked intense debate over whether compensation should reflect the employee's local cost of living or solely the market value of their output regardless of geographical location.",
    category: "Economy & Business",
    postedAt: new Date(Date.now() - 29 * 24 * 3600 * 1000).toISOString(),
    status: "archived",
  },
];

// Seed responses across For, Against, and Neutral
export const INITIAL_RESPONSES = [
  // Responses for Current Debate (deb-curr-1)
  {
    id: "resp-101",
    debateId: "deb-curr-1",
    userId: "u-marcus",
    username: "marcus_k",
    stance: "for",
    text: "Pontevedra in Spain pedestrianized its center in 1999: pedestrian fatalities dropped to zero, local commercial revenues increased by 30%, and CO2 emissions plummeted. Central districts are meant for human civic exchange, not two-ton private metal boxes.",
    createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
  },
  {
    id: "resp-102",
    debateId: "deb-curr-1",
    userId: "u-clara",
    username: "clara_transit",
    stance: "for",
    text: "Public buses and emergency vehicles move exponentially faster when personal cars are removed. Dedicated transit rights-of-way make cities equitable for non-drivers who comprise the majority of urban commuters.",
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
  },
  {
    id: "resp-103",
    debateId: "deb-curr-1",
    userId: "u-dave",
    username: "dave_mercantile",
    stance: "against",
    text: "A blanket ban punishes independent artisans, elderly residents with reduced mobility, and parents transporting young children. Outer ring roads inevitably bear the brunt with horrific bottleneck congestion.",
    createdAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
  },
  {
    id: "resp-104",
    debateId: "deb-curr-1",
    userId: "u-rachel",
    username: "rachel_econ",
    stance: "against",
    text: "Without first building massive park-and-ride facilities on suburban peripheries, a sudden car ban damages core retail vitality and pushes shoppers to suburban big-box malls.",
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
  },
  {
    id: "resp-105",
    debateId: "deb-curr-1",
    userId: "u-tarun",
    username: "tarun_planner",
    stance: "neutral",
    text: "The answer isn't a blunt total ban versus car-dominated status quo. Dynamic congestion pricing paired with strict EV micro-mobility delivery windows yields the environmental benefit without alienating logistics or mobility-impaired residents.",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },

  // Responses for Archived Debate 1 (deb-arch-1)
  {
    id: "resp-201",
    debateId: "deb-arch-1",
    userId: "u-siddharth",
    username: "siddharth_code",
    stance: "for",
    text: "Cryptographic provenance standards like C2PA provide essential audit trails for journalistic integrity and democratic elections.",
    createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "resp-202",
    debateId: "deb-arch-1",
    userId: "u-lucas",
    username: "lucas_dev",
    stance: "against",
    text: "Open-source model weights can have watermarking layers pruned in minutes. Mandatory compliance creates regulatory moats for big tech while criminalizing open academic research.",
    createdAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "resp-203",
    debateId: "deb-arch-1",
    userId: "u-amina",
    username: "amina_policy",
    stance: "neutral",
    text: "Watermarking is valuable for consumer chatbot outputs, but ineffective for adversarial actors. Technical standards must be paired with liability laws rather than technical mandates alone.",
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
  },

  // Responses for Archived Debate 2 (deb-arch-2)
  {
    id: "resp-301",
    debateId: "deb-arch-2",
    userId: "u-hannah",
    username: "hannah_edu",
    stance: "for",
    text: "Standardized tests measure wealth and access to expensive test-prep tutors more than raw cognitive resilience or creativity.",
    createdAt: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "resp-302",
    debateId: "deb-arch-2",
    userId: "u-vikram",
    username: "vikram_prof",
    stance: "against",
    text: "Without SAT/ACT benchmarks, top universities default to subjective essays and extracurriculars that favor elite private schools with dedicated college counselors.",
    createdAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "resp-303",
    debateId: "deb-arch-2",
    userId: "u-nathan",
    username: "nathan_stat",
    stance: "neutral",
    text: "Use test scores strictly as positive context for under-resourced schools, rather than mandatory cutoff scores for every applicant.",
    createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
  },

  // Responses for Archived Debate 3 (deb-arch-3)
  {
    id: "resp-401",
    debateId: "deb-arch-3",
    userId: "u-priya",
    username: "priya_green",
    stance: "for",
    text: "A carbon dividend that returns revenue directly to citizens as a monthly check offsets regressive effects while steadily pricing polluters out of the market.",
    createdAt: new Date(Date.now() - 21 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "resp-402",
    debateId: "deb-arch-3",
    userId: "u-artur",
    username: "artur_grid",
    stance: "against",
    text: "Targeted sector regulations, clean energy grid subsidies, and battery manufacturing grants deploy clean capacity much faster than price signals.",
    createdAt: new Date(Date.now() - 19 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "resp-403",
    debateId: "deb-arch-3",
    userId: "u-sophie",
    username: "sophie_eu",
    stance: "neutral",
    text: "Both mechanisms are vital: carbon pricing creates long-term baseline disincentives, but targeted industrial policy is needed to finance early capital-intensive R&D.",
    createdAt: new Date(Date.now() - 18 * 24 * 3600 * 1000).toISOString(),
  },

  // Responses for Archived Debate 4 (deb-arch-4)
  {
    id: "resp-501",
    debateId: "deb-arch-4",
    userId: "u-sam",
    username: "sam_nomad",
    stance: "for",
    text: "Paying identical rates regardless of location creates vast inequities where a senior engineer in a low-cost country effectively earns triple the local executive purchasing power.",
    createdAt: new Date(Date.now() - 28 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "resp-502",
    debateId: "deb-arch-4",
    userId: "u-kai",
    username: "kai_software",
    stance: "against",
    text: "Compensation pays for code output and system impact, not the price of rent in the employee's neighborhood. Location-based cuts incentivize pay discrimination.",
    createdAt: new Date(Date.now() - 26 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "resp-503",
    debateId: "deb-arch-4",
    userId: "u-maya",
    username: "maya_hr",
    stance: "neutral",
    text: "Tiered regional bands (e.g., Tier 1, 2, 3 by metropolitan index) offer a pragmatic compromise between pure global flat pay and intrusive city-level micromanagement.",
    createdAt: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
  },
];

// In-memory state store with localStorage caching for persistence across refreshes
const STORAGE_KEYS = {
  USERS: "sayso_mock_users_v2",
  DEBATES: "sayso_mock_debates_v2",
  RESPONSES: "sayso_mock_responses_v2",
  STANCES: "sayso_mock_stances_v2", // map of `${userId}_${debateId}` -> "for" | "against" | "neutral"
};

const loadState = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return fallback;
};

const saveState = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
};

let usersStore = loadState(STORAGE_KEYS.USERS, INITIAL_USERS);
let debatesStore = loadState(STORAGE_KEYS.DEBATES, INITIAL_DEBATES);
let responsesStore = loadState(STORAGE_KEYS.RESPONSES, INITIAL_RESPONSES);
let stancesStore = loadState(STORAGE_KEYS.STANCES, {});

// ══════════════ WRAPPER SERVICE FUNCTIONS ══════════════

/**
 * Mock login service
 */
export const login = async ({ username, password }) => {
  const cleanUser = username?.trim().toLowerCase();
  const found = usersStore.find(
    (u) => u.username.toLowerCase() === cleanUser && u.password === password
  );
  if (!found) {
    throw new Error("Username or password is incorrect");
  }
  const sessionUser = {
    _id: found._id,
    fullName: found.fullName,
    username: found.username,
    email: found.email,
    role: found.role,
    bio: found.bio || "",
  };
  return sessionUser;
};

/**
 * Mock signup service
 */
export const signup = async ({ fullName, username, email, password }) => {
  const cleanUsername = username?.trim();
  const lowerUsername = cleanUsername?.toLowerCase();

  // Validate reserved 'admin' username
  if (lowerUsername === "admin") {
    throw new Error("Username 'admin' is reserved. Please choose a different username.");
  }

  // Validate duplicate username
  const exists = usersStore.some((u) => u.username.toLowerCase() === lowerUsername);
  if (exists) {
    throw new Error("This username is already taken. Please choose another.");
  }

  const newUser = {
    _id: `user_${Date.now()}`,
    fullName: fullName.trim(),
    username: cleanUsername,
    email: email.trim(),
    password: password,
    role: "user",
    bio: "",
  };

  usersStore = [...usersStore, newUser];
  saveState(STORAGE_KEYS.USERS, usersStore);

  const sessionUser = {
    _id: newUser._id,
    fullName: newUser.fullName,
    username: newUser.username,
    email: newUser.email,
    role: newUser.role,
    bio: "",
  };
  return sessionUser;
};

/**
 * Get all debates (with responses attached)
 */
export const getDebates = async () => {
  // Sort: current first, then archived newest first
  const sorted = [...debatesStore].sort((a, b) => {
    if (a.status === "current" && b.status !== "current") return -1;
    if (b.status === "current" && a.status !== "current") return 1;
    return new Date(b.postedAt) - new Date(a.postedAt);
  });

  return sorted.map((deb) => {
    const responses = responsesStore.filter((r) => r.debateId === deb.id);
    return {
      ...deb,
      responses,
      counts: {
        for: responses.filter((r) => r.stance === "for").length,
        against: responses.filter((r) => r.stance === "against").length,
        neutral: responses.filter((r) => r.stance === "neutral").length,
        total: responses.length,
      },
    };
  });
};

/**
 * Post new debate (admin only)
 * On publish: new debate becomes "current", previous becomes "archived"
 */
export const postDebate = async ({ title, description, category }) => {
  const cleanTitle = title?.trim();
  const cleanDesc = description?.trim();
  const cleanCat = category?.trim();

  if (!cleanTitle) throw new Error("Debate title is required.");
  if (!cleanDesc) throw new Error("Debate description is required.");
  if (!cleanCat) throw new Error("Debate category is required.");

  // Archive any existing current debate
  debatesStore = debatesStore.map((d) =>
    d.status === "current" ? { ...d, status: "archived" } : d
  );

  const newDebate = {
    id: `deb-${Date.now()}`,
    title: cleanTitle,
    description: cleanDesc,
    category: cleanCat,
    postedAt: new Date().toISOString(),
    status: "current",
  };

  debatesStore = [newDebate, ...debatesStore];
  saveState(STORAGE_KEYS.DEBATES, debatesStore);

  return newDebate;
};

/**
 * Get user stance for debate
 */
export const getStance = (userId, debateId) => {
  if (!userId || !debateId) return null;
  return stancesStore[`${userId}_${debateId}`] || null;
};

/**
 * Set and lock stance for a debate
 */
export const setStance = async ({ debateId, userId, stance }) => {
  if (!debateId || !userId || !stance) {
    throw new Error("Missing parameters to record stance.");
  }
  const key = `${userId}_${debateId}`;
  if (stancesStore[key]) {
    return stancesStore[key]; // Stance is permanently locked
  }
  stancesStore = { ...stancesStore, [key]: stance };
  saveState(STORAGE_KEYS.STANCES, stancesStore);
  return stance;
};

/**
 * Post or edit user's response to debate
 */
export const postResponse = async ({ debateId, userId, username, stance, text }) => {
  const cleanText = text?.trim();
  if (!cleanText) {
    throw new Error("Response cannot be empty or whitespace-only.");
  }
  if (cleanText.length > 1000) {
    throw new Error("Response exceeds maximum length of 1000 characters.");
  }

  // Ensure stance is recorded
  const key = `${userId}_${debateId}`;
  const lockedStance = stancesStore[key] || stance;
  if (!lockedStance) {
    throw new Error("You must choose a stance before posting a response.");
  }

  // Check if response already exists for user on this debate
  const existingIndex = responsesStore.findIndex(
    (r) => r.debateId === debateId && r.userId === userId
  );

  let updatedResponse;
  if (existingIndex >= 0) {
    // Edit response text (never stance)
    updatedResponse = {
      ...responsesStore[existingIndex],
      text: cleanText,
      updatedAt: new Date().toISOString(),
    };
    responsesStore = [
      ...responsesStore.slice(0, existingIndex),
      updatedResponse,
      ...responsesStore.slice(existingIndex + 1),
    ];
  } else {
    // Create new response
    updatedResponse = {
      id: `resp-${Date.now()}`,
      debateId,
      userId,
      username,
      stance: lockedStance,
      text: cleanText,
      createdAt: new Date().toISOString(),
    };
    responsesStore = [updatedResponse, ...responsesStore];
  }

  saveState(STORAGE_KEYS.RESPONSES, responsesStore);
  return updatedResponse;
};

/**
 * Update user profile (Name and Email only)
 */
export const updateProfile = async ({ userId, fullName, email }) => {
  const cleanName = fullName?.trim();
  const cleanEmail = email?.trim();

  if (!cleanName) throw new Error("Full name cannot be empty.");
  if (!cleanEmail) throw new Error("Email address cannot be empty.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw new Error("Please enter a valid email address.");
  }

  const userIndex = usersStore.findIndex((u) => u._id === userId);
  if (userIndex < 0) throw new Error("User account not found.");

  usersStore[userIndex] = {
    ...usersStore[userIndex],
    fullName: cleanName,
    email: cleanEmail,
  };
  saveState(STORAGE_KEYS.USERS, usersStore);

  const updatedUser = {
    _id: usersStore[userIndex]._id,
    fullName: usersStore[userIndex].fullName,
    username: usersStore[userIndex].username,
    email: usersStore[userIndex].email,
    role: usersStore[userIndex].role,
    bio: usersStore[userIndex].bio || "",
  };
  return updatedUser;
};
