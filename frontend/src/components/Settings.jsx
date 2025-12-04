import React from "react";
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
              <button onClick={handleLogout} className="button-secondary" style={{marginTop: '10px'}}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}