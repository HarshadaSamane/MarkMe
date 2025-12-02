const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const Attendance = require("../models/attendanceModel");
const Subject = require("../models/subjectModel");

exports.createStudent = async (req, res, next) => {
  try {
    const { fullName, email, password, grade, enrollmentNumber, teacher } =
      req.body;
    if (
      !fullName ||
      !email ||
      !password ||
      !grade ||
      !enrollmentNumber ||
      !teacher
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newStudent = new User({
      fullName,
      email,
      password: hashedPassword,
      role: "Student",
      grade,
      enrollmentNumber,
      teacher,
      picture: req.file ? req.file.filename : null,
    });
    const savedStudent = await newStudent.save();
    res
      .status(201)
      .json({ message: "Student created successfully", student: savedStudent });
  } catch (error) {
    console.error("Error in createStudent:", error);
    next(error);
  }
};

exports.getStudents = async (req, res, next) => {
  try {
    const students = await User.find({ role: "Student" });
    res.status(200).json({ students });
  } catch (error) {
    console.error("Error in getStudents:", error);
    next(error);
  }
};
exports.getStudentsByTeacher = async (req, res, next) => {
  try {
    const teacherId = req.query.teacher;
    if (!teacherId) {
      return res.status(400).json({ message: "Teacher id is required." });
    }
    const students = await User.find({ role: "Student", teacher: teacherId });
    res.status(200).json({ students });
  } catch (error) {
    console.error("Error in getStudentsByTeacher:", error);
    next(error);
  }
};

exports.startAttendance = async (req, res, next) => {
  try {
    const { subject, subjectId, date, time, teacher } = req.body;
    if (!subject || !subjectId || !date || !time || !teacher) {
      return res
        .status(400)
        .json({ message: "Missing required fields for starting attendance." });
    }
    const attendanceSession = new Attendance({
      teacher,
      subject,
      subjectId,
      date,
      time,
      records: [],
      isActive: true,
    });
    const savedSession = await attendanceSession.save();
    res
      .status(201)
      .json({ message: "Attendance started", session: savedSession });
  } catch (error) {
    console.error("Error in startAttendance:", error);
    next(error);
  }
};
exports.stopAttendance = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ message: "Session id is required." });
    }
    let session = await Attendance.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Attendance session not found" });
    }
    session.isActive = false;

    const subject = await Subject.findOne({ subjectId: session.subjectId });
    if (subject && subject.students && subject.students.length > 0) {
      subject.students.forEach((studentId) => {
        const alreadyMarked = session.records.some(
          (record) => record.student.toString() === studentId.toString()
        );
        if (!alreadyMarked) {
          session.records.push({ student: studentId, present: false });
        }
      });
    }

    session = await session.save();
    res.status(200).json({ message: "Attendance stopped", session });
    res.status(200).json({ message: "Attendance stopped", session });
  } catch (error) {
    console.error("Error in stopAttendance:", error);
    next(error);
  }
};

exports.getAttendanceRecords = async (req, res, next) => {
  try {
    const teacherId = req.query.teacher;
    if (!teacherId) {
      return res.status(400).json({ message: "Teacher id is required." });
    }
    const records = await Attendance.find({ teacher: teacherId });
    res.status(200).json({ records });
  } catch (error) {
    console.error("Error in getAttendanceRecords:", error);
    next(error);
  }
};
exports.markAttendance = async (req, res, next) => {
  try {
    const { sessionId, studentId, present } = req.body;
    if (!sessionId || !studentId || typeof present === "undefined") {
      return res
        .status(400)
        .json({ message: "Missing required fields for marking attendance." });
    }
    const session = await Attendance.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Attendance session not found" });
    }
    const studentIdStr = studentId.toString();
    const recordIndex = session.records.findIndex(
      (r) => r.student.toString() === studentIdStr
    );
    if (recordIndex > -1) {
      session.records[recordIndex].present = present;
    } else {
      session.records.push({ student: studentId, present });
    }
    await session.save();
    res.status(200).json({ message: "Attendance updated", session });
  } catch (error) {
    console.error("Error in markAttendance:", error);
    next(error);
  }
};

exports.createSubject = async (req, res, next) => {
  try {
    const { subjectName, subjectId, description, teacher } = req.body;
    if (!subjectName || !subjectId || !description || !teacher) {
      return res
        .status(400)
        .json({ message: "Missing required fields for subject creation." });
    }
    const newSubject = new Subject({
      teacher,
      subjectName,
      subjectId,
      description,
      students: [],
    });
    const savedSubject = await newSubject.save();
    res
      .status(201)
      .json({ message: "Subject created successfully", subject: savedSubject });
  } catch (error) {
    console.error("Error in createSubject:", error);
    next(error);
  }
};

exports.getSubjects = async (req, res, next) => {
  try {
    const teacherId = req.query.teacher;
    if (!teacherId) {
      return res.status(400).json({ message: "Teacher id is required." });
    }
    const subjects = await Subject.find({ teacher: teacherId }).populate(
      "students",
      "fullName email picture"
    );
    res.status(200).json({ subjects });
  } catch (error) {
    console.error("Error in getSubjects:", error);
    next(error);
  }
};

exports.addStudentToSubject = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    const { studentId } = req.body;
    if (!subjectId || !studentId) {
      return res
        .status(400)
        .json({ message: "Subject id and student id are required." });
    }
    let subject = await Subject.findOne({ subjectId });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    if (!subject.students.includes(studentId)) {
      subject.students.push(studentId);
      await subject.save();
    }
    subject = await Subject.findOne({ subjectId }).populate(
      "students",
      "fullName email"
    );
    res.status(200).json({ message: "Student added to subject", subject });
  } catch (error) {
    console.error("Error in addStudentToSubject:", error);
    next(error);
  }
};

exports.getFilteredAttendanceRecords = async (req, res, next) => {
  try {
    const teacherId = req.query.teacher;
    if (!teacherId) {
      return res.status(400).json({ message: "Teacher id is required." });
    }
    let query = { teacher: teacherId, isActive: false };
    if (req.query.subject) {
      query.subjectId = req.query.subject;
    }
    if (req.query.date) {
      const start = new Date(req.query.date);
      const end = new Date(req.query.date);
      end.setDate(end.getDate() + 1);
      query.date = { $gte: start, $lt: end };
    }
    const records = await Attendance.find(query);
    res.status(200).json({ records });
  } catch (error) {
    console.error("Error in getFilteredAttendanceRecords:", error);
    next(error);
  }
};

exports.getDetailedAttendanceRecords = async (req, res, next) => {
  try {
    const { teacher, subject, date } = req.query;
    if (!teacher) {
      return res.status(400).json({ message: "Teacher id is required." });
    }
    let query = { teacher, isActive: false };

    if (subject) {
      query.subjectId = subject;
    }
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query.date = { $gte: start, $lt: end };
    }

    const records = await Attendance.find(query)
      .populate("records.student", "fullName email")
      .lean();

    for (let rec of records) {
      const subj = await Subject.findOne({ subjectId: rec.subjectId }).lean();
      rec.subjectDetails = subj;
    }
    res.status(200).json({ records });
  } catch (error) {
    console.error("Error in getDetailedAttendanceRecords:", error);
    next(error);
  }
};
