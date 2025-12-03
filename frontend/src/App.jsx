import { useState } from 'react';
import './index.css';
import './App.css';

function App() {
  const [page, setPage] = useState('home');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    {
      id: 1,
      name: 'Study Session',
      date: 'December 5, 2025',
      location: 'Library - Room 201',
      attendees: ['John', 'Sarah', 'Mike']
    },
    {
      id: 2,
      name: 'Basketball Game',
      date: 'December 6, 2025',
      location: 'Main Gym',
      attendees: ['Alex', 'Chris', 'Taylor', 'Jordan']
    }
  ];

  return (
    <div className="app">
      <header className="app-header">
        <h1>Event Scout</h1>
      </header>
      <main className="app-main">
        {page === 'home' && !selectedEvent && (
          <div className="events-page">
            <h2>My Events</h2>
            <div className="events-list">
              {events.map(event => (
                <div 
                  key={event.id}
                  className="event-card"
                  onClick={() => setSelectedEvent(event)}
                >
                  <h3>{event.name}</h3>
                  <p>{event.date}</p>
                  <p>{event.location}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {page === 'home' && selectedEvent && (
          <div className="event-detail">
            <button className="back-button" onClick={() => setSelectedEvent(null)}>
              ← Back
            </button>
            <div className="event-detail-card">
              <h2>{selectedEvent.name}</h2>
              <p><strong>Date:</strong> {selectedEvent.date}</p>
              <p><strong>Location:</strong> {selectedEvent.location}</p>
              <div className="attendees-section">
                <h3>Who's Going ({selectedEvent.attendees.length})</h3>
                <ul className="attendees-list">
                  {selectedEvent.attendees.map((attendee, index) => (
                    <li key={index}>
                      {attendee}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        {page === 'create' && (
          <div className="create-page">
            <h2>Create New Event</h2>
            <form className="event-form">
              <input type="text" placeholder="Event name" className="input" />
              <input type="date" className="input" />
              <input type="text" placeholder="Location" className="input" />
              <button type="submit" className="button-submit">
                Create Event
              </button>
            </form>
          </div>
        )}
        {page === 'profile' && (
          <div className="profile-page">
            <h2>My Profile</h2>
            <div className="profile-form">
              <div className="input-group">
                <label className="label">Name</label>
                <input type="text" defaultValue="John Doe" className="input" />
              </div>
              <div className="input-group">
                <label className="label">Email</label>
                <input type="email" defaultValue="john@example.com" className="input" />
              </div>
              <div className="input-group">
                <label className="label">Bio</label>
                <textarea defaultValue="Love attending events!" className="input" />
              </div>
              <button className="button-submit">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </main>
      <nav className="app-nav">
        <button 
          className={`nav-button ${page === 'home' ? 'active' : ''}`}
          onClick={() => { setPage('home'); setSelectedEvent(null); }}
        >
          Home
        </button>
        <button 
          className={`nav-button ${page === 'create' ? 'active' : ''}`}
          onClick={() => setPage('create')}
        >
          Create
        </button>
        <button 
          className={`nav-button ${page === 'profile' ? 'active' : ''}`}
          onClick={() => setPage('profile')}
        >
          Profile
        </button>
      </nav>
    </div>
  );
}

export default App;
