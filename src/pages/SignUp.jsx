import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signupStart,
  signupSuccess,
  signupFailure,
} from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
} from "@mui/material";
import { toast } from "react-hot-toast";

const API_URL = "http://localhost:5000/api/auth";

function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "Teacher",
    picture: null,
    subject: "",
    experience: "",
    grade: "",
    enrollmentNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        picture: e.target.files[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signupStart());
    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("role", formData.role);

    if (formData.role === "Teacher") {
      data.append("subject", formData.subject);
      data.append("experience", formData.experience);
    } else if (formData.role === "Student") {
      data.append("grade", formData.grade);
      data.append("enrollmentNumber", formData.enrollmentNumber);
      if (formData.picture) {
        data.append("picture", formData.picture);
      }
    }

    try {
      const response = await axios.post(`${API_URL}/signup`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(signupSuccess(response.data.user));
      toast.success("Registration successful! Please sign in.");
      navigate("/signin");
    } catch (err) {
      const message = err.response?.data?.message || "An error occurred.";
      dispatch(signupFailure(message));
      toast.error(message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
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
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Role</FormLabel>
                <RadioGroup
                  row
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="Teacher"
                    control={<Radio />}
                    label="Teacher"
                  />
                  {/* <FormControlLabel value="Student" control={<Radio />} label="Student" /> */}
                </RadioGroup>
              </FormControl>
            </Grid>
            {formData.role === "Teacher" && (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="Subject Specialization"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Years of Experience"
                    name="experience"
                    type="number"
                    value={formData.experience}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
              </>
            )}
            {formData.role === "Student" && (
              <>
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
                  <Button variant="contained" component="label" fullWidth>
                    Upload Profile Picture
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      hidden
                      onChange={handleFileChange}
                    />
                  </Button>
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={status === "loading"}
              >
                {status === "loading" ? "Signing Up..." : "Sign Up"}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography align="center">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  style={{ textDecoration: "none", color: "#1976d2" }}
                >
                  Sign In
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

export default SignUp;
