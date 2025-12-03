export default function EventDetail({ event, onBack }) {
  return (
    <div className="event-detail">
      <button className="back-button" onClick={onBack}>
        ← Back
      </button>
      <div className="event-detail-card">
        <h2>{event.name}</h2>
        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <div className="attendees-section">
          <h3>Who's Going ({event.attendees.length})</h3>
          <ul className="attendees-list">
            {event.attendees.map((attendee, index) => (
              <li key={index}>
                {attendee}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}