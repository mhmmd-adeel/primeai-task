import express from "express";
import auth from "../middleware/auth.js";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controllers.js";

const router = express.Router();

// all routes require JWT
router.post("/", auth, createTask);
router.get("/", auth, getTasks);
router.get("/:id", auth, getTaskById);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);

export default router;
