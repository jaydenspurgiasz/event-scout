import React, { useState } from "react";

export function SettingsMenu({setView}) {
    return (
      <div className="container">
        <div className="card">
          <button onClick={() => setView("profile")} className="back-button">
            ← Back
          </button>
          <div className="form-header">
            <h2 className="form-title">Settings</h2>
            <div className="button-group">
              <button onClick={() => setView("change-email")} className="button-primary">
                Change Email
              </button>
              <button onClick={() => setView("change-password")} className="button-primary">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}

export function ChangeEmail({setView, currentPassword, onChangeEmail}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = () => {
        if(password === currentPassword){
            onChangeEmail(email);
            setView("profile");
        }
    }

    return (
      <div className="container">
        <div className="card">
          <button onClick={() => setView("settings")} className="back-button">
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

export function ChangePassword({setView, currentPassword, onChangePassword}) {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleSubmit = () => {
        if(oldPassword === currentPassword){
            onChangePassword(newPassword);
            setView("profile");
        }
    }

    return (
      <div className="container">
        <div className="card">
          <button onClick={() => setView("settings")} className="back-button">
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