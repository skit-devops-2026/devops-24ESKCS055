import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/post/:id" element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
      <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;