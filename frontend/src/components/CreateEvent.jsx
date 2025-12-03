import { useState } from "react"
import { eventsAPI } from "../api.js"
import { useNavigate } from "react-router-dom"

export default function CreateEvent() {
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !date) {
      setError("Title and date are required");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await eventsAPI.create(title, description, date, location, isPrivate);
      navigate('/home');
    } catch(err) {
      console.log('error creating event', err);
      setError("Failed to create event");
    }
    setLoading(false);
  }

  return (
    <div className="create-page">
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
        <input 
          type="datetime-local" 
          className="input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
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

