import { useEffect, useState } from "react";
import axios from "axios";
import "./MangeTeacher.css";

const BACKEND_URL = `${
  import.meta.env.VITE_EXPRESS_BACKEND_URL
}/admin/users/teacher`;

const MangeTeacher = () => {
  const [teachers, setTeachers] = useState([]);
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
        setTeachers(response.data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching teacher details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p className="loading-message">Loading teachers...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className="teacher-list-container">
      <h1>Manage Teachers</h1>
      <input
        type="text"
        placeholder="Search by name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      <p>Total Teachers: {filteredTeachers.length}</p>
      {filteredTeachers.length === 0 ? (
        <p>No Teachers found.</p>
      ) : (
        <table className="teacher-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.map((teacher, index) => (
              <tr key={teacher._id}>
                <td>{index + 1}</td>
                <td className="teacher-username">{teacher.username}</td>
                <td className="teacher-email">{teacher.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MangeTeacher;
