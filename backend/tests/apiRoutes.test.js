process.env.JWT_SECRET = 'test_secret_key_12345';

import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import cookieParser from 'cookie-parser';

jest.unstable_mockModule('../models/db.js', () => ({
  createUser: jest.fn(),
  getUserByEmail: jest.fn(),
  getUsersByName: jest.fn(),
  createEvent: jest.fn(),
  getPublicEvents: jest.fn(),
  getAllEvents: jest.fn(),
  getEventById: jest.fn(),
  getEventsByTitle: jest.fn(),
  sendFriendRequest: jest.fn(),
  acceptFriendRequest: jest.fn(),
  rejectFriendRequest: jest.fn(),
  deleteFriend: jest.fn(),
  getFriends: jest.fn(),
  getFriendRequests: jest.fn(),
}));

jest.unstable_mockModule('bcrypt', () => ({
  default: {
    hashSync: jest.fn().mockReturnValue('hashed_password'),
    compareSync: jest.fn(),
  }
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    sign: jest.fn().mockReturnValue('mock_token'),
    verify: jest.fn().mockReturnValue({ id: 1, email: 'test@example.com' }),
  }
}));

const db = await import('../models/db.js');
const bcrypt = (await import('bcrypt')).default;
const jwt = (await import('jsonwebtoken')).default;
const apiRoutes = (await import('../routes/apiRoutes.js')).default;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api', apiRoutes);

describe('API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Auth Routes', () => {
    // Should register a new user successfully
    test('POST /api/auth/register - successful registration', async () => {
      db.createUser.mockResolvedValue(1);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          pass: 'password123',
          firstName: 'John',
          lastName: 'Doe'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'User created' });
    });

    // Should reject registration with existing email
    test('POST /api/auth/register - email already exists', async () => {
      db.createUser.mockRejectedValue(new Error('Email exists'));

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'existing@example.com',
          pass: 'password123',
          firstName: 'Jane',
          lastName: 'Doe'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Email already in use' });
    });

    // Should login successfully with valid credentials
    test('POST /api/auth/login - successful login', async () => {
      db.getUserByEmail.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashed_password'
      });
      bcrypt.compareSync.mockReturnValue(true);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          pass: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Login successful' });
    });

    // Should reject login with invalid email
    test('POST /api/auth/login - invalid email', async () => {
      db.getUserByEmail.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          pass: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Invalid email or password' });
    });

    // Should reject login with invalid password
    test('POST /api/auth/login - invalid password', async () => {
      db.getUserByEmail.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashed_password'
      });
      bcrypt.compareSync.mockReturnValue(false);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          pass: 'wrongpassword'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Invalid email or password' });
    });
  });

  describe('User Routes', () => {
    // Should return user ID by email
    test('POST /api/user/search/email - user found', async () => {
      db.getUserByEmail.mockResolvedValue({ id: 1 });

      const response = await request(app)
        .post('/api/user/search/email')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 1 });
    });

    // Should return 404 when user not found by email
    test('POST /api/user/search/email - user not found', async () => {
      db.getUserByEmail.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/user/search/email')
        .send({ email: 'nonexistent@example.com' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'User not found' });
    });

    // Should return array of user IDs by name
    test('POST /api/user/search/name - users found', async () => {
      db.getUsersByName.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      const response = await request(app)
        .post('/api/user/search/name')
        .send({ name: 'John' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id: 1 }, { id: 2 }]);
    });

    // Should return 404 when no users found by name
    test('POST /api/user/search/name - users not found', async () => {
      db.getUsersByName.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/user/search/name')
        .send({ name: 'NonexistentName' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Users not found' });
    });
  });

  describe('Event Routes', () => {
    // Should create an event for authenticated user
    test('POST /api/event/create - create event', async () => {
      jwt.verify.mockReturnValue({ id: 1, email: 'test@example.com' });
      db.createEvent.mockResolvedValue({ id: 1, title: 'Test Event' });

      const response = await request(app)
        .post('/api/event/create')
        .set('Cookie', 'token=mock_token')
        .send({
          title: 'Test Event',
          description: 'Description',
          date: '2025-01-01',
          location: 'Test Location',
          priv: false
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: 1, title: 'Test Event' });
    });

    // Should return public events for unauthenticated user
    test('GET /api/event/search - get public events without auth', async () => {
      db.getPublicEvents.mockResolvedValue([{ id: 1, title: 'Public Event' }]);

      const response = await request(app)
        .get('/api/event/search');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id: 1, title: 'Public Event' }]);
    });

    // Should return all events for authenticated user
    test('GET /api/event/search - get all events with auth', async () => {
      jwt.verify.mockReturnValue({ id: 1, email: 'test@example.com' });
      db.getAllEvents.mockResolvedValue([{ id: 1, title: 'Event 1' }, { id: 2, title: 'Event 2' }]);

      const response = await request(app)
        .get('/api/event/search')
        .set('Cookie', 'token=mock_token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id: 1, title: 'Event 1' }, { id: 2, title: 'Event 2' }]);
    });

    // Should return event by ID for authenticated user
    test('GET /api/event/:id - get event by ID', async () => {
      jwt.verify.mockReturnValue({ id: 1, email: 'test@example.com' });
      db.getEventById.mockResolvedValue({ id: 1, title: 'Test Event' });

      const response = await request(app)
        .get('/api/event/1')
        .set('Cookie', 'token=mock_token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 1, title: 'Test Event' });
    });

    // Should return events matching title search
    test('GET /api/event/search/title - search events by title', async () => {
      jwt.verify.mockReturnValue({ id: 1, email: 'test@example.com' });
      db.getEventsByTitle.mockResolvedValue([{ id: 1, title: 'Test Event' }]);

      const response = await request(app)
        .get('/api/event/search/title')
        .query({ title: 'Test' })
        .set('Cookie', 'token=mock_token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id: 1, title: 'Test Event' }]);
    });
  });

  describe('Friend Routes', () => {
    // Should send friend request successfully
    test('POST /api/friend/send - send friend request', async () => {
      jwt.verify.mockReturnValue({ id: 1, email: 'test@example.com' });
      db.sendFriendRequest.mockResolvedValue(true);

      const response = await request(app)
        .post('/api/friend/send')
        .set('Cookie', 'token=mock_token')
        .send({ friendId: 2 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Friend request sent' });
    });

    // Should accept friend request successfully
    test('POST /api/friend/accept - accept friend request', async () => {
      jwt.verify.mockReturnValue({ id: 1, email: 'test@example.com' });
      db.acceptFriendRequest.mockResolvedValue(true);

      const response = await request(app)
        .post('/api/friend/accept')
        .set('Cookie', 'token=mock_token')
        .send({ friendId: 2 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Friend request accepted' });
    });

    // Should reject friend request successfully
    test('POST /api/friend/reject - reject friend request', async () => {
      jwt.verify.mockReturnValue({ id: 1, email: 'test@example.com' });
      db.rejectFriendRequest.mockResolvedValue(true);

      const response = await request(app)
        .post('/api/friend/reject')
        .set('Cookie', 'token=mock_token')
        .send({ friendId: 2 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Friend request rejected' });
    });

    // Should remove friend successfully
    test('POST /api/friend/remove - remove friend', async () => {
      jwt.verify.mockReturnValue({ id: 1, email: 'test@example.com' });
      db.deleteFriend.mockResolvedValue(true);

      const response = await request(app)
        .post('/api/friend/remove')
        .set('Cookie', 'token=mock_token')
        .send({ friendId: 2 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Friend removed' });
    });

    // Should return list of friends
    test('GET /api/friend/friends - get friends list', async () => {
      jwt.verify.mockReturnValue({ id: 1, email: 'test@example.com' });
      db.getFriends.mockResolvedValue([{ id: 2 }, { id: 3 }]);

      const response = await request(app)
        .get('/api/friend/friends')
        .set('Cookie', 'token=mock_token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id: 2 }, { id: 3 }]);
    });

    // Should return list of friend requests
    test('GET /api/friend/requests - get friend requests', async () => {
      jwt.verify.mockReturnValue({ id: 1, email: 'test@example.com' });
      db.getFriendRequests.mockResolvedValue([{ id: 4 }, { id: 5 }]);

      const response = await request(app)
        .get('/api/friend/requests')
        .set('Cookie', 'token=mock_token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id: 4 }, { id: 5 }]);
    });
  });
});
