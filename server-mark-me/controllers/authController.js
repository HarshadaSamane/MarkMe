const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res, next) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }
    let pictureFileName = null;
    if (role === "Student" && req.file) {
      pictureFileName = req.file.filename;
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let extraData = {};
    if (role === "Teacher") {
      extraData.subject = req.body.subject || "";
      extraData.experience = req.body.experience || 0;
    } else if (role === "Student") {
      extraData.grade = req.body.grade || "";
      extraData.enrollmentNumber = req.body.enrollmentNumber || "";
    }

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role,
      picture: pictureFileName,
      ...extraData,
    });

    const savedUser = await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully.", user: savedUser });
  } catch (error) {
    console.error("Error in signUp:", error);
    next(error);
  }
};

exports.signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    console.log("token : ", token);
    res.status(200).json({ message: "Logged in successfully.", user, token });
  } catch (error) {
    console.error("Error in signIn:", error);
    next(error);
  }
};

exports.getStudents = async (req, res, next) => {
  try {
    const students = await require("../models/userModel")
      .find({ role: "Student" })
      .select("fullName picture");
    res.status(200).json({ students });
  } catch (error) {
    next(error);
  }
};
