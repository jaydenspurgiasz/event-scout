import express from "express";
import { register, login, logout, verify } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// API endpoint for user signup
router.post("/register", register);

// API endpoint for user signin
router.post("/login", login);

// API endpoint for user logout
router.post("/logout", logout);

// API endpoint to get current authenticated user info
router.get("/me", protect, verify);

export default router;
