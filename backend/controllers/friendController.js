import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, deleteFriend, getFriends, getFriendRequests } from "../models/db.js";

export const sendRequest = async (req, res) => {
    const id = req.user.id;
    const { friendId } = req.body;
    try {
        sendFriendRequest(id, friendId);
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
        acceptFriendRequest(id, friendId);
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
        rejectFriendRequest(id, friendId);
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
        deleteFriend(id, friendId);
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
