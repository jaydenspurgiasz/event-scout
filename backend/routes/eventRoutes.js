import express from "express";
import {addEvent, searchEvents, searchEventById, searchEventsByTitle, getEventParticipants} from "../controllers/eventController.js";
import {protect, optionalAuth} from "../middleware/authMiddleware.js";

const router = express.Router();

// Create an event
router.post("/create", protect, addEvent);

// Get all events
router.get("/search", optionalAuth, searchEvents);

// Get events by title
router.get("/search/title", protect, searchEventsByTitle);

// Get event participants (must come before /:id route)
router.get("/:id/participants", protect, getEventParticipants);

// Get event by id
router.get("/:id", protect, searchEventById);

export default router;
