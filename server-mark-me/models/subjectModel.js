const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subjectName: { type: String, required: true },
    subjectId: { type: String, required: true, unique: true },
    description: { type: String },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subject", subjectSchema);
