import { useState, createContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Landing from "./components/Landing/Landing";
import Dashboard from "./components/Dashboard/Dashboard";
import SignupForm from "./components/SignupForm/SignupForm";
import SigninForm from "./components/SigninForm/SigninForm";
import ClassForm from "./components/ClassForm/ClassForm";
import About from "./components/About/About";
import * as authService from "../src/services/authService";
import * as classService from "./services/classService";
import ClassDetail from "./components/ClassDetail/ClassDetail";
import ClassList from "./components/ClassList/ClassList";
import ClassListAdmin from "./components/ClassListAdmin/ClassListAdmin";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import MangeTeacher from "./components/MangeTeacher/MangeTeacher";
import MangeStudent from "./components/MangeStudent/MangeStudent";
import ClassDetailAdmin from "./components/ClassDetailAdmin/ClassDetailAdmin";
import ClassStudentAttendance from "./components/ClassStudentAttendance/ClassStudentAttendance";
import AttendanceList from "./components/AttendanceList/AttendanceList";
import Footer from "./components/Footer/Footer";

export const AuthedUserContext = createContext(null);

const App = () => {
  const [user, setUser] = useState(authService.getUser());
  const navigate = useNavigate();

  const handleAddClass = async (classFormData) => {
    try {
      const response = await classService.newClass(classFormData);
      console.log("Class added:", response);
    } catch (err) {
      console.error("Error adding class:", err.response || err.message);
    }
  };

  const handleUpdateClass = async (classId, classFormData) => {
    try {
      await classService.updateClass(classId, classFormData);
    } catch (err) {
      console.error("Error updating class:", err);
    }
  };

  const handleDeleteClass = async (classId) => {
    try {
      await classService.deleteClass(classId);
    } catch (err) {
      console.error("Error deleting class:", err);
    }
  };

  const handleSignout = () => {
    authService.signout();
    setUser(null);
  };

  return (
    <AuthedUserContext.Provider value={user}>
      <NavBar user={user} handleSignout={handleSignout} />
      <main>
        <Routes>
          {user ? (
            <>
              {/* Common routes for all users */}
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/about" element={<About />} />

              {/* Routes for admin only */}
              {user.role === "admin" && (
                <>
                  <Route
                    path="/admin/users"
                    element={<AdminDashboard user={user} />}
                  />
                  <Route
                    path="/admin/users/teacher"
                    element={<MangeTeacher user={user} />}
                  />
                  <Route
                    path="/admin/users/student"
                    element={<MangeStudent user={user} />}
                  />
                  <Route
                    path="/admin/class/new"
                    element={<ClassForm handleAddClass={handleAddClass} />}
                  />
                  <Route path="/admin/class" element={<ClassListAdmin />} />
                  <Route
                    path="/admin/class/:classId"
                    element={
                      <ClassDetailAdmin
                        handleUpdateClass={handleUpdateClass}
                        handleDeleteClass={handleDeleteClass}
                      />
                    }
                  />
                </>
              )}

              {/* Routes for teacher only */}
              {user.role === "teacher" && (
                <>
                  <Route path="/class" element={<ClassList />} />
                  <Route path="/class/:classId" element={<ClassDetail />} />
                  <Route
                    path="/class/:classId/view-attendance"
                    element={<AttendanceList />}
                  />
                </>
              )}

              {/* Routes for student only */}
              {user.role === "student" && (
                <>
                  <Route path="/class" element={<ClassList />} />
                  <Route path="/class/:classId" element={<ClassDetail />} />
                </>
              )}
            </>
          ) : (
            <>
              {/* Routes for non-authenticated users */}
              <Route path="/" element={<Landing />} />
              <Route
                path="/signup"
                element={<SignupForm setUser={setUser} />}
              />
              <Route
                path="/signin"
                element={<SigninForm setUser={setUser} />}
              />
              <Route path="/about" element={<About />} />
            </>
          )}
        </Routes>
      </main>
      <Footer />
    </AuthedUserContext.Provider>
  );
};

export default App;
