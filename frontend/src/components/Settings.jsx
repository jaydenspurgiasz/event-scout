import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function SettingsMenu() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
      <div className="container">
        <div className="card">
          <button onClick={() => navigate("/profile")} className="back-button">
            ← Back
          </button>
          <div className="form-header">
            <h2 className="form-title">Settings</h2>
            <div className="button-group">
              <button onClick={() => navigate("/settings/change-email")} className="button-primary">
                Change Email
              </button>
              <button onClick={() => navigate("/settings/change-password")} className="button-primary">
                Change Password
              </button>
              <button onClick={handleLogout} className="button-secondary" style={{marginTop: '10px'}}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}

export function ChangeEmail() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = () => {
        // TODO: Implement actual email change API call
        navigate("/profile");
    }

    return (
      <div className="container">
        <div className="card">
          <button onClick={() => navigate("/settings")} className="back-button">
            ← Back
          </button>
          <div className="form-header">
            <h2 className="form-title">Change Email</h2>
            <div className="form-group">
              <div className="input-group">
                <label htmlFor="new-email" className="label">
                  New Email
                </label>
                <input
                  id="change-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="input"
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </div>
              <div className="input-group">
                <label htmlFor="login-password" className="label">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input"
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </div>
              <button onClick={handleSubmit} className="button-submit">Change Email</button>
            </div>
          </div>
        </div>
      </div>
    );
}

export function ChangePassword() {
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleSubmit = () => {
        // TODO: Implement actual password change API call
        navigate("/profile");
    }

    return (
      <div className="container">
        <div className="card">
          <button onClick={() => navigate("/settings")} className="back-button">
            ← Back
          </button>
          <div className="form-header">
            <h2 className="form-title">Change Password</h2>
            <div className="form-group">
              <div className="input-group">
                <label htmlFor="login-password" className="label">
                  Old Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input"
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </div>
              <div className="input-group">
                <label htmlFor="new-password" className="label">
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input"
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </div>
              <button onClick={handleSubmit} className="button-submit">Change Password</button>
            </div>
          </div>
        </div>
      </div>
    );
}