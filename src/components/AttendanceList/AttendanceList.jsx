import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  getAttendance,
  updateAttendance,
} from "../../services/attendenceService";
import { formatDate } from "../../utils/dateFormatter";
import { AuthedUserContext } from "../../App";
import "./AttendenceList.css";

const AttendanceList = () => {
  const { classId } = useParams();
  const user = useContext(AuthedUserContext);
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editRecord, setEditRecord] = useState(null);
  const [status, setStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const data = await getAttendance(classId);
        setAttendance(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching attendance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [classId]);

  const handleEditClick = (record) => {
    setEditRecord(record);
    setStatus(record.status);
  };

  const handleUpdateAttendance = async (recordId) => {
    try {
      await updateAttendance(recordId, { status });
      setAttendance((prev) =>
        prev.map((record) =>
          record._id === recordId ? { ...record, status } : record
        )
      );
      setEditRecord(null);
    } catch (err) {
      console.error("Error updating attendance:", err);
      setError(err.message);
    }
  };

  const isToday = (date) => {
    const today = new Date().toISOString().split("T")[0];
    return date === today;
  };

  const filteredAttendance = attendance
    .filter((record) =>
      record.studentId.username
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date in descending order

  if (loading) return <p>Loading attendance...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main className="dashboard-container">
      <div className="dashboard-card">
        <h2 className="attendance-header">Attendance Records for the Class</h2>
        <input
          type="text"
          placeholder="Search by student name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {filteredAttendance.length === 0 ? (
          <p>No attendance records found.</p>
        ) : user.role === "teacher" ? (
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((record) => (
                <tr key={record._id}>
                  <td>{record.studentId.username}</td>
                  <td>{formatDate(record.date)}</td>
                  <td>
                    {editRecord && editRecord._id === record._id ? (
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Late">Late</option>
                      </select>
                    ) : (
                      <span
                        className={`attendance-status ${
                          record.status.toLowerCase() === "present"
                            ? "present"
                            : record.status.toLowerCase() === "absent"
                            ? "absent"
                            : "late"
                        }`}
                      >
                        {record.status}
                      </span>
                    )}
                  </td>
                  <td>
                    {editRecord && editRecord._id === record._id ? (
                      <>
                        <button
                          onClick={() => handleUpdateAttendance(record._id)}
                        >
                          Update
                        </button>
                        <button onClick={() => setEditRecord(null)}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      user.role === "teacher" &&
                      !isToday(record.date) && (
                        <button onClick={() => handleEditClick(record)}>
                          Edit
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <ul className="attendance-list">
            {filteredAttendance.map((record) => (
              <li key={record._id}>
                <span className="attendance-student-name">
                  {record.studentId.username}
                </span>
                <span className="attendance-date">
                  {formatDate(record.date)}
                </span>
                {editRecord && editRecord._id === record._id ? (
                  <>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Late">Late</option>
                    </select>
                    <button onClick={() => handleUpdateAttendance(record._id)}>
                      Update
                    </button>
                    <button onClick={() => setEditRecord(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <span
                      className={`attendance-status ${
                        record.status.toLowerCase() === "present"
                          ? "present"
                          : "absent"
                      }`}
                    >
                      {record.status}
                    </span>
                    {user.role === "teacher" && !isToday(record.date) && (
                      <button onClick={() => handleEditClick(record)}>
                        Edit
                      </button>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default AttendanceList;
