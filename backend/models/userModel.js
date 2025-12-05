import db from "../config/database.js";

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

export const getAuthCredentials = (email) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT id, email, name FROM users WHERE email = ?", [email], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT id, email, name FROM users WHERE id = ?", [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

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

/**
 * Get user profile including:
 * - Basic user info and friend count
 * - Friendship status with requesting user (none/pending/accepted)
 * - Whether request was initiated by requester or target
 * - Events the target user is attending (filtered by privacy rules)
 */
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
