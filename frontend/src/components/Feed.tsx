import { Event } from '../types';
import { EventCard } from './EventCard';
import { mockEvents } from '../lib/mockData';

interface FeedProps {
  onEventClick: (event: Event) => void;
}

export function Feed({ onEventClick }: FeedProps) {
  const sortedEvents = [...mockEvents].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '4px', fontWeight: 'bold' }}>
          Upcoming Events
        </h2>
        <p style={{ fontSize: '13px', color: '#666' }}>
          Events near UCLA
        </p>
      </div>

      <div>
        {sortedEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onClick={onEventClick}
          />
        ))}
      </div>
    </div>
  );
}
