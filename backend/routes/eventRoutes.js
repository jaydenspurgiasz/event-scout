import express from "express";
import {addEvent, searchEvents, searchEventById, searchEventsByTitle, getEventParticipants, rsvpUserToEvent, unRsvpUserFromEvent} from "../controllers/eventController.js";
import {protect, optionalAuth} from "../middleware/authMiddleware.js";

const router = express.Router();

// Create an event
router.post("/create", protect, addEvent);

// Get all events
router.get("/search", optionalAuth, searchEvents);

// RSVP user to an event
router.post("/:id/rsvp", protect, rsvpUserToEvent);

// unRSVP user from an event
router.delete("/:id/rsvp", protect, unRsvpUserFromEvent);

// Get events by title
router.get("/search/title", optionalAuth, searchEventsByTitle);

// Get event details by ID
router.get("/:id", optionalAuth, searchEventById);

// Get event participants by ID
router.get("/:id/participants", optionalAuth, getEventParticipants);

export default router;
