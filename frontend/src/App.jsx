import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/home" element={<ProtectedRoute allowedRole="user"><Home /></ProtectedRoute>} />
      <Route path="/post/:id" element={<ProtectedRoute allowedRole="user"><PostDetail /></ProtectedRoute>} />
      <Route path="/profile/:id" element={<ProtectedRoute allowedRole="user"><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute allowedRole="user"><Settings /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;