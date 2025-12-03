import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import EventsList from '../components/EventsList';
import CreateEvent from '../components/CreateEvent';
import AppNav from '../components/AppNav';

export default function HomePage() {
  const navigate = useNavigate();
  const [page, setPage] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="app">
      <header className="app-header">
        <h1>EventScout</h1>
      </header>
      <main className="app-main">
        {/* Move search bar below the blue header */}
        <div className="search-container" style={{ display: 'flex', justifyContent: 'center' }}>
          <input
            type="text"
            placeholder="Search events by title, location, or description"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              maxWidth: 600,
              margin: '12px 16px 16px',
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #ccc',
              fontSize: 16,
            }}
          />
        </div>
        {page === 'home' && <EventsList searchQuery={searchQuery} />}
        {page === 'create' && <CreateEvent />}
      </main>
      <AppNav 
        currentPage={page} 
        onPageChange={(nextPage) => {
          setPage(nextPage);
        }}
        onHomeClick={() => {
          setPage('home');
        }}
        onProfileClick={() => navigate('/profile')}
      />
    </div>
  );
}

