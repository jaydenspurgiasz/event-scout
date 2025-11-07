import { useState } from "react";

function login() {
  const [view, setView] = useState("choice");
  const [existingEmail, setExistingEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");

  // Choice screen
  if (view === "choice") {
    return (
      <div>
        <h2 className="large-header">Welcome to Event Scout</h2>
        <p className="reg-text">
          Plan, Post, and RSVP to Amazing Events!
        </p>

        <div>
          <button
            onClick={() => setView("login")}
            className="reg-text"
          >
            Login
          </button>
          <button
            onClick={() => setView("register")}
            className="reg-text"
          >
            Register
          </button>
        </div>
      </div>
    );
  }
  if(view === "login"){
    return(
      <div>
        <button 
        onClick={() => setView("choice")}>
        ← Back
      </button>
        <h2 className="large-header">Login</h2>
        <p className="reg-text">
          Sign in to your Account
        </p>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setExistingEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
      </div>
    )
  }
  if(view === "register"){
    return(
      <div>
        <button 
        onClick={() => setView("choice")}>
        ← Back
      </button>
        <h2 className="large-header">Register</h2>
        <p className="reg-text">
          Create your Account
        </p>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
      </div>
    )
  }
}