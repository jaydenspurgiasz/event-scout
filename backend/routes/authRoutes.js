import express from "express";
import { register, login, logout, verify } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register a new user
router.post("/register", register);

// Login an existing user
router.post("/login", login);

// Logout a currently logged in user
router.post("/logout", logout);

// Get current authenticated user's info
router.get("/me", protect, verify);

export default router;
