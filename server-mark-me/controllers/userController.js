const User = require("../models/userModel");

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.fullName = req.body.fullname || user.fullName;

    if (user.role === "Teacher") {
      const { subject, experience } = req.body;
      user.subject = subject || user.subject;
      user.experience = experience || user.experience;
    } else {
      const { grade, enrollmentNumber } = req.body;
      user.grade = grade || user.grade;
      user.enrollmentNumber = enrollmentNumber || user.enrollmentNumber;
    }

    await user.save();
    res
      .status(200)
      .json({ message: "Profile updated successfully", updatedUser: user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select("fullName email enrollmentNumber picture");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};
