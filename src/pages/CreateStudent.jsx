import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
} from "@mui/material";
import { useSelector } from "react-redux";
import axios from "axios";

const API_URL = "http://localhost:5000/api/teacher";

function CreateStudent() {
  const teacher = useSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    grade: "",
    enrollmentNumber: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = useRef(null);

  const handleOpen = () => {
    setOpen(true);
    setError(null);
    setSuccess(null);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      fullName: "",
      email: "",
      password: "",
      grade: "",
      enrollmentNumber: "",
    });
    setCapturedImage(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  }, [webcamRef]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!capturedImage) {
      setError("Please capture an image.");
      return;
    }

    const blob = await fetch(capturedImage).then((res) => res.blob());
    const imageFile = new File([blob], "student-photo.jpg", {
      type: "image/jpeg",
    });

    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("grade", formData.grade);
    data.append("enrollmentNumber", formData.enrollmentNumber);
    data.append("role", "Student");
    data.append("teacher", teacher._id);
    data.append("picture", imageFile);

    try {
      const response = await axios.post(`${API_URL}/create-student`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(response.data.message || "Student created successfully.");
      setFormData({
        fullName: "",
        email: "",
        password: "",
        grade: "",
        enrollmentNumber: "",
      });
      setCapturedImage(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error creating student.");
    }
  };

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Create Student
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Create Student</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Grade / Year"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Enrollment Number"
                name="enrollmentNumber"
                value={formData.enrollmentNumber}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width="100%"
              />
              <Button
                onClick={captureImage}
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                Capture Image
              </Button>
              {capturedImage && (
                <img
                  src={capturedImage}
                  alt="Captured"
                  style={{ marginTop: 10, width: "100%" }}
                />
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Create Student
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CreateStudent;
