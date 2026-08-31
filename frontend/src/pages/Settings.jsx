import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppNavbar from "../components/AppNavbar";
import api from "../api/axios";

const Settings = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setBio(user.bio || "");
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setStatusMsg("");
    setErrorMsg("");
    setSaving(true);
    try {
      const res = await api.put("/users/update", { fullName, bio });
      if (updateUser) updateUser(res.data);
      setStatusMsg("Profile updated successfully!");
    } catch (err) {
      console.warn("Update profile API error", err);
      if (updateUser) updateUser({ fullName, bio });
      setStatusMsg("Profile updated locally.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("This will permanently delete your account and all your debates. Are you sure?")) {
      try {
        await api.delete("/users/delete");
      } catch (err) {
        console.warn("Delete account API error", err);
      }
      await logout();
      navigate("/");
    }
  };

  return (
    <>
      <AppNavbar />
      <div className="settings page-container">
        <Link to={`/profile/${user?._id}`} className="st-back">← Back to Profile</Link>
        <h2>Settings</h2>

        {statusMsg && <div className="settings-success">{statusMsg}</div>}
        {errorMsg && <div className="settings-error">{errorMsg}</div>}

        <form className="card settings-section" onSubmit={handleSave}>
          <h4>Edit Profile</h4>
          <label>Full Name</label>
          <input
            className="input-field"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
            required
          />

          <label>Bio</label>
          <textarea
            className="input-field"
            rows="3"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us a little about your perspective..."
          />

          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <div className="card settings-section danger-zone">
          <h4>Delete Account</h4>
          <p className="settings-muted">This action is permanent and will delete your account and all debates.</p>
          <button className="btn btn-outline danger-btn" type="button" onClick={handleDeleteAccount}>
            Delete My Account
          </button>
        </div>
      </div>

      <style>{`
        .settings { padding: 32px 24px 60px; max-width: 580px; }
        .st-back { display: inline-block; margin-bottom: 16px; font-size: 14px; font-weight: 600; color: var(--color-primary); }
        .st-back:hover { text-decoration: underline; }
        .settings h2 { margin-bottom: 20px; }

        .settings-success {
          background: #EAF1EE;
          color: var(--color-primary-dark);
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 18px;
          font-size: 14px;
          font-weight: 600;
        }

        .settings-error {
          background: #FDF2F2;
          color: var(--color-against);
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 18px;
          font-size: 14px;
        }

        .settings-section {
          padding: 24px;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .settings-section label { font-size: 13px; font-weight: 600; color: var(--color-muted); margin-top: 8px; }
        .settings-section button { margin-top: 14px; align-self: flex-start; }
        .settings-muted { color: var(--color-muted); font-size: 14px; line-height: 1.5; }

        .danger-zone { border-color: var(--color-against); }
        .danger-btn { border-color: var(--color-against); color: var(--color-against); }
        .danger-btn:hover { background: var(--color-against); color: #fff; }
      `}</style>
    </>
  );
};

export default Settings;