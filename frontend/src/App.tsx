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
            <h2>Events</h2>
            <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', backgroundColor: 'white' }}>
              <h3>Study Session</h3>
              <p>December 5, 2025 - Library</p>
            </div>
            <div style={{ border: '1px solid #ccc', padding: '15px', backgroundColor: 'white' }}>
              <h3>Basketball Game</h3>
              <p>December 6, 2025 - Gym</p>
            </div>
          </div>
        )}
        {page === 'create' && (
          <div>
            <h2>Create Event</h2>
            <p>form goes here</p>
          </div>
        )}
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#f0f0f0', padding: '10px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setPage('home')} style={{ flex: 1, padding: '10px' }}>Home</button>
        <button onClick={() => setPage('create')} style={{ flex: 1, padding: '10px' }}>Create</button>
      </div>
    </div>
  );
}

export default App;
