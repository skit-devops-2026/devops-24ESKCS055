import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppNavbar from "../components/AppNavbar";
import "./Settings.css";

const Settings = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const hasChanged =
    (fullName.trim() !== (user?.fullName || "")) ||
    (email.trim() !== (user?.email || ""));

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError("Email cannot be empty.");
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setIsSaving(true);
      await updateUserProfile({
        fullName: fullName.trim(),
        email: email.trim(),
      });
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("This will permanently delete your account. Continue?")) {
      await logout();
      navigate("/");
    }
  };

  return (
    <>
      <AppNavbar />

      <div className="settings page-container">
        <h2>Settings</h2>

        <div className="card settings-section">
          <h4>Account Details</h4>

          {/* Inline feedback */}
          {error && (
            <div style={{ color: "var(--color-against)", fontSize: "13px", fontWeight: "600" }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ color: "var(--color-for)", fontSize: "13px", fontWeight: "600" }}>
              {success}
            </div>
          )}

          {/* Full Name - Editable */}
          <label htmlFor="settings-fullname">Full Name</label>
          <input
            id="settings-fullname"
            className="input-field"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              setSuccess("");
              setError("");
            }}
            placeholder="Your full name"
          />

          {/* Email - Editable */}
          <label htmlFor="settings-email">Email</label>
          <input
            id="settings-email"
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setSuccess("");
              setError("");
            }}
            placeholder="name@example.com"
          />

          {/* Username - Non-editable */}
          <label htmlFor="settings-username">Username</label>
          <input
            id="settings-username"
            className="input-field"
            value={user?.username || ""}
            disabled
            style={{ background: "rgba(0, 0, 0, 0.04)", cursor: "not-allowed", color: "var(--color-muted)" }}
          />
          <span className="settings-muted" style={{ fontSize: "12px", marginTop: "-4px" }}>
            Username cannot be edited.
          </span>

          {/* Password - Non-editable */}
          <label htmlFor="settings-password">Password</label>
          <input
            id="settings-password"
            type="password"
            className="input-field"
            value="••••••••"
            disabled
            style={{ background: "rgba(0, 0, 0, 0.04)", cursor: "not-allowed", color: "var(--color-muted)" }}
          />
          <span className="settings-muted" style={{ fontSize: "12px", marginTop: "-4px" }}>
            Password cannot be edited here.
          </span>

          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!hasChanged || isSaving}
            style={{
              opacity: !hasChanged || isSaving ? 0.5 : 1,
              cursor: !hasChanged || isSaving ? "not-allowed" : "pointer",
            }}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="card settings-section danger-zone">
          <h4>Delete Account</h4>
          <p className="settings-muted">This action is permanent and cannot be undone.</p>
          <button className="btn btn-outline danger-btn" onClick={handleDeleteAccount}>
            Delete My Account
          </button>
        </div>
      </div>
    </>
  );
};

export default Settings;