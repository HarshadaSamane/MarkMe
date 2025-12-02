const Subject = require("../models/subjectModel");
const Attendance = require("../models/attendanceModel");

exports.getSubjects = async (req, res, next) => {
  try {
    const studentId = req.query.student;
    if (!studentId) {
      return res.status(400).json({ message: "Student id is required." });
    }
    const subjects = await Subject.find({ students: studentId }).populate(
      "teacher",
      "fullName email"
    );
    res.status(200).json({ subjects });
  } catch (error) {
    console.error("Error in getSubjects:", error);
    next(error);
  }
};

exports.getAttendanceRecords = async (req, res, next) => {
  try {
    const studentId = req.query.student;
    if (!studentId) {
      return res.status(400).json({ message: "Student id is required." });
    }
    const records = await Attendance.find({
      "records.student": studentId,
    }).populate("records.student", "fullName email");

    console.log("Fetched Records:", records); 

    res.status(200).json({ records });
  } catch (error) {
    console.error("Error in getAttendanceRecords:", error);
    next(error);
  }
};

exports.getActiveSessions = async (req, res, next) => {
  try {
    const studentId = req.query.student;
    if (!studentId) {
      return res.status(400).json({ message: "Student id is required." });
    }
    const sessions = await Attendance.find({ isActive: true });
    const subjects = await Subject.find({ students: studentId });
    const subjectIds = subjects.map((s) => s.subjectId);
    const activeSessions = sessions.filter((session) =>
      subjectIds.includes(session.subjectId)
    );
    res.status(200).json({ sessions: activeSessions });
  } catch (error) {
    console.error("Error in getActiveSessions:", error);
    next(error);
  }
};
