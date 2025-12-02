import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import UserSelect from "./pages/UserSelect";
import Protected from "./pages/Protected";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/AboutUs";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import UpdateProfile from "./components/UpdateProfile";
import TeacherScanFaceList from "./pages/TeacherScanFaceList";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="user-select/:studentId" element={<UserSelect />} />
        <Route path="login" element={<Login />} />
        <Route path="about-us" element={<About />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="update-profile" element={<UpdateProfile />} />
        <Route path="teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="student-dashboard" element={<StudentDashboard />} />
        <Route path="teacher-scan-face" element={<TeacherScanFaceList />} />
        <Route path="protected" element={<Protected />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </>
  ),
  { basename: "/" }
);

export default router;
