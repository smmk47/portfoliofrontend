// Teaching.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Teaching.css';

const API_BASE = process.env.REACT_APP_API_URL.replace('/api/auth', '');

const Teaching = ({ email }) => {
  const [courses, setCourses] = useState([]);
  const [courseTitle, setCourseTitle] = useState('');
  const [syllabus, setSyllabus] = useState('');
  const [duration, setDuration] = useState('');
  const [feedback, setFeedback] = useState('');
  const [lectureMaterial, setLectureMaterial] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the user's teaching portfolio from the backend
    axios
      .get(`${API_BASE}/api/teaching/${email}`)
      .then((response) => setCourses(response.data))
      .catch((err) => setError('Error fetching teaching data.'));
  }, [email]);

  const handleCourseSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('courseTitle', courseTitle);
    formData.append('syllabus', syllabus);
    formData.append('duration', duration);
    formData.append('feedback', feedback);
    if (lectureMaterial) {
      formData.append('lectureMaterial', lectureMaterial);
    }

    axios
      .post(`${API_BASE}/api/teaching/${email}`, formData)
      .then((response) => {
        setCourses((prevCourses) => [...prevCourses, response.data]);
        setCourseTitle('');
        setSyllabus('');
        setDuration('');
        setFeedback('');
        setLectureMaterial(null);
      })
      .catch((err) => setError('Error adding course.'));
  };

  return (
    <div className="Teaching-container">
      <h2 className="Teaching-title">Teaching Portfolio</h2>
      {error && <p className="Teaching-error">{error}</p>}

      <form onSubmit={handleCourseSubmit} className="Teaching-form">
        <label htmlFor="courseTitle" className="Teaching-label">Course Title</label>
        <input
          type="text"
          id="courseTitle"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          className="Teaching-input"
          required
        />

        <label htmlFor="syllabus" className="Teaching-label">Syllabus</label>
        <textarea
          id="syllabus"
          value={syllabus}
          onChange={(e) => setSyllabus(e.target.value)}
          className="Teaching-input"
          required
        />

        <label htmlFor="duration" className="Teaching-label">Teaching Duration</label>
        <input
          type="text"
          id="duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="Teaching-input"
          required
        />

        <label htmlFor="feedback" className="Teaching-label">Student Feedback</label>
        <textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="Teaching-input"
          required
        />

        <label htmlFor="lectureMaterial" className="Teaching-label">Upload Lecture Material</label>
        <input
          type="file"
          id="lectureMaterial"
          onChange={(e) => setLectureMaterial(e.target.files[0])}
          className="Teaching-input"
        />

        <button type="submit" className="Teaching-button">Save Teaching Data</button>
      </form>

      <h3 className="Teaching-subtitle">Uploaded Courses</h3>
      <div className="Teaching-courses-list">
        {courses.length > 0 ? (
          courses.map((course, index) => (
            <div key={index} className="Teaching-course-item">
              <h4 className="Teaching-course-title">{course.courseTitle}</h4>
              <p><strong>Syllabus:</strong> {course.syllabus}</p>
              <p><strong>Duration:</strong> {course.duration}</p>
              <p><strong>Feedback:</strong> {course.feedback}</p>
              {course.lectureMaterial && (
                <a href={`/uploads/${course.lectureMaterial}`} className="Teaching-material-link" target="_blank" rel="noopener noreferrer">
                  View Lecture Material
                </a>
              )}
            </div>
          ))
        ) : (
          <p className="Teaching-no-courses">No courses found.</p>
        )}
      </div>
    </div>
  );
};

export default Teaching;
