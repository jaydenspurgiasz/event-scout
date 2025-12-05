import db from "../config/database.js";

/**
 * Ensures consistent ordering of user IDs in friend relationships
 * Friendships are stored bidirectionally (A->B and B->A are the same relationship),
 * so we always store with the smaller ID first to prevent duplicates and simplify queries
 */
const getFriendOrder = (userId, friendId) => {
  if (userId < friendId) {
    return [userId, friendId];
  }
  return [friendId, userId];
}

/**
 * Send a friend request from userId to friendId
 * If friendId already sent a request to userId, automatically accept it (mutual friend request)
 * Otherwise, creates a new pending request
 */
export const sendFriendRequest = (userId, friendId) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM friends WHERE user_id = ? AND friend_id = ? AND status = 'pending'",
      [friendId, userId],
      (err, row) => {
      if (err) return reject(err);
      if (row) {
        return acceptFriendRequest(userId, friendId).then(resolve).catch(reject);
      } else {
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

/**
 * Accept a friend request. The request must exist from friendId -> userId
 * Deletes the pending request and creates an accepted friendship with consistent ordering
 */
export const acceptFriendRequest = (userId, friendId) => {
  return new Promise((resolve, reject) => {
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

export const rejectFriendRequest = (userId, friendId) => {
  return new Promise((resolve, reject) => {
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

export const deleteFriend = (userId, friendId) => {
  return new Promise((resolve, reject) => {
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

export const getFriends = (userId) => {
  return new Promise((resolve, reject) => {
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

export const getFriendRequests = (userId) => {
  return new Promise((resolve, reject) => {
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

