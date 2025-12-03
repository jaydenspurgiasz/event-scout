import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async () => {
        setError("");
        setLoading(true);
        const result = await login(email, password);
        setLoading(false);
        
        if (result.success) {
            navigate("/home");
        } else {
            setError(result.error || "Login failed. Please try again.");
        }
    };

    return (
      <div className="container">
        <div className="card">
          <button onClick={() => navigate("/")} className="back-button">
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
                onKeyPress={(e) => e.key === 'Enter' && !loading && handleSubmit()}
              />
            </div>
            {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
            <button onClick={handleSubmit} className="button-submit" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    );
}