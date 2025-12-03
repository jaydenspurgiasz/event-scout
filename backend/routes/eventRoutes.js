import express from "express";
import {addEvent, searchEvents, searchEventById, searchEventsByTitle} from "../controllers/eventController.js";
import {protect, optionalAuth} from "../middleware/authMiddleware.js";

const router = express.Router();

// Create an event
router.post("/create", protect, addEvent);

// Get all events
router.get("/search", optionalAuth, searchEvents);

// Get event by id
router.get("/:id", protect, searchEventById);

// Get events by title
router.get("/search/title", protect, searchEventsByTitle);

export default router;
