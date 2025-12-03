import { jest } from '@jest/globals';

jest.unstable_mockModule('../models/db.js', () => ({
  createEvent: jest.fn(),
  getPublicEvents: jest.fn(),
  getAllEvents: jest.fn(),
  getEventById: jest.fn(),
  getEventsByTitle: jest.fn(),
}));

const {
  createEvent,
  getPublicEvents,
  getAllEvents,
  getEventById,
  getEventsByTitle
} = await import('../models/db.js');

const {
  addEvent,
  searchEvents,
  searchEventById,
  searchEventsByTitle
} = await import('../controllers/eventController.js');

describe('Event Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: 1 },
      body: {},
      params: {},
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('addEvent', () => {
    // Successfully create a new event
    test('Create event successfully', async () => {
      req.body = {
        title: 'New Event',
        description: 'Desc',
        date: '2025-01-01',
        location: 'Loc',
        priv: false
      };
      const mockEvent = { id: 1, title: 'New Event' };
      createEvent.mockResolvedValue(mockEvent);

      await addEvent(req, res);

      expect(createEvent).toHaveBeenCalledWith(
        'New Event', 'Desc', '2025-01-01', 'Loc', false, 1
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockEvent);
    });

    // Handle errors when creating event
    test('Handle creation error', async () => {
      req.body = {
        title: 'New Event',
        description: 'Desc',
        date: '2025-01-01',
        location: 'Loc',
        priv: false
      };
      createEvent.mockRejectedValue(new Error('DB Error'));

      await addEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB Error' });
    });
  });

  describe('searchEvents', () => {
    // Return public events when user is not authenticated
    test('Get public events for unauthenticated user', async () => {
      req.user.id = null;
      const mockEvents = [{ id: 1, title: 'Public Event' }];
      getPublicEvents.mockResolvedValue(mockEvents);

      await searchEvents(req, res);

      expect(getPublicEvents).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockEvents);
    });

    // Return all events when user is authenticated
    test('Get all events for authenticated user', async () => {
      const mockEvents = [{ id: 1, title: 'Event 1' }, { id: 2, title: 'Event 2' }];
      getAllEvents.mockResolvedValue(mockEvents);

      await searchEvents(req, res);

      expect(getAllEvents).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockEvents);
    });

    // Handle errors when fetching public events
    test('Handle error fetching public events', async () => {
      req.user.id = null;
      getPublicEvents.mockRejectedValue(new Error('DB Error'));

      await searchEvents(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB Error' });
    });

    // Handle errors when fetching all events
    test('Handle error fetching all events', async () => {
      getAllEvents.mockRejectedValue(new Error('DB Error'));

      await searchEvents(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB Error' });
    });
  });

  describe('searchEventById', () => {
    // Return event by ID successfully
    test('Get event by ID', async () => {
      req.params = { id: '1' };
      const mockEvent = { id: 1, title: 'Event 1' };
      getEventById.mockResolvedValue(mockEvent);

      await searchEventById(req, res);

      expect(getEventById).toHaveBeenCalledWith('1', 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockEvent);
    });

    // Handle errors when fetching event by ID
    test('Handle error fetching event by ID', async () => {
      req.params = { id: '1' };
      getEventById.mockRejectedValue(new Error('DB Error'));

      await searchEventById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB Error' });
    });
  });

  describe('searchEventsByTitle', () => {
    // Return events matching title search
    test('Get events by title', async () => {
      req.query = { title: 'Test' };
      const mockEvents = [{ id: 1, title: 'Test Event' }];
      getEventsByTitle.mockResolvedValue(mockEvents);

      await searchEventsByTitle(req, res);

      expect(getEventsByTitle).toHaveBeenCalledWith('Test', 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockEvents);
    });

    // Handle errors when searching events by title
    test('Handle error searching events by title', async () => {
      req.query = { title: 'Test' };
      getEventsByTitle.mockRejectedValue(new Error('DB Error'));

      await searchEventsByTitle(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB Error' });
    });
  });
});
