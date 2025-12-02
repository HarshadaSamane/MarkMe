const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { updateProfile,getUserById } = require("../controllers/userController");
const router = express.Router();

router.patch("/update-profile", protect, updateProfile);

router.get("/:id", getUserById);

module.exports = router;
