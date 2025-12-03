import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const name = user ? `${user.firstName} ${user.lastName}` : '';
    const email = user?.email || '';

    return (
      <div className="container">
        <div className="card">
          <div>
            <button onClick={() => navigate("/home")} className="back-button">
              ← Back
            </button>
            <button onClick={() => navigate("/settings")} className="settings-button">
              Settings
            </button>
            
          </div>
          <div className="header">
            <h2 className="title">
              {name}
            </h2>
            <p className="subtitle">
              {email}
            </p>
          </div>
          <div className="profile-stats">
            <button onClick={() => navigate("/followers")}>
              <span className="stat-number">1</span>
              <span className="stat-label"> followers</span>
            </button>
            <button onClick={() => navigate("/following")}>
              <span className="stat-number">1</span>
              <span className="stat-label"> following</span>
            </button>
          </div>
          <div className="event-section">
            <h2 className="form-title">
              Events
            </h2>
            <div className="event-list">
              <div className="event-item">event1</div>
              <div className="event-item">event2</div>
            </div>
          </div>

        </div>
      </div>
    );
}