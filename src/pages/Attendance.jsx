import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
  Box,
  Checkbox,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";

const API_URL = "http://localhost:5000/api/teacher";

function Attendance({ onStart }) {
  const teacher = useSelector((state) => state.auth.user);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState(null);

  const [activeSessions, setActiveSessions] = useState({});
  const [records, setRecords] = useState([]);
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [attendanceForm, setAttendanceForm] = useState({ date: "", time: "" });

  const [manualAttendance, setManualAttendance] = useState([]);

  const [exportAvailable, setExportAvailable] = useState({});

  const [viewAddedOpen, setViewAddedOpen] = useState(false);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/subjects?teacher=${teacher._id}`);
      console.log("Subjects:", res.data.subjects);
      setSubjects(res.data.subjects);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching subjects");
    }
  };

  const fetchAttendanceRecords = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/attendance-records?teacher=${teacher._id}`
      );
      const allRecords = res.data.records;
      setRecords(allRecords);
      const active = {};
      allRecords.forEach((session) => {
        if (session.isActive) {
          active[session.subjectId] = session;
        }
      });
      setActiveSessions(active);
    } catch (err) {
      setError(
        err.response?.data?.message || "Error fetching attendance records"
      );
    }
  };

  useEffect(() => {
    if (teacher) {
      fetchSubjects();
      fetchAttendanceRecords();
    }
  }, [teacher]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (teacher) fetchAttendanceRecords();
    }, 10000);
    return () => clearInterval(interval);
  }, [teacher]);

  const handleOpenAttendanceDialog = (subject) => {
    setCurrentSubject(subject);
    setAttendanceForm({ date: "", time: "" });
    setAttendanceDialogOpen(true);
  };

  const handleAttendanceFormChange = (e) => {
    const { name, value } = e.target;
    setAttendanceForm((prev) => ({ ...prev, [name]: value }));
  };

  const startAttendance = async () => {
    try {
      const data = {
        subject: currentSubject.subjectName,
        subjectId: currentSubject.subjectId,
        date: attendanceForm.date,
        time: attendanceForm.time,
        teacher: teacher._id,
      };
      const res = await axios.post(`${API_URL}/start-attendance`, data);

      setActiveSessions((prev) => ({
        ...prev,
        [currentSubject.subjectId]: res.data.session,
      }));

      if (currentSubject.students && currentSubject.students.length > 0) {
        setManualAttendance(
          currentSubject.students.map((student) => ({
            studentId: student._id,
            fullName: student.fullName,
            email: student.email,
            present: false,
          }))
        );
      } else {
        setManualAttendance([]);
      }
      setAttendanceDialogOpen(false);

      setExportAvailable((prev) => ({
        ...prev,
        [currentSubject.subjectId]: false,
      }));
      // onStart();
    } catch (err) {
      setError(err.response?.data?.message || "Error starting attendance");
    }
  };

  const stopAttendance = async (subjectId) => {
    const session = activeSessions[subjectId];
    if (!session) return;
    try {
      const res = await axios.post(`${API_URL}/stop-attendance`, {
        sessionId: session._id,
      });

      setExportAvailable((prev) => ({ ...prev, [subjectId]: true }));

      setActiveSessions((prev) => ({ ...prev, [subjectId]: null }));
      await fetchAttendanceRecords();
    } catch (err) {
      setError(err.response?.data?.message || "Error stopping attendance");
    }
  };

  const exportAttendance = (subjectId) => {
    const subject = subjects.find((s) => s.subjectId === subjectId);
    if (!subject) return;

    const sessionRecords = records.filter(
      (record) => record.subjectId === subjectId && !record.isActive
    );
    if (sessionRecords.length === 0) {
      alert("No attendance record found for this subject.");
      return;
    }

    const latestRecord = sessionRecords.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    )[sessionRecords.length - 1];

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Subject,Date,Time,StudentID,Full Name,Email,Present\n";

    latestRecord.records.forEach((rec) => {
      const student = subject.students.find(
        (s) => s._id === rec.student.toString()
      );
      const fullName = student ? student.fullName : "";
      const email = student ? student.email : "";
      csvContent += `${subject.subjectName},${latestRecord.date},${latestRecord.time},${rec.student},${fullName},${email},${rec.present}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${subject.subjectId}_attendance.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleManualAttendance = async (subjectId,studentId) => {
    const updated = manualAttendance.map((record) =>
      record.studentId === studentId
        ? { ...record, present: !record.present }
        : record
    );
    setManualAttendance(updated);

    try {
      const session = activeSessions[currentSubject.subjectId];
      if (session) {
        await axios.put(`${API_URL}/mark-attendance`, {
          sessionId: session._id,
          studentId,
          present: updated.find((r) => r.studentId === studentId).present,
        });
      }
    } catch (err) {
      console.error("Error marking attendance:", err);
    }
  };

  const handleViewAddedStudents = (subject) => {
    setCurrentSubject(subject);
    setViewAddedOpen(true);
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Attendance Dashboard
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {subjects.length === 0 ? (
        <Typography>No subjects found.</Typography>
      ) : (
        subjects.map((subject) => (
          <Box
            key={subject._id}
            sx={{ mb: 3, p: 2, border: "1px solid #ccc", borderRadius: 1 }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", color: "#1976d2" }}
            >
              {subject.subjectName} ({subject.subjectId})
            </Typography>
            <Typography variant="body2" sx={{ color: "#424242", mb: 1 }}>
              {subject.description}
            </Typography>
            {activeSessions[subject.subjectId] ? (
              <>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => stopAttendance(subject.subjectId)}
                >
                  Stop Attendance
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  onClick={() => handleOpenAttendanceDialog(subject)}
                >
                  Start Attendance
                </Button>
                {exportAvailable[subject.subjectId] && (
                  <Button
                    variant="outlined"
                    onClick={() => exportAttendance(subject.subjectId)}
                    sx={{ ml: 2 }}
                  >
                    Export Attendance
                  </Button>
                )}
              </>
            )}
            <Box sx={{ mt: 1 }}>
              <Button
                variant="outlined"
                onClick={() => handleViewAddedStudents(subject)}
              >
                View Students
              </Button>
            </Box>
            {activeSessions[subject.subjectId] && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">
                  Mark Attendance Manually:
                </Typography>
                {subject.students && subject.students.length > 0 ? (
                  subject.students.map((student) => (
                    <Box
                      key={student._id}
                      sx={{ display: "flex", alignItems: "center", mt: 1 }}
                    >
                      <Checkbox
                        checked={
                          manualAttendance.find(
                            (record) => record.studentId === student._id
                          )?.present || false
                        }
                        onChange={() => toggleManualAttendance(subject.subjectId,student._id)}
                      />
                      <Typography variant="body2">
                        {student.fullName}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2">No students enrolled.</Typography>
                )}
              </Box>
            )}
          </Box>
        ))
      )}

      {/* Dialog for starting attendance */}
      <Dialog
        open={attendanceDialogOpen}
        onClose={() => setAttendanceDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Start Attendance for {currentSubject?.subjectName}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                name="date"
                type="date"
                value={attendanceForm.date}
                onChange={handleAttendanceFormChange}
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
                value={attendanceForm.time}
                onChange={handleAttendanceFormChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAttendanceDialogOpen(false)}>Cancel</Button>
          <Button onClick={startAttendance} variant="contained" color="primary">
            Start Attendance
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Added Students Dialog */}
      <Dialog
        open={viewAddedOpen}
        onClose={() => setViewAddedOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Students in {currentSubject?.subjectName}</DialogTitle>
        <DialogContent>
          {currentSubject?.students && currentSubject.students.length > 0 ? (
            currentSubject.students.map((student) => (
              <Box
                key={student._id}
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <Typography variant="body2">
                  {student.fullName} ({student.email})
                </Typography>
              </Box>
            ))
          ) : (
            <Typography>No students added.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewAddedOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default Attendance;
