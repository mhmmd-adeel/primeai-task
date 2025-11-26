import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ... (validation and existing user check) ...

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 🚨 FIX: Generate and return the JWT token after successful signup
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Registration successful",
      token, // 👈 Token sent to frontend
      user: { id: user._id, name: user.name, email: user.email }, // 👈 User data sent
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", err });
  }
};

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
    return res.status(500).json({ message: "Server error", err });
  }
};

export const getProfile = async (req, res) => {
  try {
    // We assume the JWT middleware (protect) attaches the user ID to req.user
    const user = await User.findById(req.user).select("-password"); // Exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Return only the necessary public user data
    return res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    return res.status(500).json({ message: "Server error fetching profile" });
  }
};