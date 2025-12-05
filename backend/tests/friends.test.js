/*

THIS FILE IS AI GENERATED

Model: Claude Code, Sonnet 4.5

Prompt:
Role: You are a senior software engineer who specializes in Test-Driven Development and backend APIs. Your job is to write high-quality tests based on the information provided.
Task: Generate a complete test suite using jest for the functions regarding friends in models/db.js. These functions are clearly labeled under a comment saying "Friend Methods". Do not write any implementation or production code and do not assume any logic for the function. Leave a brief comment detailing the purpose of each test case.


Output:
Because I used Claude Code, the output was not text but the model directly created and editied this file.
Thus, the output of the model is the file seen here.


NOTE: The test were generated when the query methods regarding friends were still in db.js,
but we later refactored them into their own model files.
*/

import sqlite3 from "sqlite3";
import { jest } from "@jest/globals";

const db = new sqlite3.Database(":memory:");

jest.unstable_mockModule("../config/database.js", () => ({
  default: db,
}));

const { initializeDatabase } = await import("../models/db.js");
const { createUser } = await import("../models/userModel.js");
const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  getFriendRequests,
  deleteFriend,
} = await import("../models/friendModel.js");

beforeEach(async () => {
  await initializeDatabase();
  // Clear friends table to avoid errors with uniqueness between tests
  await new Promise((resolve, reject) => {
    db.run("DELETE FROM friends", (err) => (err ? reject(err) : resolve()));
  });
  await new Promise((resolve, reject) => {
    db.run("DELETE FROM users", (err) => (err ? reject(err) : resolve()));
  });
});

afterAll((done) => {
  db.close(done);
});

describe("Friends System", () => {
  let user1, user2, user3;

  beforeEach(async () => {
    const timestamp = Date.now();
    user1 = await createUser(
      `user1_${timestamp}@test.com`,
      "pass",
      "User",
      "One"
    );
    user2 = await createUser(
      `user2_${timestamp}@test.com`,
      "pass",
      "User",
      "Two"
    );
    user3 = await createUser(
      `user3_${timestamp}@test.com`,
      "pass",
      "User",
      "Three"
    );
  });

  // Send a friend request and verify it appears in pending requests
  test("Send Friend Request", async () => {
    await sendFriendRequest(user1, user2);

    const requests = await getFriendRequests(user2);
    expect(Array.isArray(requests)).toBe(true);
    expect(requests.length).toBe(1);
    expect(requests[0].user_id).toBe(user1);
    expect(requests[0].status).toBe("pending");
  });

  // Accept a friend request and verify both users are friends
  test("Accept Friend Request", async () => {
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

  // Reject a friend request and verify it's removed from pending
  test("Reject Friend Request", async () => {
    await sendFriendRequest(user1, user2);
    await rejectFriendRequest(user2, user1);

    const requests = await getFriendRequests(user2);
    expect(requests.length).toBe(0);
  });

  // Send mutual friend requests and verify auto-acceptance
  test("Mutual Request Auto-Accept", async () => {
    await sendFriendRequest(user1, user2);
    await sendFriendRequest(user2, user1);

    const friends1 = await getFriends(user1);
    const friends2 = await getFriends(user2);

    expect(friends1.length).toBe(1);
    expect(friends1[0].id).toBe(user2);
    expect(friends2.length).toBe(1);
    expect(friends2[0].id).toBe(user1);
  });

  // Remove a friend and verify both sides are updated
  test("Remove Friend", async () => {
    await sendFriendRequest(user1, user2);
    await acceptFriendRequest(user2, user1);

    await deleteFriend(user1, user2);

    const friends1 = await getFriends(user1);
    const friends2 = await getFriends(user2);

    expect(friends1.length).toBe(0);
    expect(friends2.length).toBe(0);
  });

  // Verify multiple pending requests are tracked correctly
  test("Get Pending Requests", async () => {
    await sendFriendRequest(user1, user2);
    await sendFriendRequest(user3, user2);

    const requests = await getFriendRequests(user2);
    expect(requests.length).toBe(2);
  });
});
