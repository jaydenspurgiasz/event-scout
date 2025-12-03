import { useState } from "react";

export default function Login({setView, onLogin}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = () => {
        onLogin(email, password);
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
            <button onClick={handleSubmit} className="button-submit">Sign In</button>
          </div>
        </div>
      </div>
    );
}