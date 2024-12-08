import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./ClassDetailAdmin.css";

const BACKEND_URL = `${import.meta.env.VITE_EXPRESS_BACKEND_URL}/admin/class`;

const ClassDetailAdmin = ({ handleUpdateClass, handleDeleteClass }) => {
  const { classId } = useParams();
  const [classDetails, setClassDetails] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/${classId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClassDetails(response.data);
        setFormData(response.data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchClassDetails();
  }, [classId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleUpdateClass(classId, formData);
    navigate("/admin/class");
  };

  const handleDelete = async () => {
    await handleDeleteClass(classId);
    navigate("/admin/class");
  };

  if (error) return <div>Error: {error}</div>;
  if (!classDetails) return <div>Loading...</div>;

  return (
    <div className="class-detail-admin-container">
      <h2 className="class-detail-admin-header">Class Details</h2>
      <form onSubmit={handleSubmit} className="class-detail-admin-form">
        <div className="form-field">
          <label>Class Name:</label>
          <input
            type="text"
            name="className"
            value={formData.className || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Class Code:</label>
          <input
            type="text"
            name="classCode"
            value={formData.classCode || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Teacher:</label>
          <input
            type="text"
            name="teacherId"
            value={formData.teacherId || ""}
            onChange={handleChange}
          />
        </div>
        <button className="update-button" type="submit">
          Update Class
        </button>
        <button className="delete-button" type="button" onClick={handleDelete}>
          Delete Class
        </button>
      </form>
    </div>
  );
};

export default ClassDetailAdmin;
