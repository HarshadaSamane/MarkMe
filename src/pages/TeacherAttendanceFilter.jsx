import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
  Alert
} from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import axios from "axios";

const API_URL = "http://localhost:5000/api/teacher/attendance-filter";

function TeacherAttendanceFilter({ teacherId }) {
  const [records, setRecords] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [error, setError] = useState(null);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/teacher/subjects?teacher=${teacherId}`);
      setSubjects(res.data.subjects || []);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching subjects");
    }
  };

  const fetchRecords = async () => {
    try {
      let url = `${API_URL}?teacher=${teacherId}`;
      if (subjectFilter) {
        url += `&subject=${subjectFilter}`;
      }
      if (dateFilter) {
        url += `&date=${dateFilter}`;
      }
      const res = await axios.get(url);
      setRecords(res.data.records || []);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching attendance records");
    }
  };

  useEffect(() => {
    if (teacherId) {
      fetchSubjects();
      fetchRecords();
    }
  }, [teacherId]);

  const handleFilter = () => {
    fetchRecords();
  };

  const totalPresent = records.reduce((acc, session) => {
    return acc + (session.records ? session.records.filter(r => r.present).length : 0);
  }, 0);
  const totalStudents = records.reduce((acc, session) => {
    return acc + (session.records ? session.records.length : 0);
  }, 0);
  const totalAbsent = totalStudents - totalPresent;
  const pieData = [
    { name: "Present", value: totalPresent },
    { name: "Absent", value: totalAbsent }
  ];
  const COLORS = ["#0088FE", "#FF8042"];

  return (
    <Container>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Filter Attendance Records</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
          <TextField
            select
            label="Subject"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Subjects</MenuItem>
            {subjects.map((subj) => (
              <MenuItem key={subj._id} value={subj.subjectId}>
                {subj.subjectName} ({subj.subjectId})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Date"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Button variant="contained" onClick={handleFilter}>
            Apply Filters
          </Button>
        </Box>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ mt: 2 }}>
        {records.length === 0 ? (
          <Typography>No attendance records found.</Typography>
        ) : (
          records.map((session) => (
            <Paper key={session._id} sx={{ mb: 3, p: 2, borderRadius: 2, boxShadow: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {session.subject} ({session.subjectId})
              </Typography>
              <Typography variant="body2">
                Date: {new Date(session.date).toLocaleDateString()} | Time: {session.time}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle2">Student Records:</Typography>
                {session.records && session.records.length > 0 ? (
                  session.records.map((rec) => (
                    <Box key={rec._id} sx={{ ml: 2, mt: 0.5 }}>
                      <Typography variant="body2">
                        {rec.student.fullName || rec.student} - {rec.present ? "Present" : "Absent"}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    No student records.
                  </Typography>
                )}
              </Box>
            </Paper>
          ))
        )}
      </Box>
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Overall Attendance Summary
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <PieChart width={300} height={300}>
          <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} label dataKey="value">
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </Box>
    </Container>
  );
}

export default TeacherAttendanceFilter;
