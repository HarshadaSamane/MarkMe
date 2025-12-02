import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
  Box,
} from "@mui/material";
import { useSelector } from "react-redux";
import axios from "axios";

const API_URL = "http://localhost:5000/api/teacher";

function ViewStudents() {
  const teacher = useSelector((state) => state.auth.user);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/studentsbyteacher?teacher=${teacher._id}`
      );
      setStudents(response.data.students);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching students");
    }
  };

  useEffect(() => {
    if (teacher) fetchStudents();
  }, [teacher]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Students Created by You
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {students.length === 0 ? (
          <Typography>No students found.</Typography>
        ) : (
          <Box sx={{ overflowX: "auto", mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Grade</TableCell>
                  <TableCell>Enrollment #</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((s) => (
                  <TableRow key={s._id}>
                    <TableCell>{s._id}</TableCell>
                    <TableCell>{s.fullName}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{s.grade}</TableCell>
                    <TableCell>{s.enrollmentNumber}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default ViewStudents;
