import { useState } from 'react';
import './index.css';

function App() {
  const [page, setPage] = useState('home');

  return (
    <div>
      <div style={{ backgroundColor: '#4a90e2', color: 'white', padding: '20px' }}>
        <h1>Event Scout</h1>
      </div>
      <div style={{ padding: '20px', paddingBottom: '80px' }}>
        {page === 'home' && (
          <div>
            <h2>My Events</h2>
            <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', backgroundColor: 'white', borderRadius: '5px' }}>
              <h3>Study Session</h3>
              <p>December 5, 2025</p>
              <p>Library - Room 201</p>
            </div>
            <div style={{ border: '1px solid #ccc', padding: '15px', backgroundColor: 'white', borderRadius: '5px' }}>
              <h3>Basketball Game</h3>
              <p>December 6, 2025</p>
              <p>Main Gym</p>
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
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#f0f0f0', borderTop: '1px solid #ccc', display: 'flex', padding: '10px' }}>
        <button onClick={() => setPage('home')} style={{ flex: 1, padding: '10px', marginRight: '5px', backgroundColor: page === 'home' ? '#4a90e2' : 'white', color: page === 'home' ? 'white' : '#333', border: '1px solid #ccc', borderRadius: '4px' }}>
          Home
        </button>
        <button onClick={() => setPage('create')} style={{ flex: 1, padding: '10px', marginLeft: '5px', backgroundColor: page === 'create' ? '#4a90e2' : 'white', color: page === 'create' ? 'white' : '#333', border: '1px solid #ccc', borderRadius: '4px' }}>
          Create
        </button>
      </div>
    </div>
  );
}

export default App;
