import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { friendsAPI } from '../api';

export default function Profile() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const name = user ? `${user.name}` : '';
    const email = user?.email || '';

    const [numFriends, setNumFriends] = useState(0);

    useEffect(() => {
      loadFriends();
    }, []);

    const loadFriends = async () => {
      try {
        const friendsData = await friendsAPI.getAllFriends();
        setNumFriends(friendsData ? friendsData.length : 0);
      } catch(err) {
        console.log('error loading friends', err);
      }
    };

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
            <button onClick={() => navigate("/friends")} className="button-secondary">
              <span className="stat-label">Friends: {numFriends} </span>
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