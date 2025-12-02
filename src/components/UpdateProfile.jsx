import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/users/update-profile";

const UpdateProfile = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  // Set up formData with extra fields for Teacher vs Student
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    grade: "",
    enrollmentNumber: "",
    subject: "",
    experience: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // On mount, pre-fill the form data based on user role
  useEffect(() => {
    if (user) {
      if (user.role === "Teacher") {
        setFormData({
          fullname: user.fullName || "",
          email: user.email || "",
          subject: user.subject || "",
          experience: user.experience || "",
        });
      } else {
        setFormData({
          fullname: user.fullName || "",
          email: user.email || "",
          grade: user.grade || "",
          enrollmentNumber: user.enrollmentNumber || "",
        });
      }
    }
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const token = user.token || localStorage.getItem("token");
      const response = await axios.patch(API_URL, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>
          Update Profile
        </Typography>
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            variant="outlined"
            margin="normal"
            disabled
          />
          {user && user.role === "Teacher" ? (
            <>
              <TextField
                fullWidth
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Experience (Years)"
                name="experience"
                type="number"
                value={formData.experience}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                required
              />
            </>
          ) : (
            <>
              <TextField
                fullWidth
                label="Grade / Year"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Enrollment Number"
                name="enrollmentNumber"
                value={formData.enrollmentNumber}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                required
              />
            </>
          )}
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default UpdateProfile;
