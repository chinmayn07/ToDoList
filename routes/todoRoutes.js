const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Todo = require("../models/to-do");

router.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

// Create a new todo item
router.post("/", async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const todo = new Todo({
      userId: req.userData.userId || req.body.userId,
      title,
      description,
    });
    await todo.save();
    res.status(201).json({ message: "Todo created successfully", todo });
  } catch (err) {
    next(err);
  }
});

// Get all todo items
router.get("/", async (req, res, next) => {
  try {
    const todos = await Todo.find({
      userId: req.userData.userId || req.body.userId,
    });
    res.status(200).json(todos);
  } catch (err) {
    next(err);
  }
});

// Update a todo item
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId: req.userData.userId || req.body.userId },
      { title, description, completed },
      { new: true }
    );
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json({ message: "Todo updated successfully", todo });
  } catch (err) {
    next(err);
  }
});

// Delete a todo item
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOneAndDelete({
      _id: id,
      userId: req.userData.userId || req.body.userId,
    });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
