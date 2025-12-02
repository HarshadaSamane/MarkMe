const express = require("express");
const morgan = require("morgan");
const cors = require("cors"); 
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const teacherRoutes = require("./routes/teacherRoutes"); 
const studentRoutes = require("./routes/studentRoutes");
const userRoutes = require("./routes/userRoutes");
const { errorHandler } = require("./middlewares/errorHandler");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

module.exports = app;
