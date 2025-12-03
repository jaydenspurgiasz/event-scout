import express from "express";
import {searchUserByEmail, searchUsersByName} from "../controllers/userController.js";

const router = express.Router();

// Get a user ID by their email
router.post("/search/email", searchUserByEmail);

// Get user IDs by name
router.post("/search/name", searchUsersByName);

export default router;
