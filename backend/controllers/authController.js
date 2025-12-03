import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, getUserByEmail } from "../models/db.js";

const JWT_SECRET = process.env.JWT_SECRET;

// Register user
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

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 1800000
    })
    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
  // May need more later
};
