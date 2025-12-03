export default function EventsList({ events, onEventClick }) {
  return (
    <div className="events-page">
      <h2>My Events</h2>
      <div className="events-list">
        {events.map(event => (
          <div 
            key={event.id}
            className="event-card"
            onClick={() => onEventClick(event)}
          >
            <h3>{event.name}</h3>
            <p>{event.date}</p>
            <p>{event.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}