/*

THIS FILE IS AI GENERATED

Model: Claude Code, Sonnet 4.5

Prompt:
Role: You are a senior software engineer who specializes in Test-Driven Development and backend APIs. Your job is to write high-quality tests based on the information provided.
Task: Generate a complete test suite using jest for the functions in models/db.js. Do not write any implementation or production code and do not assume any logic for the function. Leave a brief comment detailing the purpose of each test case.


Output:
Because I used Claude Code, the output was not text but the model directly created and editied this file.
Thus, the output of the model is the file seen here.

NOTE: The tests were generated when I was developing the db.js file, but later on(after implementation),
we decided to distribute the db.js methods across three different model files for better organization.
Additionaly, this was testing all the methods that existed in db.js before we implemented the friend feature. Which was a design oversight.

*/

import sqlite3 from "sqlite3";
import { jest } from "@jest/globals";

const db = new sqlite3.Database(":memory:");

jest.unstable_mockModule("../config/database.js", () => ({
  default: db,
}));

const { initializeDatabase } = await import("../models/db.js");
const { createUser, getUserByEmail } = await import("../models/userModel.js");
const {
  createEvent,
  getPublicEvents,
  getAllEvents,
  getEventById,
  getEventsByTitle,
} = await import("../models/eventModel.js");

beforeAll(async () => {
  await initializeDatabase();
});

afterAll((done) => {
  db.close(done);
});

describe("Database Operations", () => {
  describe("User Operations", () => {
    // Create a new user successfully
    test("Create a User", async () => {
      const userId = await createUser(
        "test@example.com",
        "password123",
        "John",
        "Doe"
      );
      expect(userId).toBeDefined();
      expect(typeof userId).toBe("number");
    });

    // Reject duplicate email registration
    test("Reject Duplicate Email", async () => {
      await expect(
        createUser("test@example.com", "password!", "Jane", "Doe")
      ).rejects.toThrow();
    });

    // Retrieve existing user by email
    test("Retrieve User by Email", async () => {
      const user = await getUserByEmail("test@example.com");
      expect(user).toBeDefined();
      expect(user.email).toBe("test@example.com");
      expect(user.name).toBe("John");
    });

    // Return undefined for non-existent user
    test("No User Found", async () => {
      const user = await getUserByEmail("someguy@example.com");
      expect(user).toBeUndefined();
    });
  });

  describe("Event Operations", () => {
    let userId;

    beforeAll(async () => {
      userId = await createUser(
        "eventhost@example.com",
        "pass",
        "Host",
        "User"
      );
    });

    // Create an event successfully
    test("Create an Event", async () => {
      const event = await createEvent(
        "Test Event",
        "Description",
        "2025-11-22",
        "Cool Location",
        false,
        userId
      );
      expect(event).toBeDefined();
      expect(event).toHaveProperty("id");
    });

    // Get all public events
    test("Get Public Events", async () => {
      const events = await getPublicEvents();
      expect(Array.isArray(events)).toBe(true);
      expect(events.length).toBeGreaterThan(0);
      expect(events[0]).toHaveProperty("title");
    });

    // Get all events for a user
    test("Get All Events for User", async () => {
      const events = await getAllEvents(userId);
      expect(Array.isArray(events)).toBe(true);
      expect(events.length).toBeGreaterThan(0);
    });

    // Get event by ID
    test("Get Event by ID", async () => {
      const newEvent = await createEvent(
        "Cool Event",
        "Desc.",
        "2025-11-25",
        "Location",
        false,
        userId
      );
      const event = await getEventById(newEvent.id, userId);
      expect(event).toBeDefined();
      expect(event.title).toBe("Cool Event");
    });

    // Get events by title search
    test("Get Events by Title", async () => {
      await createEvent("Party", "Desc", "2025-12-01", "Loc", false, userId);
      const events = await getEventsByTitle("Party", userId);
      expect(Array.isArray(events)).toBe(true);
      expect(events.length).toBeGreaterThan(0);
      expect(events[0].title).toBe("Party");
    });
  });
});
