import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ClassListAdmin.css";
import { FaEdit, FaTrash } from "react-icons/fa"; // Importing icons

const BACKEND_URL = `${import.meta.env.VITE_EXPRESS_BACKEND_URL}/admin/class`;

const ClassListAdmin = () => {
  const [classes, setClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(BACKEND_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClasses(response.data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching class details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleDelete = async (classId) => {
    try {
      await axios.delete(`${BACKEND_URL}/${classId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClasses(classes.filter((classItem) => classItem._id !== classId));
    } catch (err) {
      console.error("Error deleting class:", err);
      setError(err.message);
    }
  };

  const filteredClasses = classes.filter(
    (classItem) =>
      classItem.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.classCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p className="loading-message">Loading classes...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className="class-list-container">
      <h1>Class List</h1>
      <div className="header-actions">
        <button
          className="add-class-button"
          onClick={() => navigate("/admin/class/new")}
        >
          Add Class
        </button>
        <input
          type="text"
          placeholder="Search by class name or code"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>
      <p className="class-count">Total Classes: {filteredClasses.length}</p>
      {filteredClasses.length === 0 ? (
        <p>No classes found.</p>
      ) : (
        <table className="class-list-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Class Name</th>
              <th>Class Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClasses.map((classItem, index) => (
              <tr
                key={classItem._id}
                className={index % 2 === 0 ? "even-row" : "odd-row"}
              >
                <td>{index + 1}</td>
                <td>{classItem.className}</td>
                <td>{classItem.classCode}</td>
                <td className="actions">
                  <button
                    className="icon-button update-button"
                    onClick={() => navigate(`/admin/class/${classItem._id}`)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="icon-button delete-button"
                    onClick={() => handleDelete(classItem._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClassListAdmin;
