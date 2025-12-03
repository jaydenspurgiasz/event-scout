import { useState } from "react";
import "./App.css";

export default function App() {
  const [view, setView] = useState("choice");
  const [existingEmail, setExistingEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");

  // Choice screen
  if (view === "choice") {
    return (
      <div className="container">
        <div className="card">
          <div className="header">
            <div>
              <h2 className="title">Welcome to Event Scout</h2>
              <p className="subtitle">Plan, Post, and RSVP to Amazing Events!</p>
            </div>
          </div>
          <div className="button-group">
            <button onClick={() => setView("login")} className="button-primary">
              Login
            </button>
            <button onClick={() => setView("register")} className="button-secondary">
              Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === "login") {
    return (
      <div className="container">
        <div className="card">
          <button onClick={() => setView("choice")} className="back-button">
            ← Back
          </button>
          <div className="form-header">
            <h2 className="form-title">Login</h2>
            <p className="form-subtitle">Sign in to your Account</p>
          </div>
          <div className="form-group">
            <div className="input-group">
              <label htmlFor="login-email" className="label">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={existingEmail}
                onChange={(e) => setExistingEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input"
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
              />
            </div>
            <button className="button-submit">Sign In</button>
          </div>
        </div>
      </div>
    );
  }

  if (view === "register") {
    return (
      <div className="container">
        <div className="card">
          <button onClick={() => setView("choice")} className="back-button">
            ← Back
          </button>
          <div className="form-header">
            <h2 className="form-title">Register</h2>
            <p className="form-subtitle">Create your Account</p>
          </div>
          <div className="form-group">
            <div className="input-group">
              <label htmlFor="register-email" className="label">
                Email
              </label>
              <input
                id="register-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input"
              />
            </div>
            <div className="input-group">
              <label htmlFor="register-password" className="label">
                Password
              </label>
              <input
                id="register-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input"
              />
            </div>
            <button className="button-submit">Create Account</button>
          </div>
        </div>
      </div>
    );
  }
}
