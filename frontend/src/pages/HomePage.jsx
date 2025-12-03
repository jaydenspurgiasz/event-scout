import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventsList from '../components/EventsList';
import EventDetail from '../components/EventDetail';
import CreateEvent from '../components/CreateEvent';
import AppNav from '../components/AppNav';

const mockEvents = [
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

export default function HomePage() {
  const navigate = useNavigate();
  const [page, setPage] = useState('home');
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Event Scout</h1>
      </header>
      <main className="app-main">
        {page === 'home' && !selectedEvent && (
          <EventsList 
            events={mockEvents} 
            onEventClick={setSelectedEvent} 
          />
        )}
        {page === 'home' && selectedEvent && (
          <EventDetail 
            event={selectedEvent} 
            onBack={() => setSelectedEvent(null)} 
          />
        )}
        {page === 'create' && (
          <CreateEvent />
        )}
      </main>
      <AppNav 
        currentPage={page} 
        onPageChange={setPage}
        onHomeClick={() => {
          setPage('home');
          setSelectedEvent(null);
        }}
        onProfileClick={() => navigate('/profile')}
      />
    </div>
  );
}

