import { createContext, useContext, useState, useEffect } from "react";
import { login as mockLogin, signup as mockSignup, updateProfile as mockUpdateProfile } from "../mock/mockData";

const AuthContext = createContext();

const SESSION_KEY = "sayso_session_user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch {
      // ignore
    }
  }, [user]);

  const login = async ({ username, password }) => {
    setLoading(true);
    try {
      const loggedIn = await mockLogin({ username, password });
      setUser(loggedIn);
      return loggedIn;
    } finally {
      setLoading(false);
    }
  };

  const signup = async ({ fullName, username, email, password }) => {
    setLoading(true);
    try {
      const newUser = await mockSignup({ fullName, username, email, password });
      setUser(newUser);
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    try {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.clear();
    } catch {
      // ignore
    }
  };

  const updateUserProfile = async ({ fullName, email }) => {
    if (!user) throw new Error("No active session.");
    const updated = await mockUpdateProfile({
      userId: user._id,
      fullName,
      email,
    });
    setUser((prev) => ({
      ...prev,
      fullName: updated.fullName,
      email: updated.email,
    }));
    return updated;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);