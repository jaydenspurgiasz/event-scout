import express from "express";
import {searchUserByEmail, searchUsersByName, searchUsers, searchUserById} from "../controllers/userController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

// Get a user ID by their email
router.post("/search/email", protect, searchUserByEmail);

// Get user IDs by name
router.post("/search/name", protect, searchUsersByName);

router.get("/search", protect, searchUsers);

// Get user profile by ID
router.get("/:id", protect, searchUserById);

export default router;
