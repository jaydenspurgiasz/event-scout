import { describe, it, expect, beforeAll } from "@jest/globals";
import sqlite3 from "sqlite3";
import { saveMessage, getMessages } from "../controllers/messageController.js";

let mockDb;

beforeAll((done) => {
  mockDb = new sqlite3.Database(":memory:", (err) => {
    if (err) {
      done(err);
      return;
    }
    
    mockDb.run(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        email TEXT
      )
    `);
    
    mockDb.run(`
      CREATE TABLE events (
        id INTEGER PRIMARY KEY,
        title TEXT
      )
    `);
    
    mockDb.run(`
      CREATE TABLE messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER,
        user_id INTEGER,
        message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, () => {
      mockDb.run("INSERT INTO users (id, email) VALUES (1, 'test@example.com')");
      mockDb.run("INSERT INTO events (id, title) VALUES (1, 'Test Event')", () => {
        done();
      });
    });
  });
});

describe("saveMessage", () => {
  it("should save a message", (done) => {
    saveMessage(1, 1, "Test message", mockDb, (err, messageId) => {
      expect(err).toBeNull();
      expect(messageId).toBeDefined();
      done();
    });
  });

  it("should return error if message is empty", (done) => {
    saveMessage(1, 1, "", mockDb, (err, messageId) => {
      expect(err).toBeDefined();
      done();
    });
  });
});

describe("getMessages", () => {
  it("should get messages for an event", (done) => {
    getMessages(1, mockDb, (err, messages) => {
      expect(err).toBeNull();
      expect(messages).toBeDefined();
      done();
    });
  });

  it("should return empty array if no messages", (done) => {
    getMessages(999, mockDb, (err, messages) => {
      expect(err).toBeNull();
      expect(messages.length).toBe(0);
      done();
    });
  });
});
