import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { AuthedUserContext } from "../../App";
import AttendanceForm from "../AttendanceForm/AttendanceForm";
import ClassStudentAttendance from "../ClassStudentAttendance/ClassStudentAttendance";
import "./ClassDetail.css";

const BACKEND_URL = `${import.meta.env.VITE_EXPRESS_BACKEND_URL}/class`;

const ClassDetail = () => {
  const user = useContext(AuthedUserContext);
  const { classId } = useParams();
  const [classDetails, setClassDetails] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/${classId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClassDetails(response.data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching class details:", err);
      }
    };

    fetchClassDetails();
  }, [classId, token]);

  const sortedSchedule = classDetails?.schedule.sort((a, b) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayComparison = daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
    if (dayComparison !== 0) return dayComparison;
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <main className="dashboard-container">
      <div className="dashboard-card">
        <h2 className="class-detail-header">Class Details</h2>
        {error && <div className="error-message">Error: {error}</div>}
        {!classDetails ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="class-detail-content">
            <div className="class-info-container">
              <h3>Class Information</h3>
              <form className="class-info-form">
                <div className="form-field">
                  <label htmlFor="classCode">Class Code:</label>
                  <input
                    type="text"
                    id="classCode"
                    value={classDetails.classCode}
                    disabled
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="className">Class Name:</label>
                  <input
                    type="text"
                    id="className"
                    value={classDetails.className}
                    disabled
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="teacherName">Teacher:</label>
                  <input
                    type="text"
                    id="teacherName"
                    value={
                      classDetails.teacherId?.username || "No teacher assigned"
                    }
                    disabled
                  />
                </div>
                <div className="schedule-list">
                  <strong>Schedule:</strong>
                  {sortedSchedule.length > 0 ? (
                    <ul>
                      {sortedSchedule.map((slot, index) => (
                        <li key={index} className="schedule-item">
                          <div>Day: {slot.day}</div>
                          <div>Start Time: {slot.startTime}</div>
                          <div>End Time: {slot.endTime}</div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "No schedule available"
                  )}
                </div>
              </form>
            </div>
            <div className="attendance-form-container">
              {user.role === "teacher" ? (
                <>
                  <AttendanceForm
                    classId={classId}
                    students={classDetails.students}
                    ClassDetail={classDetails}
                  />
                  <Link
                    to={`/class/${classId}/view-attendance`}
                    className="view-attendance-link"
                  >
                    View Attendance Records
                  </Link>
                </>
              ) : user.role === "student" ? (
                <ClassStudentAttendance classId={classId} />
              ) : (
                <p>Access denied</p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ClassDetail;
