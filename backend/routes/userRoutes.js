import express from "express";
import {searchUserByEmail, searchUsersByName, searchUserById, searchUsers} from "../controllers/userController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

// Get a user ID by their email
router.post("/search/email", protect, searchUserByEmail);

// Get user IDs by name
router.post("/search/name", protect, searchUsersByName);

// Get user profile by ID
router.get("/:id", protect, searchUserById);

// Get all users
router.get("/search", protect, searchUsers);

export default router;
