import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import { initializeDatabase } from "./config/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const allowed = { origin: "http://localhost:3000", credentials: true };

// Middleware
app.use(express.json());
app.use(cors(allowed));

// Routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api", authRoutes);

const startServer = async() => {
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