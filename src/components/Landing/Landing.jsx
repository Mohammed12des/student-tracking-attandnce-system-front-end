import "./Landing.css";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate("/signup");
  };

  return (
    <main className="landing-container">
      <div className="landing-card">
        <div className="landing-text">
          <h1>Welcome to Our System</h1>
          <h3>
            Sign up today to access your personalized dashboard and unlock
            exclusive features!
          </h3>
          <button className="cta-button" onClick={handleGetStartedClick}>
            Get Started
          </button>
        </div>
      </div>
    </main>
  );
};

export default Landing;
