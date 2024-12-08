import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ClassList.css";

const BACKEND_URL = `${import.meta.env.VITE_EXPRESS_BACKEND_URL}/class`;

const ClassList = () => {
  const [classes, setClasses] = useState([]);
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

  if (loading) return <p>Loading classes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="class-list-container">
      <header className="class-list-header">
        <h1>My Classes</h1>
      </header>
      <div className="class-cards">
        {classes.length === 0 ? (
          <p>No classes found.</p>
        ) : (
          classes.map((classItem, index) => (
            <div key={classItem._id} className="class-card">
              <div className="class-card-info">
                <span className="class-card-number">{index + 1}</span>
                <span className="class-card-name">
                  {classItem.className} ({classItem.classCode})
                </span>
              </div>
              <Link
                to={`/class/${classItem._id}`}
                className="class-card-link"
                title="View Details"
              >
                ✏️
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClassList;
