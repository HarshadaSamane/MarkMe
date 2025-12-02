import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
} from "@mui/material";
import axios from "axios";

const API_URL = "http://localhost:5000/api/teacher";

function AttendanceRecords() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);

  const fetchRecords = async () => {
    try {
      const response = await axios.get(`${API_URL}/attendance-records`);
      setRecords(response.data.records);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching records");
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Lecture ID,Subject,Date,Time\n";
    records.forEach((record) => {
      csvContent += `${record.id},${record.subject},${record.date},${record.time}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attendance_records.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Attendance Records
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {records.length === 0 ? (
          <Typography>No records found.</Typography>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Lecture ID</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.id}</TableCell>
                    <TableCell>{record.subject}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              variant="contained"
              color="primary"
              onClick={exportCSV}
              sx={{ mt: 2 }}
            >
              Export CSV
            </Button>
          </>
        )}
      </Paper>
    </Container>
  );
}

export default AttendanceRecords;
