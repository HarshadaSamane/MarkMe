import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Tabs, Tab, Box } from "@mui/material";
import CreateStudent from "./CreateStudent";
import ViewStudents from "./ViewStudents";
import Attendance from "./Attendance";
import SubjectsDashboard from "./SubjectsDashboard";
import TeacherAttendanceRecords from "./TeacherAttendanceRecords";
import { useSelector } from "react-redux";
import TeacherAttendanceFilter from "./TeacherAttendanceFilter";
import TeacherScanFaceList from "./TeacherScanFaceList";

function TeacherDashboard() {
  const { state } = useLocation();
  const initial =
    state && typeof state.initialTab === "number" ? state.initialTab : 0;
  const user = useSelector((state) => state.auth.user);
  console.log("user teacher dashboard : ", user);
  const [tabIndex, setTabIndex] = useState(initial);

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        centered
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          "& .MuiTabs-scrollButtons": {
            width: 48,
            height: 48,
          },
          "& .MuiTabs-scrollButtons svg": {
            fontSize: 32,
          },
        }}
      >
        <Tab label="Create Student" />
        <Tab label="View Students" />
        <Tab label="Attendance" />
        <Tab label="Scan Face Attendance" />
        <Tab label="Subjects" />
        <Tab label="Attendance Records" />
        <Tab label="Filtered Attendance" />
      </Tabs>
      <Box sx={{ mt: 4 }}>
        {tabIndex === 0 && <CreateStudent />}
        {tabIndex === 1 && <ViewStudents />}
        {tabIndex === 2 && <Attendance onStart={() => setTabIndex(3)}/>}
        {tabIndex === 3 && <TeacherScanFaceList teacherId={user._id} />}
        {tabIndex === 4 && <SubjectsDashboard />}
        {tabIndex === 5 && <TeacherAttendanceRecords teacherId={user._id} />}
        {tabIndex === 6 && <TeacherAttendanceFilter teacherId={user._id} />}
      </Box>
    </Container>
  );
}

export default TeacherDashboard;
