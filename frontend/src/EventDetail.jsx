import { useState, useEffect } from "react";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

function EventDetail({ eventId }) {
  const [eventDetails, setEventDetails] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      setError(null);

      const detailsResponse = await fetch(`${API_BASE_URL}/api/event/${eventId}`);
      if (!detailsResponse.ok) {
        throw new Error("Failed to fetch event details");
      }
      const detailsData = await detailsResponse.json();
      setEventDetails(detailsData);

      const participantsResponse = await fetch(`${API_BASE_URL}/api/event/${eventId}/participants`);
      if (!participantsResponse.ok) {
        throw new Error("Failed to fetch participants");
      }
      const participantsData = await participantsResponse.json();
      setParticipants(participantsData.participants || []);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchEventData();
    }
  }, [eventId]);

  if (loading) {
    return <div>Loading event details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!eventDetails) {
    return <div>Event not found</div>;
  }

  return (
    <div>
      <h1>{eventDetails.name}</h1>
      <p>{eventDetails.description || "No description available"}</p>
      
      <h2>Participants ({participants.length})</h2>
      {participants.length > 0 ? (
        <ul>
          {participants.map((participant) => (
            <li key={participant.id}>{participant.email}</li>
          ))}
        </ul>
      ) : (
        <p>No participants yet</p>
      )}
    </div>
  );
}

export default EventDetail;

