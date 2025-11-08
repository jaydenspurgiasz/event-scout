import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sqlite3 from "sqlite3";

dotenv.config();

const db = new sqlite3.Database("./server/db/users.db");
db.run(
  "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT UNIQUE, password TEXT)"
);
const JWT_SECRET =
  process.env.JWT_SECRET || "rea11y un!que key that is 5uper dup3r s3cret";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
const allowed = { origin: "http://localhost:3000", credentials: true };
app.use(cors(allowed));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// API endpoint for user signup
app.post("/api/register", (req, res) => {
  const { email, pass } = req.body;
  const hashedPass = bcrypt.hashSync(pass, 10);
  db.run(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hashedPass],
    (err) => {
      if (err) {
        return res.status(400).json({ message: "Email already in use" });
      }
      res.status(200).json({ message: "User created" });
    }
  );
});

// API endpoint for user signin
app.post("/api/login", (req, res) => {
  const { email, pass } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err || !user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    if (!bcrypt.compareSync(pass, user.password)) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "30m",
    });
    res.status(200).json({ token });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
