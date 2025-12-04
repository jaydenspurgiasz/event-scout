import { useEffect, useMemo, useState } from 'react';
import formatDate from "../utils/formatDate";
import EventDetail from "./EventDetail";
import CreateEvent from './CreateEvent';
import { eventsAPI } from '../api';

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    try {
      const data = await eventsAPI.search();
      setEvents(data);
      setError(null);
    } catch (err) {
      console.log('error loading events:', err);
      setError(err.message);
    }
    setLoading(false);
  }

  const filteredEvents = useMemo(() => {
    const list = Array.isArray(events) ? events : [];
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return list;
    return list.filter((evt) => {
      const title = (evt.title || '').toLowerCase();
      const location = (evt.location || '').toLowerCase();
      const description = (evt.description || '').toLowerCase();
      return (
        title.includes(q) ||
        location.includes(q) ||
        description.includes(q)
      );
    });
  }, [events, searchQuery]);

  if (selectedEvent) {
    return (
      <EventDetail 
        event={selectedEvent}
        onBack={() => setSelectedEvent(null)}
      />
    );
  }

  if (showCreateEvent) {
    return (
      <CreateEvent 
        onBack={() => setShowCreateEvent(false)}
        onSuccess={() => {
          setShowCreateEvent(false);
          loadEvents();
        }}
      />
    );
  }

  if (!events) {
    events = [];
  }

  return (
    <div className="events-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>Discover Events</h2>
        <button onClick={() => setShowCreateEvent(true)} disabled={loading} style={{ backgroundColor: '#4a90e2', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '0.375rem', padding: '10px 12px' }}>
          Create Event
        </button>
      </div>
      
      <div className="search-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search events by title, location, or description"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            maxWidth: 600,
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid #ccc',
            fontSize: 16,
          }}
        />
        <button onClick={() => loadEvents()} disabled={loading} style={{ backgroundColor: '#4a90e2', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '0.375rem', padding: '10px 12px' }}>
          Refresh
        </button>
      </div>

      {loading && <p>Loading events...</p>}
      {error && <p className="error-text">Error: {error}</p>}
      {!loading && !error && events.length === 0 && <p>No events yet.</p>}
      {!loading && !error && events.length > 0 && filteredEvents.length === 0 && (
        <p>No events match your search.</p>
      )}

      <div className="events-list">
        {filteredEvents.map((event) => {
          return (
            <div
              key={event.id}
              className="event-card"
              onClick={() => setSelectedEvent(event)}
            >
              <h3>{event.title}</h3>
              <p>{formatDate(event.date)}</p>
              <p>{event.location || 'Location TBD'}</p>
              {event.description && <p>{event.description}</p>}
              <small>{event.private ? 'Private' : 'Public'}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}