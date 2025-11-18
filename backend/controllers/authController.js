import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/database.js";

const JWT_SECRET = process.env.JWT_SECRET || "rea11y un!que key that is 5uper dup3r s3cret";

// Register a new user
export const register = (req, res) => {
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
};

// Login user
export const login = (req, res) => {
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
};

