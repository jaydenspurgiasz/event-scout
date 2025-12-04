import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import formatDate from "../utils/formatDate";
import { eventsAPI } from '../api';
import { useAuth } from '../contexts/AuthContext';

export default function EventDetail({ event, onBack, onEventsRefresh }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [participantsError, setParticipantsError] = useState(null);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  useEffect(() => {
    if (!event) return;

    async function loadParticipants() {
      setParticipants([]);
      setParticipantsError(null);
      setLoadingParticipants(true);
      try {
        const data = await eventsAPI.getParticipants(event.id);
        setParticipants(data);
      } catch (err) {
        console.log('error loading participants:', err);
        setParticipantsError(err.message);
      }
      setLoadingParticipants(false);
    }

    loadParticipants();
  }, [event]);

  const handleRsvp = async () => {
    if (!event) return;

    let alreadyGoing = false;
    for (let i = 0; i < participants.length; i++) {
      if (participants[i].id === user?.id) {
        alreadyGoing = true;
        break;
      }
    }

    setRsvpLoading(true);
    try {
      if (alreadyGoing) {
        await eventsAPI.unrsvp(event.id);
      } else {
        await eventsAPI.rsvp(event.id);
      }
      const newParticipants = await eventsAPI.getParticipants(event.id);
      setParticipants(newParticipants);
    } catch (err) {
      console.log('rsvp error:', err);
      setParticipantsError(err.message);
    }
    setRsvpLoading(false);
  };

  if (!event) {
    return null;
  }

  if (!participants) {
    participants = [];
  }

  let isAttending = false;
  if (user) {
    for (let i = 0; i < participants.length; i++) {
      if (participants[i].id === user.id) {
        isAttending = true;
        break;
      }
    }
  }

  return (
    <div className="event-detail">
      <button className="back-button" onClick={onBack}>
        ← Back
      </button>
      <div className="event-detail-card">
        <h2>{event.title}</h2>
        <p><strong>Date:</strong> {formatDate(event.date)}</p>
        <p><strong>Location:</strong> {event.location || 'Location TBD'}</p>
        <p><strong>Privacy:</strong> {event.private ? 'Private' : 'Public'}</p>
        {event.description && (
          <p><strong>About:</strong> {event.description}</p>
        )}
        <div className='button-group'>
        <button
          onClick={handleRsvp}
          disabled={rsvpLoading || loadingParticipants} style={{ backgroundColor: '#4a90e2', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '0.375rem', padding: '10px 12px', width: '150px' }}
        >
          {rsvpLoading ? 'Saving...' : isAttending ? 'Leave Event' : 'Join Event'}
        </button>

        {/* Link to event-specific chat room */}
        <button
          className="chat-button"
          onClick={() => navigate(`/chats/${event.id}`, { state: { title: event.title } })} style={{ color: '#4a90e2', backgroundColor: 'white', borderColor: '#4a90e2', cursor: 'pointer', borderRadius: '0.375rem', padding: '10px 12px', width: '150px' }}
        >
          Open Chat
        </button>
        </div>

        <div className="attendees-section">
          <h3>Who's Going ({participants.length})</h3>
          {loadingParticipants && <p>Loading...</p>}
          {participantsError && <p>Error: {participantsError}</p>}
          {!loadingParticipants && !participantsError && participants.length === 0 && (
            <p>No one has RSVPed yet.</p>
          )}
          {!loadingParticipants && !participantsError && participants.length > 0 && (
            <ul>
              {participants.map((p) => (
                <li key={p.id}>{p.name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}