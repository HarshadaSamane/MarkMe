import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const TeacherScanFaceList = ({ teacherId }) => {
  const [students, setStudents] = useState([]);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessionAndStudents = async () => {
      try {
        // 1) Get the active attendance session
        const recRes = await axios.get(
          `http://localhost:5000/api/teacher/attendance-records?teacher=${teacherId}`
        );
        const active = recRes.data.records.find((r) => r.isActive);
        if (!active) {
          setLoading(false);
          return;
        }
        setSession(active);

        // 2) Get the teacher's subjects (which already come with populated students)
        const subjRes = await axios.get(
          `http://localhost:5000/api/teacher/subjects?teacher=${teacherId}`
        );
        const currentSubject = subjRes.data.subjects.find(
          (s) => s.subjectId === active.subjectId
        );

        // 3) Use the students array already returned by the backend
        if (currentSubject && currentSubject.students.length) {
          setStudents(currentSubject.students);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndStudents();
  }, [teacherId]);

  const isMarked = (studentId) =>
    session?.records?.some(
      (r) => r.student.toString() === studentId.toString()
    );

  const handleScan = (studentId) => {
    const student = students.find((s) => s._id === studentId);
    navigate(`/user-select/${studentId}?sessionId=${session._id}`,{ state: { student } });
  };

  if (loading) return <CircularProgress />;

  if (!session)
    return <Typography>No active attendance session found.</Typography>;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Mark Attendance for {session.subject}
      </Typography>
      <List>
        {students.map((student) => (
          <ListItem
            key={student._id}
            secondaryAction={
              isMarked(student._id) ? (
                <CheckCircleIcon color="success" />
              ) : (
                <Button
                  variant="contained"
                  onClick={() => handleScan(student._id)}
                >
                  Scan Face
                </Button>
              )
            }
          >
            <ListItemText
              primary={student.fullName}
              secondary={student.enrollmentNumber}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TeacherScanFaceList;
