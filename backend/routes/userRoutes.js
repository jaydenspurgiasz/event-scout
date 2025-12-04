import express from "express";
import {searchUserByEmail, searchUsersByName, searchUsers} from "../controllers/userController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

// Get a user ID by their email
router.post("/search/email", protect, searchUserByEmail);

// Get user IDs by name
router.post("/search/name", protect, searchUsersByName);

router.get("/search", protect, searchUsers);

export default router;
