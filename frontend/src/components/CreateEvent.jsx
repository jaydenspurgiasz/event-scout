export default function CreateEvent() {
  return (
    <div className="create-page">
      <h2>Create New Event</h2>
      <form className="event-form">
        <input type="text" placeholder="Event name" className="input" />
        <input type="date" className="input" />
        <input type="text" placeholder="Location" className="input" />
        <button type="submit" className="button-submit">
          Create Event
        </button>
      </form>
    </div>
  );
}

