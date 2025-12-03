import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import EventsList from '../components/EventsList';
import CreateEvent from '../components/CreateEvent';
import AppNav from '../components/AppNav';

export default function HomePage() {
  const navigate = useNavigate();
  const [page, setPage] = useState('home');

  const handlePageChange = (nextPage) => {
    if (nextPage === 'profile') {
      navigate('/profile');
    } else {
      setPage(nextPage);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Event Scout</h1>
      </header>
      <main className="app-main">
        {page === 'home' && <EventsList />}
      </main>
      <AppNav 
        currentPage={page} 
        onPageChange={handlePageChange}
      />
    </div>
  );
}

