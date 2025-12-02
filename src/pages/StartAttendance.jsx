import React, { useState } from "react";
import {
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
  Box,
} from "@mui/material";
import axios from "axios";

const API_URL = "http://localhost:5000/api/teacher";

function StartAttendance() {
  const [formData, setFormData] = useState({
    subject: "",
    date: "",
    time: "",
  });
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const startAttendance = async () => {
    setError(null);
    try {
      const response = await axios.post(
        `${API_URL}/start-attendance`,
        formData
      );
      setSession(response.data.session);
    } catch (err) {
      setError(err.response?.data?.message || "Error starting attendance");
    }
  };

  const stopAttendance = async () => {
    if (!session) return;
    try {
      await axios.post(`${API_URL}/stop-attendance`, { sessionId: session.id });
      setSession(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error stopping attendance");
    }
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Lecture Attendance
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {!session ? (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" fullWidth onClick={startAttendance}>
              Start Attendance
            </Button>
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6">Attendance is in progress</Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={stopAttendance}
            sx={{ mt: 2 }}
          >
            Stop Attendance
          </Button>
        </Box>
      )}
    </Paper>
  );
}

export default StartAttendance;
