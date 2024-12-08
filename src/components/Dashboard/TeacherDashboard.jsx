import { useContext, useState, useEffect } from "react";
import { AuthedUserContext } from "../../App";
import axios from "axios";
import "./Dashboard.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Link } from "react-router-dom";

const BACKEND_URL = `${import.meta.env.VITE_EXPRESS_BACKEND_URL}/class`;

const TeacherDashboard = () => {
  const user = useContext(AuthedUserContext);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [classes, setClasses] = useState([]);
  const [date, setDate] = useState(new Date());

  // Fetch teacher's classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(BACKEND_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setClasses(response.data);
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };

    fetchClasses();
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
          <h2>Teacher Dashboard</h2>
          <div className="teacher-profile">
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

        <div className="class-list-section">
          <h3>Your Classes</h3>
          {classes.length === 0 ? (
            <p>No classes found.</p>
          ) : (
            <table className="class-list-table">
              <thead>
                <tr>
                  <th>Class Name</th>
                  <th>Class Code</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((classItem) => (
                  <tr key={classItem._id}>
                    <td>{classItem.className}</td>
                    <td>{classItem.classCode}</td>
                    <td>
                      <Link
                        to={`/class/${classItem._id}`}
                        className="view-link"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
};

export default TeacherDashboard;
