import sqlite3 from 'sqlite3';
import { jest } from '@jest/globals';

const db = new sqlite3.Database(':memory:');

jest.unstable_mockModule('../config/database.js', () => ({
  default: db
}));

const {
  initializeDatabase,
  createUser,
  getUserByEmail,
  createEvent,
  getEvents,
  getEventById,
  getEventsByTitle
} = await import('../models/db.js');

beforeAll(async () => {
  await initializeDatabase();
});

afterAll((done) => {
  db.close(done);
});

describe('Database Operations', () => {
  describe('User Operations', () => {
    test('Create a User', async () => {
      const userId = await createUser('test@example.com', 'password123', 'John', 'Doe');
      expect(userId).toBeDefined();
      expect(typeof userId).toBe('number');
    });

    test('Reject Duplicate Email', async () => {
      await expect(createUser('test@example.com', 'password!', 'Jane', 'Doe'))
        .rejects.toThrow();
    });

    test('Retrieve User by Email', async () => {
      const user = await getUserByEmail('test@example.com');
      expect(user).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user.first_name).toBe('John');
    });

    test('No User Found', async () => {
      const user = await getUserByEmail('someguy@example.com');
      expect(user).toBeUndefined();
    });
  });

  describe('Event Operations', () => {
    let userId;

    beforeAll(async () => {
      userId = await createUser('eventhost@example.com', 'pass', 'Host');
    });

    test('Create an Event', async () => {
      const eventId = await createEvent(
        'Test Event',
        'Description',
        '2025-11-22',
        'Cool Location',
        userId
      );
      expect(eventId).toBeDefined();
      expect(typeof eventId).toBe("number");
    });

    test('Get All Events', async () => {
      const events = await getEvents();
      expect(Array.isArray(events)).toBe(true);
      expect(events.length).toBeGreaterThan(0);
      expect(events[0]).toHaveProperty('title');
    });

    test('Get Event by ID', async () => {
      const eventId = await createEvent(
        'Cool Event',
        'Desc.',
        '2025-11-25',
        'Location',
        userId
      );
      const event = await getEventById(eventId);
      expect(event).toBeDefined();
      expect(event.title).toBe('Cool Event');
    });

    test('Get Non-Existent Event by ID', async () => {
      const event = await getEventById(99999);
      expect(event).toBeUndefined();
    });

    test('Get Events by Title', async () => {
      await createEvent('Party', 'Desc', '2025-12-01', 'Loc', userId);
      const events = await getEventsByTitle('Party');
      expect(Array.isArray(events)).toBe(true);
      expect(events.length).toBeGreaterThan(0);
      expect(events[0].title).toBe('Party');
    });

    test('Get Non-Existent Events by Title', async () => {
      const events = await getEventsByTitle('Nonexistent Event');
      expect(Array.isArray(events)).toBe(true);
      expect(events.length).toBe(0);
    });
  });
});
