import { AuthedUserContext } from "../../App";
import { useContext } from "react";
import AdminDashboard from "./AdminDashboard";
import TeacherDashboard from "./TeacherDashboard";
import StudentDashboard from "./StudentDashboard";
import "./Dashboard.css";

const Dashboard = () => {
  const user = useContext(AuthedUserContext);

  if (user.role === "admin") {
    return <AdminDashboard />;
  } else if (user.role === "teacher") {
    return <TeacherDashboard />;
  } else if (user.role === "student") {
    return <StudentDashboard />;
  }

  return (
    <main className="dashboard-container">
      <div className="welcome-card">
        <div className="welcome-text">
          <h1>Welcome, {user.username}!</h1>
          <p>
            This is your personal dashboard where you can see all your things.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
