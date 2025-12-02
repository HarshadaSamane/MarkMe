import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  Alert, 
  MenuItem 
} from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/teacher/attendance-records-filtered';

function TeacherAttendanceRecords({ teacherId }) {
  const [subjectFilter, setSubjectFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [records, setRecords] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState(null);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/teacher/subjects?teacher=${teacherId}`);
      setSubjects(res.data.subjects || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching subjects');
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
      setError(err.response?.data?.message || 'Error fetching attendance records');
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchRecords();
  }, [teacherId]);

  const handleFilter = () => {
    fetchRecords();
  };

  const totalPresent = records.reduce((acc, record) => {
    return acc + (record.records ? record.records.filter(r => r.present).length : 0);
  }, 0);
  const totalStudents = records.reduce((acc, record) => {
    return acc + (record.records ? record.records.length : 0);
  }, 0);
  const totalAbsent = totalStudents - totalPresent;
  const pieData = [
    { name: 'Present', value: totalPresent },
    { name: 'Absent', value: totalAbsent }
  ];
  const COLORS = ['#0088FE', '#FF8042'];

  return (
    <Container>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Filter Attendance Records</Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
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
          {records.map(record => (
            <TableRow key={record._id}>
              <TableCell>{record.subject}</TableCell>
              <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
              <TableCell>{record.time}</TableCell>
              <TableCell>
                {record.records ? record.records.filter(r => r.present).length : 0} / {record.records ? record.records.length : 0}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Overall Attendance Summary
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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

export default TeacherAttendanceRecords;
