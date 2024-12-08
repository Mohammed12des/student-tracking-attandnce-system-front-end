import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AttendenceForm.css";
const BACKEND_URL = `${import.meta.env.VITE_EXPRESS_BACKEND_URL}/attendance`;

const AttendanceForm = ({ classId, students = [], ClassDetail }) => {
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [date, setDate] = useState("");
  const [existingAttendance, setExistingAttendance] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExistingAttendance = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/index/${classId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExistingAttendance(response.data);
      } catch (err) {
        console.error("Error fetching existing attendance:", err);
      }
    };

    fetchExistingAttendance();
  }, [classId, token]);

  useEffect(() => {
    const setLastClassDate = () => {
      const currentDate = new Date();
      const currentDay = currentDate.getDay();
      const classDay = new Date(ClassDetail.schedule[0].day).getDay(); // Assuming the class has a schedule and taking the first day
      const daysSinceLastClass = (currentDay + 7 - classDay) % 7 || 7;
      const lastClassDate = new Date(currentDate);
      lastClassDate.setDate(currentDate.getDate() - daysSinceLastClass);
      setDate(lastClassDate.toISOString().split("T")[0]);
    };

    setLastClassDate();
  }, [ClassDetail]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceRecords((prev) => ({ ...prev, [studentId]: status }));
  };

  const submitAttendance = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/new/${classId}`,
        {
          attendanceRecords,
          date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate(`/class/${classId}/view-attendance`);
    } catch (err) {
      console.error("Error marking attendance:", err);
    }
  };

  const getPreviousClassDate = () => {
    const currentDate = new Date(date);
    const currentDay = currentDate.getDay();
    const classDay = new Date(ClassDetail.schedule[0].day).getDay(); // Assuming the class has a schedule and taking the first day
    const daysSinceLastClass = (currentDay + 7 - classDay) % 7 || 7;
    const previousClassDate = new Date(currentDate);
    previousClassDate.setDate(currentDate.getDate() - daysSinceLastClass);
    setDate(previousClassDate.toISOString().split("T")[0]);
  };

  const isClassDay = (date) => {
    const dayOfWeek = new Date(date).getDay();
    const classDay = new Date(ClassDetail.schedule[0].day).getDay();
    return dayOfWeek === classDay;
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    if (isClassDay(selectedDate)) {
      setDate(selectedDate);
    } else {
      alert("You can only select the class day.");
    }
  };

  // Disable future dates
  const maxDate = new Date().toISOString().split("T")[0];

  // Check if attendance for the selected date already exists
  const isAttendanceMarked = existingAttendance.some(
    (record) => record.date === date
  );

  return (
    <div className="attendance-form-container">
      <h2 className="attendance-form-header">Mark Attendance</h2>
      <label className="attendance-date-label">Date:</label>
      <input
        type="date"
        className="attendance-date-input"
        value={date}
        onChange={handleDateChange}
        max={maxDate}
      />
      <button
        className="attendance-button secondary"
        onClick={getPreviousClassDate}
      >
        Find Previous Class
      </button>
      {isAttendanceMarked ? (
        <p>Attendance for this date has already been marked.</p>
      ) : (
        <>
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student._id}>
                    <td className="attendance-student-name">
                      {student.username}
                    </td>
                    <td>
                      <div className="attendance-radio-group">
                        <label>
                          <input
                            type="radio"
                            name={`status-${student._id}`}
                            value="Present"
                            onChange={() =>
                              handleAttendanceChange(student._id, "Present")
                            }
                          />
                          Present
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`status-${student._id}`}
                            value="Absent"
                            onChange={() =>
                              handleAttendanceChange(student._id, "Absent")
                            }
                          />
                          Absent
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`status-${student._id}`}
                            value="Late"
                            onChange={() =>
                              handleAttendanceChange(student._id, "Late")
                            }
                          />
                          Late
                        </label>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No students enrolled</td>
                </tr>
              )}
            </tbody>
          </table>
          <button className="attendance-button" onClick={submitAttendance}>
            Submit Attendance
          </button>
        </>
      )}
    </div>
  );
};

export default AttendanceForm;
