import db from "../config/database.js";

export const getEventDetails = (req, res) => {
  const { id } = req.params;
  
  db.get(
    "SELECT id, title, description FROM events WHERE id = ?",
    [id],
    (err, event) => {
      if (err) {
        return res.status(500).json({ message: "Error: could not retrieve event details" });
      }
      if (!event) {
        return res.status(404).json({ message: "No event found" });
      }
      res.status(200).json({
        id: event.id,
        name: event.title,
        description: event.description
      });
    }
  );
};

export const getEventParticipants = (req, res) => {
  const { id } = req.params;
  
  db.all(
    `SELECT p.id, p.user_id, p.created_at, u.email 
     FROM participants p
     JOIN users u ON p.user_id = u.id
     WHERE p.event_id = ?
     ORDER BY p.created_at ASC`,
    [id],
    (err, participants) => {
      if (err) {
        return res.status(500).json({ message: "Error: could not retrieve event participants" });
      }
      res.status(200).json({ participants: participants || [] });
    }
  );
};

