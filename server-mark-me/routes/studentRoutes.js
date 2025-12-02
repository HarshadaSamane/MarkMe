const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

router.get("/subjects", studentController.getSubjects);
router.get("/attendance-records", studentController.getAttendanceRecords);
router.get("/active-sessions", studentController.getActiveSessions);

module.exports = router;
