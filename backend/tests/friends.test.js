import sqlite3 from 'sqlite3';
import { jest } from '@jest/globals';

const db = new sqlite3.Database(':memory:');

jest.unstable_mockModule('../config/database.js', () => ({
  default: db
}));

const {
  initializeDatabase,
  createUser,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  getFriendRequests,
  removeFriend
} = await import('../models/db.js');

beforeEach(async () => {
  await initializeDatabase();
});

afterAll((done) => {
  db.close(done);
});

describe('Friends System', () => {
  let user1, user2, user3;

  beforeEach(async () => {
    const timestamp = Date.now();
    user1 = await createUser(`user1_${timestamp}@test.com`, 'pass', 'User', 'One');
    user2 = await createUser(`user2_${timestamp}@test.com`, 'pass', 'User', 'Two');
    user3 = await createUser(`user3_${timestamp}@test.com`, 'pass', 'User', 'Three');
  });

  test('Send Friend Request', async () => {
    await sendFriendRequest(user1, user2);
    
    const requests = await getFriendRequests(user2);
    expect(Array.isArray(requests)).toBe(true);
    expect(requests.length).toBe(1);
    expect(requests[0].user_id).toBe(user1);
    expect(requests[0].status).toBe('pending');
  });

  test('Accept Friend Request', async () => {
    await sendFriendRequest(user1, user2);
    await acceptFriendRequest(user2, user1);

    const friends1 = await getFriends(user1);
    const friends2 = await getFriends(user2);

    expect(Array.isArray(friends1)).toBe(true);
    expect(friends1.length).toBe(1);
    expect(friends1[0].id).toBe(user2);

    expect(Array.isArray(friends2)).toBe(true);
    expect(friends2.length).toBe(1);
    expect(friends2[0].id).toBe(user1);
  });

  test('Reject Friend Request', async () => {
    await sendFriendRequest(user1, user2);
    await rejectFriendRequest(user2, user1);

    const requests = await getFriendRequests(user2);
    expect(requests.length).toBe(0);
  });

  test('Mutual Request Auto-Accept', async () => {
    await sendFriendRequest(user1, user2);
    await sendFriendRequest(user2, user1);

    const friends1 = await getFriends(user1);
    const friends2 = await getFriends(user2);

    expect(friends1.length).toBe(1);
    expect(friends1[0].id).toBe(user2);
    expect(friends2.length).toBe(1);
    expect(friends2[0].id).toBe(user1);
  });

  test('Remove Friend', async () => {
    await sendFriendRequest(user1, user2);
    await acceptFriendRequest(user2, user1);
    
    await removeFriend(user1, user2);

    const friends1 = await getFriends(user1);
    const friends2 = await getFriends(user2);

    expect(friends1.length).toBe(0);
    expect(friends2.length).toBe(0);
  });

  test('Get Pending Requests', async () => {
    await sendFriendRequest(user1, user2);
    await sendFriendRequest(user3, user2);

    const requests = await getFriendRequests(user2);
    expect(requests.length).toBe(2);
  });
});
