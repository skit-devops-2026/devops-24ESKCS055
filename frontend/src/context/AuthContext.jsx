import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

const SESSION_KEY = "sayso_session_user";
const TOKEN_KEY = "token";

/**
 * Provides global authentication context and session persistence.
 * Synchronizes user state with MongoDB Atlas backend.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore parse errors
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  // Sync session state to storage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  }, [user]);

  // Verify and hydrate current session on startup
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    api
      .get("/auth/me")
      .then((res) => {
        if (res.data) {
          setUser(res.data);
        }
      })
      .catch(() => {
        // If token is expired or invalid, clear stale credentials
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(SESSION_KEY);
        setUser(null);
      });
  }, []);

  /**
   * Authenticates user against backend API.
   *
   * @param {object} credentials
   * @param {string} credentials.username
   * @param {string} credentials.password
   */
  const login = async ({ username, password }) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { username, password });
      const { token, user: loggedInUser } = response.data;
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      }
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to log in";
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Registers a new user account via backend API.
   *
   * @param {object} params
   * @param {string} params.fullName
   * @param {string} params.username
   * @param {string} params.email
   * @param {string} params.password
   */
  const signup = async ({ fullName, username, email, password }) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/signup", { fullName, username, email, password });
      const { token, user: newUser } = response.data;
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      }
      setUser(newUser);
      return newUser;
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to create account";
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Terminates active session and purges local credentials.
   */
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.clear();
      setUser(null);
    }
  };

  /**
   * Updates user account profile details.
   *
   * @param {object} params
   * @param {string} params.fullName
   * @param {string} params.email
   * @param {string} [params.bio]
   */
  const updateUserProfile = async ({ fullName, email, bio }) => {
    if (!user) throw new Error("No active session.");
    try {
      const response = await api.put("/users/profile", { fullName, email, bio });
      const updated = response.data;
      setUser(updated);
      return updated;
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to update profile";
      throw new Error(message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);