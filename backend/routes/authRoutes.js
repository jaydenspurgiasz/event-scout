import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// API endpoint for user signup
router.post("/register", register);

// API endpoint for user signin
router.post("/login", login);

export default router;
