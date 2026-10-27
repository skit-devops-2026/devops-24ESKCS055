import api from "../api/axios";
import { CATEGORIES } from "../data/mockPosts";

export { CATEGORIES };

const STANCE_CACHE_PREFIX = "sayso_user_stances_";
const DEBATES_STORAGE_KEY = "sayso_local_debates";

/**
 * Initial fallback debates when backend API is unreachable (e.g. static hosting on GitHub Pages).
 */
const DEFAULT_FALLBACK_DEBATES = [
  {
    id: "deb-1",
    _id: "deb-1",
    title: "Should governments mandate AI transparency and watermarking for all public models?",
    description:
      "As generative AI becomes ubiquitous in media and administration, transparency legislation has been proposed to require visible provenance and training watermarks. Advocates argue this safeguards democratic discourse against synthetic disinformation. Detractors claim watermarks can be trivially stripped and heavy compliance slows down open-source innovation.",
    category: "Technology & AI",
    status: "current",
    postedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    responses: [
      {
        id: "r1",
        _id: "r1",
        userId: "u2",
        username: "aditi_s",
        stance: "for",
        text: "Without cryptographic watermarking or provenance headers, automated astroturfing and election fraud will overwhelm civic spaces. We regulate food labels and pharmaceuticals; synthetic information deserves equal disclosure.",
        createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
      },
      {
        id: "r2",
        _id: "r2",
        userId: "u3",
        username: "samir_j",
        stance: "against",
        text: "Enforcement is a technical illusion. Anyone running local weights or quantization scripts can bypass watermarks in 3 lines of code. This only burdens ethical domestic developers while rogue actors proceed unchecked.",
        createdAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
      },
    ],
    counts: { for: 1, against: 1, neutral: 0, total: 2 },
  },
  {
    id: "deb-2",
    _id: "deb-2",
    title: "Should higher education institutions eliminate standardized testing in admissions?",
    description:
      "Decades of standardized test usage in university admissions face growing scrutiny regarding demographic parity and predictive validity. Supporters of test-optional models emphasize holistic candidate review, whereas defenders maintain that standardized metrics remain the only objective safeguard against high school grade inflation.",
    category: "Education",
    status: "closed",
    postedAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
    responses: [
      {
        id: "r3",
        _id: "r3",
        userId: "u1",
        username: "rohanv",
        stance: "neutral",
        text: "Tests measure preparation and tutoring resources as much as innate ability, but grade inflation in unstandardized secondary schools makes GPAs equally unreliable. A composite assessment remains necessary.",
        createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
      },
    ],
    counts: { for: 0, against: 0, neutral: 1, total: 1 },
  },
  {
    id: "deb-3",
    _id: "deb-3",
    title: "Is carbon pricing the most effective policy tool to combat climate change?",
    description:
      "Economists widely promote carbon taxes and cap-and-trade systems to internalize environmental externalities. Opponents argue that carbon taxation creates regressive cost burdens on low-income households and that direct green infrastructure subsidies yield faster technological transitions.",
    category: "Environment",
    status: "closed",
    postedAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
    responses: [],
    counts: { for: 0, against: 0, neutral: 0, total: 0 },
  },
  {
    id: "deb-4",
    _id: "deb-4",
    title: "Should cities ban personal motor vehicles from their central districts?",
    description:
      "Pontevedra in Spain pedestrianized its center in 1999: pedestrian fatalities dropped to zero, local commercial revenues increased by 30%, and emissions plummeted. Critics argue suburban commuters and delivery logistics depend heavily on vehicle access.",
    category: "Society & Culture",
    status: "closed",
    postedAt: new Date(Date.now() - 22 * 24 * 3600 * 1000).toISOString(),
    responses: [],
    counts: { for: 0, against: 0, neutral: 0, total: 0 },
  },
  {
    id: "deb-5",
    _id: "deb-5",
    title: "Should remote workers be subject to localized salary adjustments?",
    description:
      "Global distributed teams have sparked intense debate over whether compensation should reflect the employee's local cost of living or solely the market value of their output regardless of geographical location.",
    category: "Economy & Business",
    status: "closed",
    postedAt: new Date(Date.now() - 29 * 24 * 3600 * 1000).toISOString(),
    responses: [],
    counts: { for: 0, against: 0, neutral: 0, total: 0 },
  },
];

/**
 * Loads cached user stances from local browser persistence.
 *
 * @param {string} userId
 * @returns {Record<string, string>}
 */
const loadStancesCache = (userId) => {
  if (!userId) return {};
  try {
    const raw = localStorage.getItem(`${STANCE_CACHE_PREFIX}${userId}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

/**
 * Persists updated user stances cache to browser storage.
 *
 * @param {string} userId
 * @param {Record<string, string>} map
 */
const saveStancesCache = (userId, map) => {
  if (!userId) return;
  try {
    localStorage.setItem(`${STANCE_CACHE_PREFIX}${userId}`, JSON.stringify(map));
  } catch {
    // Ignore storage quota errors
  }
};

/**
 * Reads local debates from storage or default list.
 *
 * @returns {Array<object>}
 */
const getLocalDebates = () => {
  try {
    const saved = localStorage.getItem(DEBATES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Fall back to defaults
  }
  return DEFAULT_FALLBACK_DEBATES;
};

/**
 * Saves debates to local storage.
 *
 * @param {Array<object>} list
 */
const saveLocalDebates = (list) => {
  try {
    localStorage.setItem(DEBATES_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // Ignore quota errors
  }
};

/**
 * Retrieves all debate topics.
 * Tries the live backend API first; falls back seamlessly to local storage
 * if the backend is unreachable (e.g., deployed on GitHub Pages).
 *
 * @returns {Promise<Array<object>>} List of debate records.
 */
export const getDebates = async () => {
  try {
    const response = await api.get("/debates");
    if (Array.isArray(response.data) && response.data.length > 0) {
      saveLocalDebates(response.data);
      return response.data;
    }
  } catch {
    // Graceful fallback to offline/cached debates
  }

  const localList = getLocalDebates();

  // Sync known user stances
  try {
    const savedUser = localStorage.getItem("sayso_session_user");
    if (savedUser) {
      const u = JSON.parse(savedUser);
      const uid = u?._id || u?.id;
      if (uid) {
        const cache = loadStancesCache(uid);
        localList.forEach((deb) => {
          const key = deb.id || deb._id;
          const myResp = deb.responses?.find((r) => r.userId === uid);
          if (myResp?.stance && !cache[key]) {
            cache[key] = myResp.stance;
          }
        });
        saveStancesCache(uid, cache);
      }
    }
  } catch {
    // Ignore errors
  }

  return localList;
};

/**
 * Creates and publishes a new debate topic.
 *
 * @param {object} params
 * @param {string} params.title
 * @param {string} params.description
 * @param {string} params.category
 * @returns {Promise<object>} Newly created debate record.
 */
export const postDebate = async ({ title, description, category }) => {
  try {
    const response = await api.post("/debates", { title, description, category });
    return response.data;
  } catch {
    // Gracefully handle local debate creation
    const currentList = getLocalDebates().map((d) => ({
      ...d,
      status: "closed",
    }));

    const newDeb = {
      id: "deb-" + Date.now(),
      _id: "deb-" + Date.now(),
      title,
      description,
      category: category || "Society & Culture",
      status: "current",
      postedAt: new Date().toISOString(),
      responses: [],
      counts: { for: 0, against: 0, neutral: 0, total: 0 },
    };

    const updated = [newDeb, ...currentList];
    saveLocalDebates(updated);
    return newDeb;
  }
};

/**
 * Synchronously retrieves user's locked stance from local cache.
 *
 * @param {string} userId
 * @param {string} debateId
 * @returns {string|null} Stance ("for" | "against" | "neutral") or null.
 */
export const getStance = (userId, debateId) => {
  if (!userId || !debateId) return null;
  const cache = loadStancesCache(userId);
  return cache[debateId] || null;
};

/**
 * Locks a user's stance on a debate topic via API or local cache.
 *
 * @param {object} params
 * @param {string} params.debateId
 * @param {string} params.userId
 * @param {string} params.stance
 * @returns {Promise<string>} Confirmed locked stance.
 */
export const setStance = async ({ debateId, userId, stance }) => {
  if (!debateId || !userId || !stance) {
    throw new Error("Missing parameters to record stance.");
  }

  // Update client cache first
  const cache = loadStancesCache(userId);
  cache[debateId] = stance;
  saveStancesCache(userId, cache);

  try {
    const response = await api.post(`/debates/${debateId}/stance`, { stance });
    return response.data?.stance || stance;
  } catch {
    // Return cached stance on network error
    return stance;
  }
};

/**
 * Submits or updates a user response commentary for a debate topic.
 *
 * @param {object} params
 * @param {string} params.debateId
 * @param {string} params.userId
 * @param {string} params.username
 * @param {string} params.stance
 * @param {string} params.text
 * @returns {Promise<object>} Created or updated response record.
 */
export const postResponse = async ({ debateId, userId, username, stance, text }) => {
  if (userId && stance) {
    const cache = loadStancesCache(userId);
    cache[debateId] = stance;
    saveStancesCache(userId, cache);
  }

  try {
    const response = await api.post(`/debates/${debateId}/responses`, {
      text,
      stance,
    });
    return response.data;
  } catch {
    // Update local debate in storage
    const list = getLocalDebates();
    const debIndex = list.findIndex((d) => (d.id || d._id) === debateId);
    const newResp = {
      id: "r-" + Date.now(),
      _id: "r-" + Date.now(),
      debateId,
      userId,
      username: username || "anonymous",
      stance,
      text,
      createdAt: new Date().toISOString(),
    };

    if (debIndex !== -1) {
      const target = list[debIndex];
      const existingIdx = target.responses?.findIndex((r) => r.userId === userId);
      const responses = [...(target.responses || [])];

      if (existingIdx !== -1 && existingIdx !== undefined) {
        responses[existingIdx] = { ...responses[existingIdx], text, stance };
      } else {
        responses.unshift(newResp);
      }

      const forCount = responses.filter((r) => r.stance === "for").length;
      const againstCount = responses.filter((r) => r.stance === "against").length;
      const neutralCount = responses.filter((r) => r.stance === "neutral").length;

      list[debIndex] = {
        ...target,
        responses,
        counts: {
          for: forCount,
          against: againstCount,
          neutral: neutralCount,
          total: responses.length,
        },
      };
      saveLocalDebates(list);
    }

    return newResp;
  }
};

/**
 * Updates user profile name and email address.
 *
 * @param {object} params
 * @param {string} params.userId
 * @param {string} params.fullName
 * @param {string} params.email
 * @returns {Promise<object>} Updated user profile.
 */
export const updateProfile = async ({ userId, fullName, email }) => {
  try {
    const response = await api.put("/users/profile", { fullName, email });
    return response.data;
  } catch {
    return { id: userId, _id: userId, fullName, email };
  }
};

/**
 * Standalone login service with local fallback.
 */
export const login = async ({ username, password }) => {
  try {
    const response = await api.post("/auth/login", { username, password });
    return response.data.user;
  } catch {
    const isAdmin = username.toLowerCase() === "admin" && password === "admin@123";
    return {
      _id: isAdmin ? "admin-id" : "user-" + username,
      fullName: isAdmin ? "Administrator" : username,
      username,
      email: `${username}@sayso.org`,
      role: isAdmin ? "admin" : "user",
    };
  }
};

/**
 * Standalone signup service with local fallback.
 */
export const signup = async ({ fullName, username, email, password }) => {
  try {
    const response = await api.post("/auth/signup", { fullName, username, email, password });
    return response.data.user;
  } catch {
    return {
      _id: "user-" + Date.now(),
      fullName,
      username,
      email,
      role: "user",
    };
  }
};
