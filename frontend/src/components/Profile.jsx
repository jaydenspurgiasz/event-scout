import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { eventsAPI, friendsAPI } from '../api';

export default function Profile() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const name = user ? `${user.name}` : '';
    const email = user?.email || '';

    const [numFriends, setNumFriends] = useState(0);
    const [events, setEvents] = useState([]);

    useEffect(() => {
      const loadFriends = async () => {
        try {
          const friendsData = await friendsAPI.getAllFriends();
          setNumFriends(friendsData ? friendsData.length : 0);
        } catch(err) {
          console.log('error loading friends', err);
        }
      };
      loadFriends();
    }, []);

    useEffect(() => {
      const loadEvents = async () => {
        try {
          const eventsData = await eventsAPI.searchAttending(user.id);
          setEvents(Array.isArray(eventsData) ? eventsData : []);
        } catch(err) {
          console.log('error loading events', err);
          setEvents([]);
        }
      };
      loadEvents();
    }, [user?.id]);

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
              {events.length === 0 && <p className="empty-state">No events yet</p>}
              {events.map((event) => (
                <div key={event.id} className="event-item">
                  <h3>{event.title}</h3>
                  {event.date && <p>{new Date(event.date).toLocaleDateString()}</p>}
                  {event.location && <p>{event.location}</p>}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
}