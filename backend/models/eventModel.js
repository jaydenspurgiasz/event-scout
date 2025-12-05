import db from "../config/database.js";

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

export const getPublicEvents = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM events WHERE NOT private", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

/**
 * Get all events visible to a user
 * Visibility rules:
 * - Public events are visible to everyone
 * - Private events are visible if: user is the creator OR user is friends with the creator
 */
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

/**
 * RSVP a user to an event. First verifies the user can access the event based on visibility
 */
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

export const getUpcomingEventsWithParticipants = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT e.title, e.description, e.date, e.location, u.email
       FROM events e
       INNER JOIN participants p ON e.id = p.event_id
       INNER JOIN users u ON p.user_id = u.id
       WHERE e.date > datetime('now') AND e.date <= datetime('now', '+24 hours')`,
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};
