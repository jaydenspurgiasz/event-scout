import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, getUserByEmail } from "../models/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "rea11y un!que key that is 5uper dup3r s3cret";

// Register a new user
export const register = async (req, res) => {
  const { email, pass, firstName, lastName } = req.body;
  const hashedPass = bcrypt.hashSync(pass, 10);
  
  try {
    await createUser(email, hashedPass, firstName, lastName);
    res.status(200).json({ message: "User created" });
  } catch (err) {
    res.status(400).json({ message: "Email already in use" });
  }
};

// Login user
export const login = async (req, res) => {
  const { email, pass } = req.body;
  
  try {
    const user = await getUserByEmail(email);
    
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    if (!bcrypt.compareSync(pass, user.password)) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "30m",
    });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
