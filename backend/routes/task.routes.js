// backend/routes/task.routes.js

import express from "express";
import { createTask, getTasks, updateTask, deleteTask } from "../controllers/task.controllers.js";
import { protect } from "../middleware/auth.js"; // 👈 Import the middleware

const router = express.Router();

// Apply 'protect' middleware to all task routes
router.route("/")
    .get(protect, getTasks) // 💡 Now requires a valid JWT
    .post(protect, createTask);

router.route("/:id")
    .put(protect, updateTask) // 💡 Now requires a valid JWT
    .delete(protect, deleteTask);

export default router;