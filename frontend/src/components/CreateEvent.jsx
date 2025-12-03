import { useState } from "react"
import { eventsAPI } from "../api.js"

export default function CreateEvent({ onCancel, onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [location, setLocation] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !eventDate || !eventTime) {
      setError("Title, date, and time are required");
      return;
    }
    
    const dateTime = `${eventDate}T${eventTime}:00`;

    setLoading(true);
    setError(null);
    
    try {
      await eventsAPI.create(title, description, dateTime, location, isPrivate);
      if (onSuccess) {
        onSuccess();
      }
    } catch(err) {
      console.log('error creating event', err);
      setError("Failed to create event");
    }
    setLoading(false);
  }

  return (
    <div className="create-page">
      {onCancel && (
        <button className="back-button" onClick={onCancel}>
          ← Back
        </button>
      )}
      <h2>Create New Event</h2>
      <form className="event-form" onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Event name" 
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description (optional)"
          className="input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div>
          <input 
            type="date" 
            className="input"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
            style={{ flex: 1 }}
          />
          <input 
            type="time" 
            className="input"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            required
            style={{ flex: 1 }}
          />
        </div>
        <input 
          type="text" 
          placeholder="Location" 
          className="input"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <label>
          <input 
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
          Private event
        </label>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="button-submit" disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}

