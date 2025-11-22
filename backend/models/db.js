import db from "../config/database.js";

// Initialize database tables if dont exist yet
export const initializeDatabase = async () => {
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      date DATETIME NOT NULL,
      location TEXT,
      user_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS friends (
      user_id INTEGER,
      friend_id INTEGER,
      status TEXT CHECK(status IN ('pending', 'accepted')),
      friended_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, friend_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (friend_id) REFERENCES users(id)
    )`
  ];

  for (const sql of tables) {
    await new Promise((resolve, reject) => {
      db.run(sql, (err) => {
        if (err) reject(err);
        else resolve();
      })
    });
  }
};

// Add a user
export const createUser = (email, password, firstName, lastName) => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)",
      [email, password, firstName, lastName],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
};

// Get user by email
export const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Add an event
export const createEvent = (title, description, date, location, userId) => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO events (title, description, date, location, user_id) VALUES (?, ?, ?, ?, ?)",
      [title, description, date, location, userId],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
};

// Get all events
export const getEvents = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM events", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Get event by id
export const getEventById = (id) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM events WHERE id = ?", [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Get events by title
export const getEventsByTitle = (title) => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM events WHERE title = ?", [title], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Send Friend Request
export const sendFriendRequest = (userId, friendId) => {
  return new Promise((resolve, reject) => {
    // Check for reverse pending request
    db.get(
      "SELECT * FROM friends WHERE user_id = ? AND friend_id = ? AND status = 'pending'",
      [friendId, userId],
      (err, row) => {
        if (err) return reject(err);

        if (row) {
          // Mutual request - accept both
          const now = new Date().toISOString();
          db.serialize(() => {
            db.run(
              "UPDATE friends SET status = 'accepted', friended_at = ? WHERE user_id = ? AND friend_id = ?",
              [now, friendId, userId]
            );
            db.run(
              "INSERT INTO friends (user_id, friend_id, status, friended_at) VALUES (?, ?, 'accepted', ?)",
              [userId, friendId, now],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          });
        } else {
          // Normal request
          db.run(
            "INSERT INTO friends (user_id, friend_id, status, friended_at) VALUES (?, ?, 'pending', CURRENT_TIMESTAMP)",
            [userId, friendId],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        }
      }
    );
  });
};

// Accept Friend Request
export const acceptFriendRequest = (userId, friendId) => {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString();
    db.serialize(() => {
      // Update existing request
      db.run(
        "UPDATE friends SET status = 'accepted', friended_at = ? WHERE user_id = ? AND friend_id = ?",
        [now, friendId, userId]
      );
      // Create reverse relationship
      db.run(
        "INSERT INTO friends (user_id, friend_id, status, friended_at) VALUES (?, ?, 'accepted', ?)",
        [userId, friendId, now],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  });
};

// Reject Friend Request
export const rejectFriendRequest = (userId, friendId) => {
  return new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM friends WHERE user_id = ? AND friend_id = ?",
      [friendId, userId],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};

// Remove Friend
export const removeFriend = (userId, friendId) => {
  return new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)",
      [userId, friendId, friendId, userId],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};

// Get Friends
export const getFriends = (userId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT u.id, u.email, u.first_name, u.last_name 
       FROM users u 
       JOIN friends f ON u.id = f.friend_id 
       WHERE f.user_id = ? AND f.status = 'accepted'`,
      [userId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

// Get Friend Requests
export const getFriendRequests = (userId) => {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM friends WHERE friend_id = ? AND status = 'pending'",
      [userId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};
