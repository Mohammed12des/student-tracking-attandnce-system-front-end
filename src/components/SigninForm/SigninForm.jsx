import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as authService from "../../services/authService";
import "./Signin.css";

const SigninForm = (props) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const updateMessage = (msg) => {
    setMessage(msg);
  };

  const handleChange = (e) => {
    updateMessage("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await authService.signin(formData);
      props.setUser(user);
      if (user.role === "admin") {
        navigate("/admin/users"); // Navigate to the admin dashboard
      } else {
        navigate("/"); // Navigate to the regular dashboard
      }
    } catch (err) {
      updateMessage(err.message);
    }
  };

  return (
    <main className="signin-container">
      <div className="signin-left">
        <h1 className="signin-title">
          Sign In to Web Attendance Management System
        </h1>
        <img
          src="https://www.paatham.in/assets/images/1.webp"
          alt="Web Attendance Illustration"
          className="signin-illustration"
        />
      </div>
      <div className="signin-right">
        <form
          autoComplete="off"
          onSubmit={handleSubmit}
          className="signin-form"
        >
          <h2 className="form-title">Sign In</h2>
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
          <button type="submit" className="signin-button">
            Sign In
          </button>
          <div className="form-footer">
            <p>Don't have an account?</p>
            <Link className="signup-link" to="/signup">
              Sign Up
            </Link>
          </div>
          <p className="error-message">{message}</p>
        </form>
      </div>
    </main>
  );
};

export default SigninForm;
