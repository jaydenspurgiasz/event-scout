import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, getAuthCredentials, getUserById } from "../models/userModel.js";

const getSecret = () => {
  if (!process.env.JWT_SECRET) {
    console.warn("JWT_SECRET not set in environment variables.");
    return "default_secret";
  }
  return process.env.JWT_SECRET;
}

/**
 * Register a new user. Hashes password with bcrypt
 * Returns 400 if email already exists
 */
export const register = async (req, res) => {
  const { email, pass, name } = req.body;
  
  if (!email || !pass || !name) {
    return res.status(400).json({ message: "Missing fields" });
  }
  
  try {
    const hashedPass = bcrypt.hashSync(pass, 10);
    await createUser(email, hashedPass, name);
    res.status(200).json({ message: "User created" });
  } catch (err) {
    if (err.message && err.message.includes("UNIQUE")) {
      return res.status(400).json({ message: "Email already in use" });
    }
    console.error(err);
    res.status(500).json({ message: "Server error"});
  }
};

/**
 * Authenticate user and set JWT token in cookie
 * Token expires in 30 minutes
 * Returns "Invalid login" for both wrong email and wrong password
 */
export const login = async (req, res) => {
  const { email, pass } = req.body;
  
  try {
    const user = await getAuthCredentials(email);
    
    if (!user) {
      return res.status(400).json({ message: "Invalid login" });
    }
    if (!bcrypt.compareSync(pass, user.password)) {
      return res.status(400).json({ message: "Invalid login" });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, getSecret(), {
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
    console.error(err);
    res.status(500).json({ message: "Server error"});
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
        name: user.name
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error"});
  }
};
