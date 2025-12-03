import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes/apiRoutes.js";
import { initializeDatabase } from "./models/db.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const allowed = { origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true };

// Middleware
app.use(express.json());
app.use(cors(allowed));
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/health", (req, res) => {
  res.send("Server is running");
});

app.use("/api", apiRoutes);

const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch(err) {
    console.error("Failed to start server:", err);
  }
}

startServer();
