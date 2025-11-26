// backend/middleware/auth.js

import jwt from "jsonwebtoken";
import User from "../models/user.model.js"; 

export const protect = async (req, res, next) => { // 🚨 Needs to be async
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // 1. Get token from header: "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find user by ID and attach to req.user (This satisfies task.controllers.js)
      // 🚨 FIX: Sets req.user for controllers
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed or expired" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};