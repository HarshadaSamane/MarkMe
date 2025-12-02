const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: { type: String, required: true },
    subjectId: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    records: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        present: { type: Boolean, default: false },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
