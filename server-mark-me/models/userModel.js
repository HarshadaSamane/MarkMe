const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Teacher", "Student"], required: true },
    picture: { type: String, default: null },

    subject: { type: String },
    experience: { type: Number },

    grade: { type: String },
    enrollmentNumber: { type: String },

    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
