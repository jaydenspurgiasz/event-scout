import { useState } from "react";

export default function Login({setView, onLogin}) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = () => {
        onLogin(name, email, password);
    };
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
                <div className="input-group">
              <label htmlFor="name" className="label">
                Name
              </label>
              <input
                id="name"
                type="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First Last"
                required
                className="input"
              />
            </div>
              <label htmlFor="login-email" className="label">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <button onClick={handleSubmit} className="button-submit">Sign In</button>
          </div>
        </div>
      </div>
    );
}