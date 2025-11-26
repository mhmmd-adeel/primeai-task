// backend/routes/auth.routes.js (Updates to existing file)

import express from "express";
import { signup, login, getProfile } from "../controllers/auth.controllers.js"; // 👈 Ensure getProfile is imported
import { protect } from "../middleware/auth.js"; // 👈 Ensure middleware is imported

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

// 🚨 FIX: Add the protected route for profile fetching/state persistence
router.get("/profile", protect, getProfile); 

export default router;