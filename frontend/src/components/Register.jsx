import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setError("");
        
        if (!name.trim()) {
            setError("Please enter your name");
            return;
        }
        
        setLoading(true);
        const result = await register(name.trim(), email, password);
        setLoading(false);
        
        if (result.success) {
            navigate("/home");
        } else {
            setError(result.error || "Registration failed. Please try again.");
        }
    };
    return (
      <div className="container">
        <div className="card">
          <button onClick={() => navigate("/")} className="back-button">
            ← Back
          </button>
          <div className="form-header">
            <h2 className="form-title">Register</h2>
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
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
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
                onKeyDown={(e) => e.key === 'Enter' && !loading && handleSubmit()}
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
                onKeyDown={(e) => e.key === 'Enter' && !loading && handleSubmit()}
              />
            </div>
            {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
            <button onClick={handleSubmit} className="button-submit" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
        </div>
      </div>
    );
}