const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Todo", todoSchema);