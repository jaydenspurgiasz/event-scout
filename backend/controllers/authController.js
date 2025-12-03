import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, getUserByEmail, getUserById } from "../models/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key_change_in_production";

export const register = async (req, res) => {
  const { email, pass, firstName, lastName } = req.body;
  
  if (!email || !pass || !firstName) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  
  try {
    const hashedPass = bcrypt.hashSync(pass, 10);
    await createUser(email, hashedPass, firstName, lastName || "");
    res.status(200).json({ message: "User created" });
  } catch (err) {
    console.error("Register error:", err);
    if (err.message && err.message.includes("UNIQUE constraint")) {
      return res.status(400).json({ message: "Email already in use" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

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

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1800000
    });
    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};

export const verify = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ 
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      }
    });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
