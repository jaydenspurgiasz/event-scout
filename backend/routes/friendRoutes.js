import express from "express";
import { sendRequest, acceptRequest, rejectRequest, removeFriend, getAllFriends, getRequests } from "../controllers/friendController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // Need to be logged in to use these routes

// Send friend request
router.post("/send", sendRequest);

// Accept friend request
router.post("/accept", acceptRequest);

// Reject friend request
router.post("/reject", rejectRequest);

// Remove friend
router.post("/remove", removeFriend);

// Get friends
router.get("/friends", getAllFriends);

// Get friend requests
router.get("/requests", getRequests);

export default router;
