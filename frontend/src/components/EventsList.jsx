import { useEffect, useState } from 'react';
import formatDate from "../utils/formatDate";
import EventDetail from "./EventDetail";
import CreateEvent from './CreateEvent';
import { eventsAPI } from '../api';

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
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

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleBack = () => {
    setSelectedEvent(null);
  };

  const handleRefresh = async () => {
    loadEvents();
  };

  if (selectedEvent) {
    return (
      <EventDetail 
        event={selectedEvent}
        onBack={handleBack}
        onEventsRefresh={handleRefresh}
      />
    );
  }

  if (!events) {
    events = [];
  }

  return (
    <div className="events-page">
      <h2>Discover</h2>
      <button onClick={handleRefresh} disabled={loading}>
        Refresh
      </button>

      <button onClick={() => setShowCreateEvent(!showCreateEvent)} disabled={loading}>
        Create Event
      </button>

      {showCreateEvent && <CreateEvent />}
      {loading && <p>Loading events...</p>}
      {!loading && !error && events.length === 0 && <p>No events yet.</p>}

      <div className="events-list">
        {events.map((event) => {
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