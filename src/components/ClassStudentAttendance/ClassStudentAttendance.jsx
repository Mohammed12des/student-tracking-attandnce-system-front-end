import { useEffect, useState, useContext } from "react";
import { getClassStudentAttendance } from "../../services/classStudentService";
import { AuthedUserContext } from "../../App";
import { formatDate } from "../../utils/dateFormatter";
import "./ClassStudentAttendence.css";

const ClassStudentAttendance = ({ classId }) => {
  const user = useContext(AuthedUserContext);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassStudentAttendance = async () => {
      try {
        const data = await getClassStudentAttendance(classId, user._id);
        setAttendanceRecords(data.attendanceRecords);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching class and student attendance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClassStudentAttendance();
  }, [classId, user._id]);

  const sortedAttendanceRecords = attendanceRecords.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  if (loading) return <p>Loading attendance records...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="class-student-attendance-container">
      <h1 className="attendance-header">Attendance Records</h1>
      {sortedAttendanceRecords.length === 0 ? (
        <p>No attendance records found for this student.</p>
      ) : (
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedAttendanceRecords.map((record) => (
              <tr key={record._id}>
                <td>{formatDate(record.date)}</td>
                <td
                  className={`attendance-status ${record.status.toLowerCase()}`}
                >
                  {record.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClassStudentAttendance;
