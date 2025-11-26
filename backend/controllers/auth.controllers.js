// backend/controllers/auth.controllers.js (FINAL STITCHED VERSION)
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 1. SIGNUP FUNCTION (Creates user and returns token for auto-login)
export const signup = async (req, res) => {
  try {
    // Frontend sends 'name', 'email', 'password'
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate token for instant login (Auto Login Fix)
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Registration successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error during signup", err });
  }
};

// 2. LOGIN FUNCTION (Missing from your last paste, causing the error)
// 🚨 FIX: Ensure this entire block is added and correctly exported
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error during login", err });
  }
};

// 3. GET PROFILE FUNCTION (For state persistence/refresh check)
export const getProfile = async (req, res) => {
  try {
    // req.user is set by the 'protect' middleware (contains the full user model)
    const user = req.user; 
    
    // Return only the public user data
    return res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    return res.status(500).json({ message: "Server error fetching profile" });
  }
};