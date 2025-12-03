import express from "express";
import {addEvent, searchEvents, searchEventById, searchEventsByTitle, getEventDetails, getEventParticipants} from "../controllers/eventController.js";
import {protect, optionalAuth} from "../middleware/authMiddleware.js";

const router = express.Router();

// Create an event
router.post("/create", protect, addEvent);

// Get all events
router.get("/search", optionalAuth, searchEvents);

// Get events by title
router.get("/search/title", protect, searchEventsByTitle);

// Get event details (from main branch)
router.get("/event/:id", getEventDetails);

// Get event participants (from main branch)
router.get("/event/:id/participants", getEventParticipants);

// Get event by id (must come after more specific routes)
router.get("/:id", protect, searchEventById);

export default router;
