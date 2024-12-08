import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { newClass } from "../../services/classService";
import "./ClassForm.css";

const BACKEND_URL = `${import.meta.env.VITE_EXPRESS_BACKEND_URL}/admin/users`;

const timeOptions = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const ClassForm = ({ handleAddClass }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    className: "",
    classCode: "",
    teacherId: "",
    students: [],
    schedule: [{ day: "", startTime: "", endTime: "" }],
  });
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchStudentsAndTeachers = async () => {
      try {
        const [studentsResponse, teachersResponse] = await Promise.all([
          axios.get(`${BACKEND_URL}/student`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get(`${BACKEND_URL}/teacher`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);
        setStudents(studentsResponse.data);
        setTeachers(teachersResponse.data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching students and teachers:", err);
      }
    };

    fetchStudentsAndTeachers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedule = formData.schedule.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setFormData({
      ...formData,
      schedule: updatedSchedule,
    });
  };

  const handleStudentChange = (studentId) => {
    setFormData((prevFormData) => {
      const students = prevFormData.students.includes(studentId)
        ? prevFormData.students.filter((id) => id !== studentId)
        : [...prevFormData.students, studentId];
      return { ...prevFormData, students };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data:", formData); // Debug log
    try {
      await newClass(formData);
      navigate("/admin/class");
    } catch (error) {
      console.error("Error adding class:", error);
      setError(error.response?.data?.message || "Failed to add class");
    }
  };

  const filteredStudents = students.filter((student) =>
    student.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="dashboard-container">
      <div className="dashboard-card">
        <header className="dashboard-header">
          <h2>Add New Class</h2>
        </header>
        <form onSubmit={handleSubmit} className="class-form">
          <div className="form-left">
            <div className="input-group">
              <label>Class Name:</label>
              <input
                type="text"
                name="className"
                value={formData.className}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            <div className="input-group">
              <label>Class Code:</label>
              <input
                type="text"
                name="classCode"
                value={formData.classCode}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            <div className="input-group">
              <label>Teacher:</label>
              <select
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select Teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.username} - {teacher.email}
                  </option>
                ))}
              </select>
            </div>
            {formData.schedule.map((item, index) => (
              <div key={index} className="input-group schedule-group">
                <label>Schedule :</label>
                <select
                  value={item.day}
                  onChange={(e) =>
                    handleScheduleChange(index, "day", e.target.value)
                  }
                  required
                  className="input-field"
                >
                  <option value="">Select Day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
                <select
                  value={item.startTime}
                  onChange={(e) =>
                    handleScheduleChange(index, "startTime", e.target.value)
                  }
                  required
                  className="input-field"
                >
                  <option value="">Select Start Time</option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <select
                  value={item.endTime}
                  onChange={(e) =>
                    handleScheduleChange(index, "endTime", e.target.value)
                  }
                  required
                  className="input-field"
                >
                  <option value="">Select End Time</option>
                  {timeOptions
                    .filter((time) => time > item.startTime)
                    .map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                </select>
              </div>
            ))}
          </div>
          <div className="form-right">
            <div className="input-group">
              <label>Students:</label>
              <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
              />
              <div className="student-table">
                <table>
                  <thead>
                    <tr>
                      <th>Select</th>
                      <th>Name</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student._id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={formData.students.includes(student._id)}
                            onChange={() => handleStudentChange(student._id)}
                          />
                        </td>
                        <td>{student.username}</td>
                        <td>{student.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="form-footer">
            <button type="submit" className="submit-button">
              Add Class
            </button>
            {error && <p className="error-message">Error: {error}</p>}
          </div>
        </form>
      </div>
    </main>
  );
};

export default ClassForm;
