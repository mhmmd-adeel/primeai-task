import Task from "../models/task.model.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    const task = await Task.create({
      title,
      description,
      status,
      userId: req.user, // comes from JWT middleware
    });

    return res.status(201).json({ message: "Task created", task });
  } catch (err) {
    return res.status(500).json({ message: "Error creating task", err });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user }).sort({ createdAt: -1 });

    return res.status(200).json(tasks);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching tasks", err });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user });

    if (!task) return res.status(404).json({ message: "Task not found" });

    return res.status(200).json(task);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching task", err });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user },
      req.body,
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    return res.status(200).json({ message: "Task updated", task });
  } catch (err) {
    return res.status(500).json({ message: "Error updating task", err });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    return res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting task", err });
  }
};
