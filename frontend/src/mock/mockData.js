import api from "../api/axios";
import { CATEGORIES } from "../data/mockPosts";

export { CATEGORIES };

const STANCE_CACHE_PREFIX = "sayso_user_stances_";

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
 * Retrieves all debate topics with associated commentary and real-time stance aggregations.
 * Synchronizes user responses with the local stance cache.
 *
 * @returns {Promise<Array<object>>} List of debate records.
 */
export const getDebates = async () => {
  try {
    const response = await api.get("/debates");
    const data = response.data;

    // Synchronize known stances for the active logged-in user
    try {
      const savedUser = localStorage.getItem("sayso_session_user");
      if (savedUser) {
        const u = JSON.parse(savedUser);
        const uid = u?._id || u?.id;
        if (uid) {
          const cache = loadStancesCache(uid);
          data.forEach((deb) => {
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
      // Non-fatal if session reading fails
    }

    return data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Failed to load debates";
    throw new Error(message);
  }
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
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Failed to post debate";
    throw new Error(message);
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
 * Locks a user's stance on a debate topic via API and updates client cache.
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

  try {
    const response = await api.post(`/debates/${debateId}/stance`, { stance });
    const resolvedStance = response.data?.stance || stance;

    const cache = loadStancesCache(userId);
    cache[debateId] = resolvedStance;
    saveStancesCache(userId, cache);

    return resolvedStance;
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Failed to record stance";
    throw new Error(message);
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
  try {
    const response = await api.post(`/debates/${debateId}/responses`, {
      text,
      stance,
    });

    // Ensure stance is recorded in local cache
    if (userId && stance) {
      const cache = loadStancesCache(userId);
      cache[debateId] = stance;
      saveStancesCache(userId, cache);
    }

    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Failed to post response";
    throw new Error(message);
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
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Failed to update profile";
    throw new Error(message);
  }
};

/**
 * Standalone login service for direct API invocations.
 */
export const login = async ({ username, password }) => {
  const response = await api.post("/auth/login", { username, password });
  return response.data.user;
};

/**
 * Standalone signup service for direct API invocations.
 */
export const signup = async ({ fullName, username, email, password }) => {
  const response = await api.post("/auth/signup", { fullName, username, email, password });
  return response.data.user;
};
