import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import AttendanceForm from "./AttendanceForm/AttendanceForm";
import AttendanceList from "./AttendanceList";
const BACKEND_URL = `${import.meta.env.VITE_EXPRESS_BACKEND_URL}/class`;

const ClassDetail = () => {
  const { classId } = useParams(); // Extract classId from the URL params
  const [classDetails, setClassDetails] = useState(null);
  const [error, setError] = useState(null);

  // Get token from localStorage (assuming the user is already authenticated)
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch class details when the component mounts
    const fetchClassDetails = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/${classId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add a space after 'Bearer'
          },
        });
        // console.log(response.data);

        setClassDetails(response.data); // Set the response data in state

        console.log(classDetails);
      } catch (err) {
        setError(err.message); // Set any error that occurs
        console.error("Error fetching class details:", err);
      }
    };

    fetchClassDetails();
  }, [classId, token]);

  // Handle loading and error states
  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  // if (!classDetails) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div>
      <h2>Class Details</h2>
      {error && <div>Error: {error}</div>}
      {!classDetails ? (
        <div>Loading...</div>
      ) : (
        <>
          <p>
            <strong>Class Code:</strong> {classDetails.classCode}
          </p>
          <p>
            <strong>Class Name:</strong> {classDetails.className}
          </p>
          <p>
            <strong>Teacher:</strong>{" "}
            {classDetails.teacherId?.username || "No teacher assigned"}
          </p>
          <p>
            <strong>Students:</strong>
          </p>
          <ul>
            {classDetails.students.length > 0 ? (
              classDetails.students.map((student) => (
                <li key={student._id}>
                  {student.username} ({student.email})
                </li>
              ))
            ) : (
              <li>No students enrolled</li>
            )}
          </ul>
          <div>
            <strong>Schedule:</strong>
            {classDetails.schedule.length > 0 ? (
              <ul>
                {classDetails.schedule.map((slot, index) => (
                  <li key={index}>
                    Day: {slot.day}, Start Time: {slot.startTime}, End Time:{" "}
                    {slot.endTime}
                  </li>
                ))}
              </ul>
            ) : (
              "No schedule available"
            )}
          </div>

          <AttendanceForm classId={classId} students={classDetails.students} />
          <AttendanceList classId={classId} />
        </>
      )}
    </div>
  );
};

export default ClassDetail;