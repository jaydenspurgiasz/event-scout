import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import { initializeDatabase } from "./config/database.js";
import { saveMessage, getMessages } from "./controllers/messageController.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;
const allowed = { origin: "http://localhost:3000", credentials: true };

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(express.json());
app.use(cors(allowed));

// Routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api", authRoutes);
app.use("/api", eventRoutes);

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("join_event", (data) => {
    const { eventId } = data;
    socket.join(`event_${eventId}`);
    console.log(`Socket ${socket.id} joined event ${eventId}`);

    getMessages(eventId, (err, messages) => {
      if (err) {
        socket.emit("error", { message: "Failed to load messages" });
        return;
      }
      socket.emit("messages_history", { messages });
    });
  });

  socket.on("send_message", (data) => {
    const { eventId, userId, message } = data;

    saveMessage(eventId, userId, message, (err, messageId) => {
      if (err) {
        socket.emit("error", { message: "Failed to send message" });
        return;
      }

      getMessages(eventId, (err, messages) => {
        if (err) {
          socket.emit("error", { message: "Failed to load messages" });
          return;
        }

        const newMessage = messages[messages.length - 1];
        io.to(`event_${eventId}`).emit("new_message", { message: newMessage });
      });
    });
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const startServer = async() => {
  try {
    await initializeDatabase();
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`WebSocket server is ready`);
    });
  } catch(err) {
    console.error("Failed to start server:", err);
  }
}

startServer();

export { io };
