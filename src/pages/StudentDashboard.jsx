import React, { useState, useEffect } from "react";
import {
  Container,
  Tabs,
  Tab,
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
} from "@mui/material";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const STUDENT_API_URL = "http://localhost:5000/api/student";

function StudentDashboard() {
  const student = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);

  const handleTabChange = (e, newValue) => setTabIndex(newValue);

  // Fetch subjects where the student is enrolled
  const fetchSubjects = async () => {
    try {
      const res = await axios.get(
        `${STUDENT_API_URL}/subjects?student=${student._id}`
      );
      setSubjects(res.data.subjects || []);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching subjects");
    }
  };

  // Fetch active attendance sessions for the student
  const fetchActiveSessions = async () => {
    try {
      const res = await axios.get(
        `${STUDENT_API_URL}/active-sessions?student=${student._id}`
      );
      const active = res.data.sessions
        ? res.data.sessions.filter((session) => session.isActive)
        : [];
      setActiveSessions(active);
    } catch (err) {
      setError(
        err.response?.data?.message || "Error fetching active sessions"
      );
    }
  };

  // Fetch attendance records for the student
  const fetchAttendanceRecords = async () => {
    try {
      const res = await axios.get(
        `${STUDENT_API_URL}/attendance-records?student=${student._id}`
      );
      console.log("Attendance records from API:", res.data.records);
      setRecords(res.data.records || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Error fetching attendance records"
      );
    }
  };

  useEffect(() => {
    if (student) {
      fetchSubjects();
      fetchActiveSessions();
      fetchAttendanceRecords();
    }
  }, [student]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (student) fetchActiveSessions();
    }, 10000);
    return () => clearInterval(interval);
  }, [student]);

  // When "Scan Face" is clicked for a session.
  const handleScanFace = (subject, session) => {
    if (!session || !session.isActive) {
      alert(
        "No active attendance session. Please ask your teacher to start recording attendance."
      );
      return;
    }
    console.log("Navigating with sessionId:", session._id);
    sessionStorage.setItem("currentSessionId", session._id);
    navigate("/user-select", {
      state: { account: student, subject, sessionId: session._id },
    });
  };

  // --- Pie Chart Data Computation ---  
  // For each ended session, find the record for the logged-in student.
  const studentIdStr = (student._id || student.id).toString();
  const totalPresent = records.reduce((acc, record) => {
    const studentRecord = record.records.find(
      (r) =>
        (typeof r.student === "object"
          ? r.student._id.toString()
          : r.student.toString()) === studentIdStr
    );
    return acc + (studentRecord && studentRecord.present ? 1 : 0);
  }, 0);
  // Total sessions where the student has a record.
  const totalSessions = records.reduce((acc, record) => {
    const hasRecord = record.records.some(
      (r) =>
        (typeof r.student === "object"
          ? r.student._id.toString()
          : r.student.toString()) === studentIdStr
    );
    return acc + (hasRecord ? 1 : 0);
  }, 0);
  const totalAbsent = totalSessions - totalPresent;
  const pieData = [
    { name: "Present", value: totalPresent },
    { name: "Absent", value: totalAbsent },
  ];
  const COLORS = ["#0088FE", "#FF8042"];
  // --- End Pie Chart Data ---

  if (student.role !== "Student") {
    return (
      <Typography variant="body2">
        You are not authorized to access this page.
      </Typography>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        {/* <Tab label="Subjects" /> */}
        <Tab label="Attendance Records" />
      </Tabs>
      <Box sx={{ mt: 4 }}>
        {/* {tabIndex === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              My Subjects
            </Typography>
            {subjects.length === 0 ? (
              <Typography>No subjects found.</Typography>
            ) : (
              subjects.map((subject) => {
                const subjectIdStr = subject.subjectId.toString();
                const subjectActive = activeSessions.filter(
                  (s) => s.subjectId.toString() === subjectIdStr
                );
                const subjectEnded = records.filter(
                  (r) => r.subjectId.toString() === subjectIdStr
                );
                return (
                  <Box key={subject._id} sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {subject.subjectName} ({subject.subjectId})
                    </Typography>
                    <Typography variant="body2">
                      {subject.description}
                    </Typography>
                    {subjectActive.length === 0 && subjectEnded.length === 0 ? (
                      <Paper sx={{ p: 2, my: 1 }}>
                        <Typography variant="body2" sx={{ mt: 1, color: "red" }}>
                          No attendance session started.
                        </Typography>
                      </Paper>
                    ) : (
                      <>
                        {subjectActive.map((session) => (
                          <Paper key={session._id} sx={{ p: 2, my: 1 }}>
                            <Typography variant="body2">
                              Date: {new Date(session.date).toLocaleDateString()} | Time:{" "}
                              {session.time}
                            </Typography>
                            <Button
                              variant="contained"
                              color="primary"
                              sx={{ mt: 1 }}
                              onClick={() => handleScanFace(subject, session)}
                            >
                              Scan Face
                            </Button>
                          </Paper>
                        ))}
                        {subjectEnded.map((session) => {
                          const studentRecord = session.records.find((r) => {
                            const recId =
                              typeof r.student === "object"
                                ? r.student._id.toString()
                                : r.student.toString();
                            return recId === studentIdStr;
                          });
                          const statusText =
                            studentRecord && studentRecord.present
                              ? "Attendance marked"
                              : "Absent";
                          const statusColor =
                            studentRecord && studentRecord.present
                              ? "green"
                              : "red";
                          return (
                            <Paper key={session._id} sx={{ p: 2, my: 1 }}>
                              <Typography variant="body2">
                                Date: {new Date(session.date).toLocaleDateString()} | Time:{" "}
                                {session.time}
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 1, color: statusColor }}>
                                {statusText}
                              </Typography>
                            </Paper>
                          );
                        })}
                      </>
                    )}
                  </Box>
                );
              })
            )}
          </Box>
        )} */}
        {tabIndex === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              My Attendance Records
            </Typography>
            {records.length === 0 ? (
              <Typography>No attendance records found.</Typography>
            ) : (
              <>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Subject</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Attendance (Present/Total)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {records.map((record) => (
                      <TableRow key={record._id}>
                        <TableCell>{record.subject}</TableCell>
                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell>{record.time}</TableCell>
                        <TableCell>
                          {record.records ? record.records.filter((r) => r.present).length : 0}{" "}
                          / {record.records ? record.records.length : 0}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {/* Pie Chart Section */}
                <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Overall Attendance Summary
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
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
              </>
            )}
          </Box>
        )}
      </Box>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Container>
  );
}

export default StudentDashboard;
