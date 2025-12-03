import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import EventsList from '../components/EventsList';
import CreateEvent from '../components/CreateEvent';
import AppNav from '../components/AppNav';

export default function HomePage() {
  const navigate = useNavigate();
  const [page, setPage] = useState('home');

  return (
    <div className="app">
      <header className="app-header">
        <h1>EventScout</h1>
      </header>
      <main className="app-main">
        {page === 'home' && <EventsList />}
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

