import { useEffect, useState } from "react";
import axios from "axios";
import "./MangeStudent.css";

const BACKEND_URL = `${
  import.meta.env.VITE_EXPRESS_BACKEND_URL
}/admin/users/student`;

const MangeStudent = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(BACKEND_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudents(response.data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching student details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const filteredStudents = students.filter((student) =>
    student.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p className="loading-message">Loading students...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className="student-list-container">
      <h1>Manage Students</h1>
      <input
        type="text"
        placeholder="Search by name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      <p>Total Students: {filteredStudents.length}</p>
      {filteredStudents.length === 0 ? (
        <p>No Students found.</p>
      ) : (
        <table className="student-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={student._id}>
                <td>{index + 1}</td>
                <td className="student-username">{student.username}</td>
                <td className="student-email">{student.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MangeStudent;
