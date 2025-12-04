import { Calendar, MapPin, Users } from 'lucide-react';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
  onClick: (event: Event) => void;
  variant?: 'full' | 'compact';
}

export function EventCard({ event, onClick, variant = 'full' }: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (variant === 'compact') {
    return (
      <div
        onClick={() => onClick(event)}
        style={{
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '12px',
          marginBottom: '12px',
          cursor: 'pointer'
        }}
      >
        <h3 style={{ fontSize: '15px', marginBottom: '6px', fontWeight: 'bold' }}>
          {event.title}
        </h3>
        <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
          📅 {formatDate(event.date)} at {event.time}
        </div>
        <div style={{ fontSize: '13px', color: '#666' }}>
          📍 {event.location}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onClick(event)}
      style={{
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '4px',
        marginBottom: '16px',
        cursor: 'pointer',
        overflow: 'hidden'
      }}
    >
      {/* Event Image */}
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.title}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            display: 'block'
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Event';
          }}
        />
      )}

      {/* Event Details */}
      <div style={{ padding: '16px' }}>
        <div style={{
          backgroundColor: '#e5e7eb',
          display: 'inline-block',
          padding: '4px 8px',
          borderRadius: '3px',
          fontSize: '11px',
          marginBottom: '8px'
        }}>
          {event.category}
        </div>

        <h2 style={{ fontSize: '17px', marginBottom: '12px', fontWeight: 'bold' }}>
          {event.title}
        </h2>
        
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
          <Calendar size={14} style={{ display: 'inline', marginRight: '6px' }} />
          {formatDate(event.date)} • {event.time}
        </div>

        <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
          <MapPin size={14} style={{ display: 'inline', marginRight: '6px' }} />
          {event.location}
        </div>

        <p style={{ fontSize: '14px', color: '#444', marginBottom: '12px', lineHeight: '1.4' }}>
          {event.description.slice(0, 100)}{event.description.length > 100 ? '...' : ''}
        </p>

        {/* Attendees */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          paddingTop: '12px',
          borderTop: '1px solid #e5e7eb',
          fontSize: '13px',
          color: '#666'
        }}>
          <Users size={16} />
          <span>{event.attendees.length} attending</span>
        </div>
      </div>
    </div>
  );
}
