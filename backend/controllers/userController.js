import { getUserByEmail, getUsersByName, getAllUsers, getUserProfile } from "../models/userModel.js";

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

export const searchUsers = async (req, res) => {
    try {
        const rows = await getAllUsers();
        return res.status(200).json(rows);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export const searchUserById = async (req, res) => {
    const { id } = req.params;
    const reqId = req.user.id;

    try {
        const profile = await getUserProfile(id, reqId);
        if (profile) {
            return res.status(200).json(profile);
        }
        return res.status(404).json({ error: "User not found" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
