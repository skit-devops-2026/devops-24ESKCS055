import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

// Hardcoded demo user — no backend needed
const MOCK_USER = {
  _id: "user_apoorva_01",
  fullName: "Apoorva",
  username: "apoorva",
  email: "apoorva@sayso.com",
  profilePic: "",
  followers: [],
  following: [],
};

export const AuthProvider = ({ children }) => {
  // Start with mock user already logged in — skips auth check entirely
  const [user, setUser] = useState(MOCK_USER);
  const [loading, setLoading] = useState(false);

  const login = async ({ username, password }) => {
    // Hardcoded credentials check — no backend needed
    if (username === "apoorva" && password === "1234") {
      setUser(MOCK_USER);
      return MOCK_USER;
    }
    throw new Error("Invalid credentials. Use username: apoorva, password: 1234");
  };

  const signup = async (formData) => {
    // For demo mode, just set the mock user
    setUser(MOCK_USER);
    return MOCK_USER;
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);