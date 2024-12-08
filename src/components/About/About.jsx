import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import "./About.css";

const About = () => {
  return (
    <main className="about-container">
      <div className="about-card">
        <h1>About This Site</h1>
        <p>
          This educational platform is designed to track student attendance in
          schools. The app consists of three types of users: admin, teacher, and
          student. Admins can add classes and assign students and teachers to
          classes. Teachers can track attendance, and students can view their
          attendance status.
        </p>
        <h2>Our Team</h2>
        <div className="team-member">
          <h3>Mohammed Isa Abdulla</h3>
          <p>Brief description about Person 1.</p>
          <div className="social-links">
            <a
              href="https://github.com/Mohammed12des"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub title="GitHub" />
            </a>
            <a
              href="https://www.linkedin.com/in/mohammedisaabdulla/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin title="LinkedIn" />
            </a>
          </div>
        </div>
        <div className="team-member">
          <h3>Muntader Ali Salman</h3>
          <p>Brief description about Person 2.</p>
          <div className="social-links">
            <a
              href="https://github.com/MuntRah"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub title="GitHub" />
            </a>
            <a
              href="https://linkedin.com/in/person2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin title="LinkedIn" />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default About;
