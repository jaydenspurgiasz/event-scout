import db from "../config/database.js";

export const saveMessage = (eventId, userId, message, callback, database = db) => {
  if (!message || message.trim() === "") {
    return callback(new Error("Message cannot be empty"), null);
  }

  database.run(
    "INSERT INTO messages (event_id, user_id, message) VALUES (?, ?, ?)",
    [eventId, userId, message],
    function(err) {
      if (err) {
        return callback(err, null);
      }
      callback(null, this.lastID);
    }
  );
};

export const getMessages = (eventId, callback, database = db) => {
  database.all(
    `SELECT m.id, m.message, m.created_at, u.email 
     FROM messages m
     JOIN users u ON m.user_id = u.id
     WHERE m.event_id = ?
     ORDER BY m.created_at ASC`,
    [eventId],
    (err, messages) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, messages || []);
    }
  );
};
