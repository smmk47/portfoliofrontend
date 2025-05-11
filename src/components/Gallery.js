// Gallery.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Gallery.css';

const API_BASE = process.env.REACT_APP_API_URL.replace('/api/auth', '');

const Gallery = ({ email }) => {
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState(['Conferences', 'Lab Work', 'Teaching']);

  // Fetch images for the logged-in user
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE}/api/gallery/${encodeURIComponent(email)}`);
        setImages(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch images.');
        setLoading(false);
      }
    };

    fetchImages();
  }, [email]);

  // Handle file input change
  const handleFileChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  // Handle image upload
  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', newImage);
    formData.append('category', category);
    formData.append('email', email);  // Add the email as foreign key

    try {
      setLoading(true);
      await axios.post(`${API_BASE}/api/gallery`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setNewImage(null);
      setCategory('');
      setError('');
      setLoading(false);
      alert('Image uploaded successfully!');
      // Re-fetch images after upload
      const response = await axios.get(`${API_BASE}/api/gallery/${encodeURIComponent(email)}`);
      setImages(response.data);
    } catch (err) {
      setError('Failed to upload image.');
      setLoading(false);
    }
  };

  // Handle filtering by category
  const handleCategoryFilter = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Filter images by selected category
  const filteredImages = selectedCategory
    ? images.filter(image => image.category === selectedCategory)
    : images;

  return (
    <div className="Gallery-container">
      <h2 className="Gallery-title">Gallery</h2>
      {error && <p className="Gallery-error">{error}</p>}
      <form onSubmit={handleUpload} className="Gallery-form">
        <label className="Gallery-label">Select Image:</label>
        <input type="file" onChange={handleFileChange} className="Gallery-input" required />
        
        <label className="Gallery-label">Category:</label>
        <select
          value={category}
          onChange={handleCategoryChange}
          className="Gallery-select"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>

        <button type="submit" className="Gallery-button" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Image'}
        </button>
      </form>

      <div className="Gallery-filter">
        <label className="Gallery-label">Filter by Category:</label>
        <select
          onChange={handleCategoryFilter}
          className="Gallery-select"
        >
          <option value="">All</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="Gallery-images">
        {filteredImages.length > 0 ? (
          filteredImages.map((image, idx) => (
            <div key={idx} className="Gallery-image-item">
              <img src={image.url} alt={image.category} className="Gallery-image" />
              <p className="Gallery-category">{image.category}</p>
            </div>
          ))
        ) : (
          <p className="Gallery-no-images">No images available.</p>
        )}
      </div>
    </div>
  );
};

export default Gallery;
