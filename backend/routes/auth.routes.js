// backend/routes/auth.routes.js (Add this line)

import express from "express";
import { signup, login, getProfile } from "../controllers/auth.controllers.js"; // 👈 Import getProfile
import { protect } from "../middleware/auth.js"; // 👈 Ensure middleware is imported

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

// 🚨 FIX: Add the protected profile route
router.get("/profile", protect, getProfile); 

export default router;