import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Typography,
  Alert,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import axios from "axios";
import { useSelector } from "react-redux";

const API_URL = "http://localhost:5000/api/teacher";

function SubjectsDashboard() {
  const teacher = useSelector((state) => state.auth.user);
  const [subjects, setSubjects] = useState([]);
  const [subjectError, setSubjectError] = useState(null);
  const [subjectSuccess, setSubjectSuccess] = useState(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [subjectForm, setSubjectForm] = useState({
    subjectName: "",
    subjectId: "",
    description: "",
  });

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [addError, setAddError] = useState(null);
  const [addSuccess, setAddSuccess] = useState(null);

  const [viewAddedOpen, setViewAddedOpen] = useState(false);
  const [addedStudents, setAddedStudents] = useState([]);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/subjects?teacher=${teacher._id}`
      );
      setSubjects(response.data.subjects);
    } catch (err) {
      setSubjectError(err.response?.data?.message || "Error fetching subjects");
    }
  };

  useEffect(() => {
    if (teacher) {
      fetchSubjects();
    }
  }, [teacher]);

  const handleSubjectFormChange = (e) => {
    const { name, value } = e.target;
    setSubjectForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubject = async () => {
    try {
      const data = { ...subjectForm, teacher: teacher._id };
      const response = await axios.post(`${API_URL}/create-subject`, data);
      setSubjectSuccess(response.data.message);
      setSubjectForm({ subjectName: "", subjectId: "", description: "" });
      fetchSubjects();
      setCreateOpen(false);
    } catch (err) {
      setSubjectError(err.response?.data?.message || "Error creating subject");
    }
  };

  const handleOpenAddStudent = async (subject) => {
    setSelectedSubject(subject);
    setAddError(null);
    setAddSuccess(null);
    try {
      const response = await axios.get(
        `${API_URL}/students?teacher=${teacher._id}`
      );
      const addedIds = subject.students.map((s) => s._id);
      const filtered = response.data.students.filter(
        (student) => !addedIds.includes(student._id)
      );
      setAvailableStudents(filtered);
      setAddStudentOpen(true);
    } catch (err) {
      setAddError(err.response?.data?.message || "Error fetching students");
    }
  };

  const handleAddStudent = async (studentId) => {
    try {
      const response = await axios.put(
        `${API_URL}/subject/${selectedSubject.subjectId}/add-student`,
        { studentId }
      );
      setAddSuccess(response.data.message);
      setSelectedSubject(response.data.subject);
      setAvailableStudents((prev) =>
        prev.filter((student) => student._id !== studentId)
      );
      fetchSubjects();
    } catch (err) {
      setAddError(
        err.response?.data?.message || "Error adding student to subject"
      );
    }
  };

  const handleViewAddedStudents = (subject) => {
    setSelectedSubject(subject);
    setAddedStudents(subject.students || []);
    setViewAddedOpen(true);
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={() => setCreateOpen(true)}>
          Create Subject
        </Button>
      </Box>

      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create Subject</DialogTitle>
        <DialogContent>
          {subjectError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {subjectError}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Subject Name"
                name="subjectName"
                value={subjectForm.subjectName}
                onChange={handleSubjectFormChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Subject ID"
                name="subjectId"
                value={subjectForm.subjectId}
                onChange={handleSubjectFormChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Subject Description"
                name="description"
                value={subjectForm.description}
                onChange={handleSubjectFormChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateSubject}
            variant="contained"
            color="primary"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Your Subjects</Typography>
        {subjects.length === 0 ? (
          <Typography>No subjects created.</Typography>
        ) : (
          <Box sx={{ mt: 2 }}>
            {subjects.map((subj) => (
              <Paper
                key={subj._id}
                sx={{
                  p: 2,
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderRadius: 1,
                }}
                elevation={3}
              >
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", color: "#1976d2" }}
                  >
                    {subj.subjectName} ({subj.subjectId})
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#424242" }}>
                    {subj.description}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => handleOpenAddStudent(subj)}
                  >
                    Add Student
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleViewAddedStudents(subj)}
                  >
                    View Students
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Box>

      <Dialog
        open={addStudentOpen}
        onClose={() => setAddStudentOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Student to {selectedSubject?.subjectName}</DialogTitle>
        <DialogContent>
          {addError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {addError}
            </Alert>
          )}
          {addSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {addSuccess}
            </Alert>
          )}
          <Typography variant="body2" sx={{ mb: 2 }}>
            Select a student to add to this subject:
          </Typography>
          {availableStudents.length === 0 ? (
            <Typography>No available students.</Typography>
          ) : (
            <Box>
              {availableStudents.map((student) => (
                <Box
                  key={student._id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid #ccc",
                    borderRadius: 1,
                    p: 1,
                    mb: 1,
                  }}
                >
                  <Typography>{student.fullName}</Typography>
                  <Box>
                    <IconButton onClick={() => handleAddStudent(student._id)}>
                      <CheckCircle color="success" />
                    </IconButton>
                    <IconButton>
                      <Cancel color="error" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddStudentOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={viewAddedOpen}
        onClose={() => setViewAddedOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Students in {selectedSubject?.subjectName}</DialogTitle>
        <DialogContent>
          {addedStudents.length === 0 ? (
            <Typography>No students added.</Typography>
          ) : (
            <List>
              {addedStudents.map((student) => (
                <ListItem key={student._id}>
                  <ListItemText
                    primary={student.fullName}
                    secondary={student.email}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewAddedOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SubjectsDashboard;
