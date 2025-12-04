import { useState } from 'react';
import './index.css';

type Event = {
  id: number;
  name: string;
  date: string;
  location: string;
  attendees: string[];
};

function App() {
  const [page, setPage] = useState('home');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div style={{ backgroundColor: '#4a90e2', color: 'white', padding: '20px' }}>
        <h1 style={{ marginBottom: '10px' }}>Event Scout</h1>
        <div style={{ marginTop: '5px' }}>
          <input 
            type="text" 
            placeholder="Search events by name or location..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%',
              padding: '10px 12px',
              backgroundColor: '#ffffff',
              color: '#111827',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>
      </div>
      <div style={{ padding: '20px', paddingBottom: '80px' }}>
        {page === 'home' && !selectedEvent && (
          <div>
            <h2>My Events</h2>
            {filteredEvents.length === 0 && (
              <p style={{ color: '#666', marginTop: '20px' }}>No events found matching "{searchQuery}"</p>
            )}
            {filteredEvents.map(event => (
              <div 
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', backgroundColor: 'white', borderRadius: '5px', cursor: 'pointer' }}
              >
                <h3>{event.name}</h3>
                <p>{event.date}</p>
                <p>{event.location}</p>
              </div>
            ))}
          </div>
        )}
        {page === 'home' && selectedEvent && (
          <div>
            <button onClick={() => setSelectedEvent(null)} style={{ marginBottom: '15px', padding: '8px 15px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '4px' }}>
              ← Back
            </button>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px', border: '1px solid #ccc' }}>
              <h2>{selectedEvent.name}</h2>
              <p style={{ marginTop: '10px' }}><strong>Date:</strong> {selectedEvent.date}</p>
              <p><strong>Location:</strong> {selectedEvent.location}</p>
              <div style={{ marginTop: '20px' }}>
                <h3>Who's Going ({selectedEvent.attendees.length})</h3>
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
                  {selectedEvent.attendees.map((attendee, index) => (
                    <li key={index} style={{ padding: '8px', backgroundColor: '#f0f0f0', marginBottom: '5px', borderRadius: '3px' }}>
                      {attendee}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        {page === 'create' && (
          <div>
            <h2>Create New Event</h2>
            <form>
              <input type="text" placeholder="Event name" style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc' }} />
              <input type="date" style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc' }} />
              <input type="text" placeholder="Location" style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc' }} />
              <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4a90e2', color: 'white', border: 'none', borderRadius: '4px' }}>
                Create Event
              </button>
            </form>
          </div>
        )}
        {page === 'profile' && (
          <div>
            <h2>My Profile</h2>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px', border: '1px solid #ccc', marginTop: '15px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name</label>
                <input type="text" defaultValue="John Doe" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
                <input type="email" defaultValue="john@example.com" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Bio</label>
                <textarea defaultValue="Love attending events!" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', minHeight: '80px' }} />
              </div>
              <button style={{ padding: '10px 20px', backgroundColor: '#4a90e2', color: 'white', border: 'none', borderRadius: '4px' }}>
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#f0f0f0', borderTop: '1px solid #ccc', display: 'flex', padding: '10px' }}>
        <button onClick={() => { setPage('home'); setSelectedEvent(null); }} style={{ flex: 1, padding: '10px', marginRight: '3px', backgroundColor: page === 'home' ? '#4a90e2' : 'white', color: page === 'home' ? 'white' : '#333', border: '1px solid #ccc', borderRadius: '4px' }}>
          Home
        </button>
        <button onClick={() => setPage('create')} style={{ flex: 1, padding: '10px', margin: '0 3px', backgroundColor: page === 'create' ? '#4a90e2' : 'white', color: page === 'create' ? 'white' : '#333', border: '1px solid #ccc', borderRadius: '4px' }}>
          Create
        </button>
        <button onClick={() => setPage('profile')} style={{ flex: 1, padding: '10px', marginLeft: '3px', backgroundColor: page === 'profile' ? '#4a90e2' : 'white', color: page === 'profile' ? 'white' : '#333', border: '1px solid #ccc', borderRadius: '4px' }}>
          Profile
        </button>
      </div>
    </div>
  );
}

export default App;
