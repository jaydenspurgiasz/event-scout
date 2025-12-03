import { useNavigate } from 'react-router-dom';

export default function Choice() {
    const navigate = useNavigate();
    
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
            <button onClick={() => navigate("/login")} className="button-primary">
              Login
            </button>
            <button onClick={() => navigate("/register")} className="button-secondary">
              Register
            </button>
          </div>
        </div>
      </div>
    );
}