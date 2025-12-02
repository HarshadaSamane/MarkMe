const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");
const upload = require("../middlewares/uploadMiddleware");

router.post(
  "/create-student",
  upload.single("picture"),
  teacherController.createStudent
);
router.get("/students", teacherController.getStudents);
router.get("/studentsbyteacher", teacherController.getStudentsByTeacher);
router.post("/start-attendance", teacherController.startAttendance);
router.post("/stop-attendance", teacherController.stopAttendance);
router.get("/attendance-records", teacherController.getAttendanceRecords);
router.put("/mark-attendance", teacherController.markAttendance);

router.post("/create-subject", teacherController.createSubject);
router.get("/subjects", teacherController.getSubjects);
router.put(
  "/subject/:subjectId/add-student",
  teacherController.addStudentToSubject
);
router.get(
  "/attendance-records-filtered",
  teacherController.getFilteredAttendanceRecords
);

router.get(
  "/attendance-filter",
  teacherController.getDetailedAttendanceRecords
);

module.exports = router;
