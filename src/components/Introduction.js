// Introduction.js
import React from 'react';
import './Introduction.css';
import { FaUserGraduate, FaBook, FaChalkboardTeacher, FaMoneyCheckAlt, FaImages, FaEnvelope, FaBlog } from 'react-icons/fa';

const Introduction = ({ email }) => {
  return (
    <div className="introduction-container">
      <header className="introduction-header">
        <h1 className="introduction-main-heading">Welcome to My Portfolio Helper</h1>
        <p className="introduction-tagline">
          A modern platform to showcase your academic achievements and elevate your professional profile.
        </p>
      </header>

      <section className="introduction-overview-section">
        <h2 className="introduction-heading">Overview</h2>
        <p className="introduction-overview">
          <strong>My Portfolio Helper</strong> provides a centralized hub for academics to manage their professional profiles. 
          With features tailored for teaching, research, and networking, this platform goes beyond traditional CVs to help you stand out.
        </p>
      </section>

      <section className="introduction-features-section">
        <h2 className="introduction-heading">Key Features</h2>
        <div className="introduction-features-grid">
          <div className="introduction-feature-card">
            <FaUserGraduate className="introduction-feature-icon" />
            <h3>User Profile Creation</h3>
            <p>
              Create a personalized academic profile with editable details, secure authentication, and profile picture uploads.
            </p>
          </div>
          <div className="introduction-feature-card">
            <FaBook className="introduction-feature-icon" />
            <h3>Publications Management</h3>
            <p>
              Add, edit, and categorize publications or integrate with academic databases for seamless updates.
            </p>
          </div>
          <div className="introduction-feature-card">
            <FaChalkboardTeacher className="introduction-feature-icon" />
            <h3>Teaching Portfolio</h3>
            <p>
              Highlight teaching experiences, upload lecture materials, and share student feedback summaries.
            </p>
          </div>
          <div className="introduction-feature-card">
            <FaMoneyCheckAlt className="introduction-feature-icon" />
            <h3>Fundings and Grants</h3>
            <p>
              Showcase grants with details about funding agencies, amounts, and project timelines.
            </p>
          </div>
          <div className="introduction-feature-card">
            <FaImages className="introduction-feature-icon" />
            <h3>Photo Gallery</h3>
            <p>
              Upload and categorize professional images for conferences, lab work, or teaching moments.
            </p>
          </div>
          <div className="introduction-feature-card">
            <FaEnvelope className="introduction-feature-icon" />
            <h3>Contact and Networking</h3>
            <p>
              Share professional contact information, including email, LinkedIn, and a built-in contact form.
            </p>
          </div>
          <div className="introduction-feature-card">
            <FaBlog className="introduction-feature-icon" />
            <h3>Blog Section</h3>
            <p>
              Write and publish insightful blogs with support for images, tags, and formatting.
            </p>
          </div>
        </div>
      </section>

      <footer className="introduction-footer">
        <p className="introduction-footer-text">
          Have questions or need support? Contact us at: <span className="introduction-email">support@portfoliohelper.com</span>
        </p>
      </footer>
    </div>
  );
};

export default Introduction;
