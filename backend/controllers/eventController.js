import { createEvent, getPublicEvents, getAllEvents, getEventById, getEventsByTitle, addUserToEvent, removeUserFromEvent, getAllEventParticipants, getEventsUserIsAttending } from "../models/eventModel.js";

export const addEvent = async (req, res) => {
    const { id } = req.user;
    const { title, description, date, location, priv } = req.body;

    try {
        const event = await createEvent(title, description, date, location, priv, id);
        res.status(201).json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Search events with different visibility based on authentication
 * Unauthenticated users: only public events
 * Authenticated users: public events + private events from friends + own private events
 */
export const searchEvents = async (req, res) => {
    if (req.user.id === null) {
        try {
            const events = await getPublicEvents();
            res.status(200).json(events);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else {
        try {
            const events = await getAllEvents(req.user.id);
            res.status(200).json(events);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

export const searchEventById = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await getEventById(id, req.user.id);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        res.status(200).json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const searchEventsByTitle = async (req, res) => {
    const { title } = req.query;

    try {
        const events = await getEventsByTitle(title, req.user.id);
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getEventParticipants = async (req, res) => {
  const id = req.user.id;
  const eventId = req.params.id;
  
  try {
    const participants = await getAllEventParticipants(id, eventId);
    res.status(200).json(participants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const rsvpUserToEvent = async (req, res) => {
    const { id } = req.user;
    const eventId = req.params.id;
    
    try {
        await addUserToEvent(id, eventId);
        res.status(200).json({ message: "RSVPed user to event." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const unRsvpUserFromEvent = async (req, res) => {
    const { id } = req.user;
    const eventId = req.params.id;
    
    try {
        await removeUserFromEvent(id, eventId);
        res.status(200).json({ message: "unRSVPed user from event." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getRsvpedEvents = async (req, res) => {
    const reqId = req.user.id;  // The authenticated user making the request (for permission checking)
    const userId = req.params.id;  // The user whose RSVPed events we want to see
    
    try {
        const events = await getEventsUserIsAttending(reqId, userId);
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
