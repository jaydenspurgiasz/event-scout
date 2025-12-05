import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import apiRoutes from "./routes/apiRoutes.js";
import { initializeDatabase } from "./models/db.js";
import cookieParser from "cookie-parser";
import { saveMessage, getMessages } from "./controllers/messageController.js";
import { startReminderJob } from "./services/reminderJob.js";

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(cors({ 
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
  credentials: true 
}));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/health", (req, res) => {
  res.send("Server is running");
});

app.use("/api", apiRoutes);

/**
 * Socket.io event handlers for chat functionality
 * Each event has its own room (event_<eventId>)
 */
io.on("connection", (socket) => {
  // Join event room and send message history to the new connection
  socket.on("join_event", (data) => {
    socket.join(`event_${data.eventId}`);
    getMessages(data.eventId, (err, messages) => {
      if (!err) {
        socket.emit("messages_history", { messages });
      }
    });
  });

  // Save message to database and broadcast to all users in the event room
  socket.on("send_message", (data) => {
    saveMessage(data.eventId, data.userId, data.message, (err) => {
      if (!err) {
        getMessages(data.eventId, (err, messages) => {
          if (!err) {
            io.to(`event_${data.eventId}`).emit("new_message", { 
              message: messages[messages.length - 1] 
            });
          }
        });
      }
    });
  });
});

const startServer = async () => {
  try {
    await initializeDatabase();
    startReminderJob();
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch(err) {
    console.error("Failed to start server:", err);
  }
}

startServer();

export { io };
