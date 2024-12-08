import { useContext, useState, useEffect } from "react";
import { AuthedUserContext } from "../../App";
import axios from "axios";
import "./Dashboard.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const BACKEND_URL = `${import.meta.env.VITE_EXPRESS_BACKEND_URL}/class`;
const ATTENDANCE_URL = `${import.meta.env.VITE_EXPRESS_BACKEND_URL}/attendance`;

const StudentDashboard = () => {
  const user = useContext(AuthedUserContext);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [classes, setClasses] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [presentPercentage, setPresentPercentage] = useState(0);
  const [absentPercentage, setAbsentPercentage] = useState(0);
  const [date, setDate] = useState(new Date());

  // Fetch student's classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/student/${user._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setClasses(response.data);
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };

    fetchClasses();
  }, [user._id]);

  // Fetch attendance data for each class
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const attendancePromises = classes.map((classItem) =>
          axios.get(
            `${ATTENDANCE_URL}/class/${classItem._id}/student/${user._id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
        );
        const attendanceResponses = await Promise.all(attendancePromises);
        const allAttendanceData = attendanceResponses.flatMap(
          (response) => response.data
        );
        setAttendanceData(allAttendanceData);
      } catch (err) {
        console.error("Error fetching attendance data:", err);
      }
    };

    if (classes.length > 0) {
      fetchAttendanceData();
    }
  }, [classes, user._id]);

  // Calculate percentages
  useEffect(() => {
    if (attendanceData.length > 0) {
      const totalRecords = attendanceData.length;
      const presentCount = attendanceData.filter(
        (record) => record.status === "Present"
      ).length;
      const absentCount = attendanceData.filter(
        (record) => record.status === "Absent"
      ).length;

      setPresentPercentage(((presentCount / totalRecords) * 100).toFixed(2));
      setAbsentPercentage(((absentCount / totalRecords) * 100).toFixed(2));
    }
  }, [attendanceData]);

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
          <h2>Student Dashboard</h2>
          <div className="student-profile">
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

        <div className="attendance-stats">
          <h3>Attendance Statistics</h3>
          <p>Present: {presentPercentage}%</p>
          <p>Absent: {absentPercentage}%</p>
        </div>
      </div>
    </main>
  );
};

export default StudentDashboard;
