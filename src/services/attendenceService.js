import axios from "axios";
const BACKEND_URL = `${import.meta.env.VITE_EXPRESS_BACKEND_URL}/attendance`;

export const newAttendance = async (classId, attendanceData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/new/${classId}`,
      attendanceData,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return response.data; // Return the success data
  } catch (error) {
    console.error("Error submitting attendance:", error);
    throw new Error(
      error.response?.data?.message || "Failed to mark attendance"
    );
  }
};

export const updateAttendance = async (recordId, attendanceData) => {
  try {
    const response = await axios.put(
      `${BACKEND_URL}/${recordId}`,
      attendanceData,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating attendance:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update attendance"
    );
  }
};

export const getAttendance = async (classId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/index/${classId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch attendance"
    );
  }
};
