import { AuthedUserContext } from "../../App";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const BACKEND_URL = `${
  import.meta.env.VITE_EXPRESS_BACKEND_URL
}/admin/users/student`;
const ATTENDANCE_URL = `${import.meta.env.VITE_EXPRESS_BACKEND_URL}/attendance`;

const AdminDashboard = () => {
  const user = useContext(AuthedUserContext);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [totalStudents, setTotalStudents] = useState(0);
  const [presentStudents, setPresentStudents] = useState(0);
  const [absentStudents, setAbsentStudents] = useState(0);
  const [date, setDate] = useState(new Date());

  // Fetch total number of students
  useEffect(() => {
    const fetchTotalStudents = async () => {
      try {
        const response = await axios.get(BACKEND_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTotalStudents(response.data.length);
      } catch (err) {
        console.error("Error fetching total students:", err);
      }
    };

    fetchTotalStudents();
  }, []);

  // Fetch attendance data
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(ATTENDANCE_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const attendanceData = response.data;
        const presentCount = attendanceData.filter(
          (record) => record.status === "Present"
        ).length;
        const absentCount = attendanceData.filter(
          (record) => record.status === "Absent"
        ).length;
        setPresentStudents(presentCount);
        setAbsentStudents(absentCount);
      } catch (err) {
        console.error("Error fetching attendance data:", err);
      }
    };

    fetchAttendanceData();
  }, []);

  // Update the time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // Clean up the interval on unmount
  }, []);

  // Format the time and date
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="dashboard-container">
      <div className="dashboard-card">
        <header className="dashboard-header">
          <h2>Admin Dashboard</h2>
          <div className="admin-profile">
            <p>{user.username}</p>
            <p>{user.email}</p>
          </div>
        </header>

        <div className="calendar-section">
          <div className="calendar-container">
            <Calendar
              onChange={setDate}
              value={date}
              className="custom-calendar"
            />
          </div>
          <div className="time-date-container">
            <div className="time-card">
              <h3>{formattedTime}</h3>
              <p>Realtime Insight</p>
            </div>
            <div className="date-card">
              <p>Today</p>
              <h3>{formattedDate}</h3>
            </div>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-box">
            <h3>Total Students</h3>
            <p>{totalStudents}</p>
          </div>
          <div className="stat-box">
            <h3>Present</h3>
            <p>{presentStudents}</p>
          </div>
          <div className="stat-box">
            <h3>Absent</h3>
            <p>{absentStudents}</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
