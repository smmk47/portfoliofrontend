// Publications.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Publications.css';

const API_BASE = process.env.REACT_APP_API_URL.replace('/api/auth', '');

const Publications = ({ email }) => {
  const [publications, setPublications] = useState([]);
  const [newPublication, setNewPublication] = useState({
    title: '',
    link: '',
    pdf: null,
    email: email
  });

  // Fetch publications from the server based on email
  useEffect(() => {
    axios.get(`${API_BASE}/api/publications/${email}`)
      .then(response => setPublications(response.data))
      .catch(err => console.error(err));
  }, [email]);

  // Handle change in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPublication({ ...newPublication, [name]: value });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setNewPublication({ ...newPublication, pdf: e.target.files[0] });
  };

  // Add a new publication
  const handleAddPublication = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newPublication.title);
    formData.append('link', newPublication.link);
    formData.append('pdf', newPublication.pdf);
    formData.append('email', email);

    try {
      await axios.post(`${API_BASE}/api/publications`, formData);
      setPublications([...publications, newPublication]);
      setNewPublication({ title: '', link: '', pdf: null, email: email });
    } catch (err) {
      console.error(err);
    }
  };

  // Handle deleting a publication
  const handleDeletePublication = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/publications/${id}`);
      setPublications(publications.filter(pub => pub._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="publication-container">
      <h2 className="publication-heading">Publications</h2>
      <div className="publication-list">
        {publications.map((pub) => (
          <div key={pub._id} className="publication-item">
            <h3 className="publication-title">{pub.title}</h3>
            <a href={pub.link} target="_blank" rel="noopener noreferrer" className="publication-link">
              View Publication
            </a>
            {pub.pdf && <a href={pub.pdf} target="_blank" className="publication-pdf">Download PDF</a>}
            <button className="publication-delete-btn" onClick={() => handleDeletePublication(pub._id)}>Delete</button>
          </div>
        ))}
      </div>

      <form className="publication-form" onSubmit={handleAddPublication}>
        <h3 className="publication-form-title">Add New Publication</h3>
        <input 
          type="text" 
          name="title" 
          value={newPublication.title} 
          onChange={handleChange} 
          placeholder="Publication Title"
          className="publication-input"
        />
        <input 
          type="url" 
          name="link" 
          value={newPublication.link} 
          onChange={handleChange} 
          placeholder="Publication Link"
          className="publication-input"
        />
        <input 
          type="file" 
          onChange={handleFileChange} 
          className="publication-file-input"
        />
        <button type="submit" className="publication-add-btn">Add Publication</button>
      </form>
    </div>
  );
};

export default Publications;
