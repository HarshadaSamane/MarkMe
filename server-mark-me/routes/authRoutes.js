const express = require("express");
const router = express.Router();
const {
  signUp,
  signIn,
  getStudents,
} = require("../controllers/authController");
const upload = require("../middlewares/uploadMiddleware");

router.post("/signup", upload.single("picture"), signUp);

router.post("/signin", signIn);

router.get("/students", getStudents);

module.exports = router;
