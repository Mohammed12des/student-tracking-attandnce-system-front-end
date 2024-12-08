import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as authService from "../../services/authService";
import "./Signup.css";

const SignupForm = (props) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConf: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "student", // Use lowercase value
  });

  const updateMessage = (msg) => {
    setMessage(msg);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUserResponse = await authService.signup(formData);
      props.setUser(newUserResponse.user);
      navigate("/");
    } catch (err) {
      updateMessage(err.message);
    }
  };

  const isFormInvalid = () => {
    return !(
      formData.username &&
      formData.password &&
      formData.password === formData.passwordConf
    );
  };

  return (
    <main className="signup-container">
      <div className="signup-left">
        <h1 className="signup-title">
          Sign Up for Web Attendance Management System
        </h1>
        <img
          src="https://myciti.in/wp-content/uploads/2021/02/staff-attendance-01.png"
          alt="Web Attendance Illustration"
          className="signup-illustration"
        />
      </div>
      <div className="signup-right">
        <form onSubmit={handleSubmit} className="signup-form">
          <h2 className="form-title">Sign Up</h2>
          <div className="input-group">
            <input
              type="text"
              id="username"
              value={formData.username}
              name="username"
              onChange={handleChange}
              className="input-field"
              placeholder="Enter Username"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              id="password"
              value={formData.password}
              name="password"
              onChange={handleChange}
              className="input-field"
              placeholder="Enter Password"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              id="passwordConf"
              value={formData.passwordConf}
              name="passwordConf"
              onChange={handleChange}
              className="input-field"
              placeholder="Confirm Password"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              name="firstName"
              onChange={handleChange}
              className="input-field"
              placeholder="Enter First Name"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              name="lastName"
              onChange={handleChange}
              className="input-field"
              placeholder="Enter Last Name"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              id="email"
              value={formData.email}
              name="email"
              onChange={handleChange}
              className="input-field"
              placeholder="Enter Email"
              required
            />
          </div>
          <div className="input-group">
            <label>Role:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === "admin"}
                  onChange={handleChange}
                />
                Admin
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={formData.role === "student"}
                  onChange={handleChange}
                />
                Student
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="teacher"
                  checked={formData.role === "teacher"}
                  onChange={handleChange}
                />
                Teacher
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="signup-button"
            disabled={isFormInvalid()}
          >
            Sign Up
          </button>
          <div className="form-footer">
            <p>Already have an account?</p>
            <Link className="signin-link" to="/signin">
              Sign In
            </Link>
          </div>
          <p className="error-message">{message}</p>
        </form>
      </div>
    </main>
  );
};

export default SignupForm;
