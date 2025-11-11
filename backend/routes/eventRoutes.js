import express from "express";
import { getEventDetails, getEventParticipants } from "../controllers/eventController.js";

const router = express.Router();

router.get("/event/:id", getEventDetails);

router.get("/event/:id/participants", getEventParticipants);

export default router;

