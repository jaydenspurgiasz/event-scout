import { getUserByEmail, getUsersByName } from "../models/db.js";

// Get a user ID by their email
export const searchUserByEmail = async (req, res) => {
    const {email} = req.body;
    try {
        const row = await getUserByEmail(email);
        if (row) {
            return res.status(200).json({ id: row.id });
        }
        return res.status(404).json({ error: "User not found" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Get user IDs by name
export const searchUsersByName = async (req, res) => {
    const {name} = req.body;
    try {
        const rows = await getUsersByName(name);
        if (rows) {
            return res.status(200).json(rows.map(row => ({id : row.id})));
        }
        return res.status(404).json({ error: "Users not found" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
