import db from "../config/database.js";

// Initialize database tables if dont exist yet
export const initializeDatabase = async () => {
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      date DATETIME NOT NULL,
      location TEXT,
      private BOOLEAN DEFAULT FALSE,
      user_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS friends (
      user_id INTEGER,
      friend_id INTEGER,
      status TEXT CHECK(status IN ('pending', 'accepted')),
      friended_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (user_id, friend_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (friend_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(event_id, user_id)
    )`,
    `CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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

  console.log("Database initialized successfully");
};

/*

User Methods

*/

// Add a user
export const createUser = (email, password, name) => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
      [email, password, name],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
};

// Get auth details for user (for login)
export const getAuthCredentials = (email) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Get user by email
export const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT id, email, name FROM users WHERE email = ?", [email], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Get user by ID
export const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT id, email, name FROM users WHERE id = ?", [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Get users by name
export const getUsersByName = (name) => {
  return new Promise((resolve, reject) => {
    db.all("SELECT id, email, name FROM users WHERE name = ?", [name], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT id, email, name FROM users", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

/*

Event Methods

*/

// Add an event
export const createEvent = (title, description, date, location, priv, userId) => {
  return new Promise((resolve, reject) => {
    db.run( 
      "INSERT INTO events (title, description, date, location, private, user_id) VALUES (?, ?, ?, ?, ?, ?)",
      [title, description, date, location, priv, userId],
      function (err) {
        if (err) reject(err);
        else resolve({id: this.lastID});
      }
    );
  });
};

// Get all events
export const getPublicEvents = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM events WHERE NOT private", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Get all events, given an authenticated user ID
export const getAllEvents = (userID) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT DISTINCT
        e.*
      FROM
        events e
      LEFT JOIN
        friends f ON (f.user_id = e.user_id AND f.friend_id = ?) OR (f.friend_id = e.user_id AND f.user_id = ?)
      WHERE
        NOT e.private
        OR f.user_id IS NOT NULL
        OR e.user_id = ?
    `;

    db.all(sql, [userID, userID, userID], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Get event by id
export const getEventById = (id, userID) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        e.*
      FROM
        events e
      LEFT JOIN
        friends f ON (f.user_id = e.user_id AND f.friend_id = ?) OR (f.friend_id = e.user_id AND f.user_id = ?)
      WHERE
        e.id = ?
        AND (
          NOT e.private
          OR f.user_id IS NOT NULL
          OR e.user_id = ?
        )
    `

    db.get(sql, [userID, userID, id, userID], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Get events by title
export const getEventsByTitle = (title, userID) => {
  return new Promise((resolve, reject) => {
    if (!userID) {
      // If no user ID, only return public events
      db.all("SELECT * FROM events WHERE title = ? AND NOT private", [title], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    } else {
      // If user ID provided, return public events or events from friends or own events
      const sql = `
        SELECT DISTINCT
          e.*
        FROM
          events e
        LEFT JOIN
          friends f ON (f.user_id = e.user_id AND f.friend_id = ?) OR (f.friend_id = e.user_id AND f.user_id = ?)
        WHERE
          e.title = ?
          AND (
            NOT e.private
            OR f.user_id IS NOT NULL
            OR e.user_id = ?
          )
      `;
      db.all(sql, [userID, userID, title, userID], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }
  });
}

// RSVP User to an event
export const addUserToEvent = (userId, eventId) => {
  return new Promise((resolve, reject) => {
    const checkSql = `
      SELECT 
        e.user_id AS host_id
      FROM 
        events e
      LEFT JOIN 
        friends f ON (f.user_id = e.user_id AND f.friend_id = ?) 
                  OR (f.friend_id = e.user_id AND f.user_id = ?)
      WHERE 
        e.id = ? 
        AND (
          NOT e.private
          OR e.user_id = ?
          OR f.user_id IS NOT NULL
        )
    `;

    db.get(checkSql, [userId, userId, eventId, userId], (err, row) => {
      if (err) return reject(err);
      if (!row) {
        return reject(new Error("Event not found."));
      }
      db.run(
        "INSERT OR IGNORE INTO participants (event_id, user_id) VALUES (?, ?)",
        [eventId, userId],
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  });
};

// Un-RSVP User from an event
export const removeUserFromEvent = (userId, eventId) => {
  return new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM participants WHERE event_id = ? AND user_id = ?",
      [eventId, userId],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

// Check Events User is attending
export const getEventsUserIsAttending = (reqId, userId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT 
        e.*
      FROM 
        events e
      INNER JOIN 
        participants p ON e.id = p.event_id
      LEFT JOIN 
        friends f ON (f.user_id = e.user_id AND f.friend_id = ?) 
                  OR (f.friend_id = e.user_id AND f.user_id = ?)
      WHERE 
        p.user_id = ?
        AND (
          NOT e.private
          OR e.user_id = ?
          OR f.user_id IS NOT NULL
        )`,
      [reqId, reqId, userId, reqId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

// Check all users attending an event
export const getAllEventParticipants = (requesterId, eventId) => {
  return new Promise((resolve, reject) => {
    const checkSql = `
      SELECT 
        e.user_id AS host_id
      FROM 
        events e
      LEFT JOIN 
        friends f ON (f.user_id = e.user_id AND f.friend_id = ?) 
                  OR (f.friend_id = e.user_id AND f.user_id = ?)
      WHERE 
        e.id = ? 
        AND (
          NOT e.private
          OR e.user_id = ?
          OR f.user_id IS NOT NULL
        )
    `;

    db.get(checkSql, [requesterId, requesterId, eventId, requesterId], (err, row) => {
      if (err) return reject(err);
      if (!row) {
        return reject(new Error("Event not found."));
      }
      db.all(
        `
        SELECT
          u.id,
          u.email,
          u.name,
          p.created_at
        FROM
          users u
        JOIN
          participants p ON u.id = p.user_id
        WHERE
          p.event_id = ?
        `,
        [eventId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  });
};

/*
 
Friend Methods
 
*/


// Determine standard order of IDs in friend table
const getFriendOrder = (userId, friendId) => {
  // Smaller user ID first
  if (userId < friendId) {
    return [userId, friendId];
  }
  return [friendId, userId];
}

// Send Friend Request
export const sendFriendRequest = (userId, friendId) => {
  return new Promise((resolve, reject) => {
    // Check for pending request
    db.get(
      "SELECT * FROM friends WHERE user_id = ? AND friend_id = ? AND status = 'pending'",
      [friendId, userId],
      (err, row) => {
      if (err) return reject(err);
      if (row) {
        return acceptFriendRequest(userId, friendId).then(resolve).catch(reject);
      } else {
        // Send request
        db.run(
          "INSERT OR IGNORE INTO friends (user_id, friend_id, status, friended_at) VALUES (?, ?, 'pending', CURRENT_TIMESTAMP)",
          [userId, friendId],
          (err) => {
            if (err) return reject(err);
            resolve();
          }
        )
      }
    }
  )
});
};

// Accept Friend Request
export const acceptFriendRequest = (userId, friendId) => {
  return new Promise((resolve, reject) => {
  // Needs to remove pending request and add accepted in order
  db.get(
    "SELECT * FROM friends WHERE user_id = ? AND friend_id = ? AND status = 'pending'",
    [friendId, userId],
    (err, row) => {
      if (err) return reject(err);
      if (!row) return reject(new Error("No pending request"));
      db.run(
        "DELETE FROM friends WHERE user_id = ? AND friend_id = ?",
        [friendId, userId],
        (err) => {
          if (err) return reject(err);
          db.run(
            "INSERT OR IGNORE INTO friends (user_id, friend_id, status, friended_at) VALUES (?, ?, 'accepted', CURRENT_TIMESTAMP)",
            getFriendOrder(userId, friendId),
            (err) => {
              if (err) return reject(err);
              resolve();
            }
          )
        }
      )
    }
  )
  });
};

// Reject Friend Request
export const rejectFriendRequest = (userId, friendId) => {
  return new Promise((resolve, reject) => {
  // If there is a pending request from the user, delete it
  db.run(
    "DELETE FROM friends WHERE user_id = ? AND friend_id = ? AND status = 'pending'",
    [friendId, userId],
    (err) => {
      if (err) return reject(err);
      resolve();
    }
  )
});
};

// Remove Friend
export const deleteFriend = (userId, friendId) => {
  return new Promise((resolve, reject) => {
  // If the users are friends or if there is a pending request, delete the entry 
  db.run(
    "DELETE FROM friends WHERE user_id = ? AND friend_id = ?",
    getFriendOrder(userId, friendId),
    (err) => {
      if (err) return reject(err);
      resolve();
    }
  )
});
};

// Get Friends
export const getFriends = (userId) => {
  return new Promise((resolve, reject) => {
  // Return all friends of the current user
  // Should return each friend's: id, name, friended_at
  db.all(
    `SELECT
      u.id, u.name, f.friended_at
    FROM
      users u
    JOIN
      friends f ON ((f.user_id = ? AND u.id = f.friend_id) OR (f.friend_id = ? AND u.id = f.user_id))
    WHERE
      f.status = 'accepted'
    `,
    [userId, userId],
    (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    }
  )
});
};

// Get Friend Requests
export const getFriendRequests = (userId) => {
  return new Promise((resolve, reject) => {
  // Return all friend requests to the current user
  db.all(
    `SELECT 
         f.user_id, 
         u.email, 
         u.name, 
         f.status,
         f.friended_at
       FROM
         users u
       JOIN 
         friends f ON u.id = f.user_id
       WHERE 
         f.friend_id = ? AND f.status = 'pending'`,
    [userId],
    (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    }
  )
});
};

// Get user profile info, friend status, and rsvped events
export const getUserProfile = (targetId, reqId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await new Promise((res, rej) => {
        const sql = `
          SELECT
            u.id,
            u.name,
            (SELECT COUNT(*) FROM friends WHERE (user_id = u.id OR friend_id = u.id) AND status = 'accepted') as friend_count,
            f.status as friendship_status,
            f.user_id as friend_init_id
          FROM users u
          LEFT JOIN
            friends f
            ON ((f.user_id = u.id AND f.friend_id = ?) OR (f.friend_id = u.id AND f.user_id = ?))
          WHERE u.id = ?
        `;
        db.get(sql, [reqId, reqId, targetId], (err, row) => {
          if (err) rej(err);
          else res(row);
        });
      });
      if (!user) return resolve(null);

      const events = await new Promise((res, rej) => {
        const sql = `
          SELECT DISTINCT e.*
          FROM events e
          INNER JOIN 
            participants p ON e.id = p.event_id 
          LEFT JOIN 
            friends f
            ON ((f.user_id = e.user_id AND f.friend_id = ?) OR (f.friend_id = e.user_id AND f.user_id = ?))
            AND f.status = 'accepted'
          WHERE 
            p.user_id = ?
          AND (
            NOT e.private
            OR e.user_id = ? 
            OR f.user_id IS NOT NULL
          )
        `;
        db.all(sql, [reqId, reqId, targetId, reqId], (err, rows) => {
          if (err) rej(err);
          else res(rows);
        });
      });

      resolve({
        id: user.id,
        name: user.name,
        friendCount: user.friend_count,
        isFriend: user.friendship_status === 'accepted',
        isPending: user.friendship_status === 'pending' && user.friend_init_id == reqId,
        isIncomingRequest: user.friendship_status === 'pending' && user.friend_init_id != reqId,
        events
      });
    } catch (err) {
      reject(err);
    }
  });
};
