import { useEffect, useMemo, useState } from 'react';
import formatDate from "../utils/formatDate";
import EventDetail from "./EventDetail";
import { eventsAPI } from '../api';
import { mockEvents } from '../data/mockEvents';

export default function EventsList({ searchQuery = '' }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

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
      // Fallback to mock events if backend is unreachable or returns error
      if (!events || events.length === 0) {
        setEvents(mockEvents);
      }
    }
    setLoading(false);
  }

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleBack = () => {
    setSelectedEvent(null);
  };

  const handleRefresh = async () => {
    loadEvents();
  };

  // Search bar - used for filtering for events
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
        onBack={handleBack}
        onEventsRefresh={handleRefresh}
      />
    );
  }

  return (
    <div className="events-page">
      <h2>Discover Events</h2>
      <button onClick={handleRefresh} disabled={loading}>
        Refresh
      </button>

      {loading && <p>Loading events...</p>}
      {!loading && !error && (Array.isArray(events) ? events.length === 0 : true) && <p>No events yet.</p>}
      {!loading && !error && events.length > 0 && filteredEvents.length === 0 && (
        <p>No events match your search.</p>
      )}

      <div className="events-list">
        {filteredEvents.map((event) => {
          return (
            <div
              key={event.id}
              className="event-card"
              onClick={() => handleSelectEvent(event)}
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