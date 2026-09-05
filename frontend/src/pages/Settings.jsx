import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";import "./Settings.css";


const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [bio, setBio] = useState(user?.bio || "");

  const handleSave = () => {
    // TODO: call PUT /api/users/update once wired to backend
    alert("Profile updated (mock)");
  };

  const handleDeleteAccount = async () => {
    if (confirm("This will permanently delete your account. Continue?")) {
      await logout();
      navigate("/");
    }
  };

  return (
    <>
      <div className="settings page-container">
        <h2>Settings</h2>

        <div className="card settings-section">
          <h4>Edit Profile</h4>
          <label>Full Name</label>
          <input className="input-field" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <label>Bio</label>
          <textarea className="input-field" rows="3" value={bio} onChange={(e) => setBio(e.target.value)} />
          <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
        </div>

        <div className="card settings-section">
          <h4>Liked Debates</h4>
          <p className="settings-muted">You'll see debates you've liked here.</p>
        </div>

        <div className="card settings-section danger-zone">
          <h4>Delete Account</h4>
          <p className="settings-muted">This action is permanent and cannot be undone.</p>
          <button className="btn btn-outline danger-btn" onClick={handleDeleteAccount}>Delete My Account</button>
        </div>
      </div>

      
    </>
  );
};

export default Settings;