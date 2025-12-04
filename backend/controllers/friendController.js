import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, deleteFriend, getFriends, getFriendRequests, getUsersByName } from "../models/db.js";

export const sendRequest = async (req, res) => {
    const id = req.user.id;
    const { friendId } = req.body;
    try {
        await sendFriendRequest(id, friendId);
        res.status(200).json({ message: "Friend request sent" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to send friend request" });
    }
};

export const acceptRequest = async (req, res) => {
    const id = req.user.id;
    const { friendId } = req.body;
    try {
        await acceptFriendRequest(id, friendId);
        res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to accept friend request" });
    }
};

export const rejectRequest = async (req, res) => {
    const id = req.user.id;
    const { friendId } = req.body;
    try {
        await rejectFriendRequest(id, friendId);
        res.status(200).json({ message: "Friend request rejected" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to reject friend request" });
    }
};

export const removeFriend = async (req, res) => {
    const id = req.user.id;
    const { friendId } = req.body;
    try {
        await deleteFriend(id, friendId);
        res.status(200).json({ message: "Friend removed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to remove friend" });
    }
};

export const getAllFriends = async (req, res) => {
    const id = req.user.id;
    try {
        const friends = await getFriends(id);
        res.status(200).json(friends);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get friends" });
    }
};

export const getRequests = async (req, res) => {
    const id = req.user.id;
    try {
        const requests = await getFriendRequests(id);
        res.status(200).json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get friend requests" });
    }
};

export const searchFriendsByName = async (req, res) => {
    const {name} = req.body;
    try {
        const rows = await getUsersByName(name);
        if (rows) {
            const user = rows.map(row => ({
                id: row.id,
                first_name: row.first_name,
                last_name: row.last_name,
                email: row.email
            }));
            return res.status(200).json(user);
        }
        return res.status(404).json({ error: "Users not found" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};