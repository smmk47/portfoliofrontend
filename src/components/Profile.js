// src/components/Profile.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';

const API_BASE = process.env.REACT_APP_API_URL.replace('/api/auth', '');

const Profile = ({ email }) => {
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        currentPosition: '',
        university: '',
        skills: '',
        projects: '',
        workExperience: '',
        profilePicture: null
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [email]);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/profile`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setProfile(res.data);
            setFormData({
                name: res.data.name || '',
                currentPosition: res.data.currentPosition || '',
                university: res.data.university || '',
                skills: res.data.skills ? res.data.skills.join(', ') : '',
                projects: res.data.projects ? JSON.stringify(res.data.projects) : '',
                workExperience: res.data.workExperience ? JSON.stringify(res.data.workExperience) : '',
                profilePicture: null
            });
        } catch (err) {
            if (err.response && err.response.status === 404) {
                // Profile not found, user needs to create one
                setProfile(null);
                setIsEditing(true);
            } else {
                console.error(err);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'profilePicture') {
            setFormData({
                ...formData,
                profilePicture: files[0]
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('currentPosition', formData.currentPosition);
        data.append('university', formData.university);
        data.append('skills', formData.skills);
        data.append('projects', formData.projects); // Should be JSON string
        data.append('workExperience', formData.workExperience); // Should be JSON string
        if (formData.profilePicture) {
            data.append('profilePicture', formData.profilePicture);
        }

        try {
            const res = await axios.post(`${API_BASE}/api/profile`, data, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setProfile(res.data);
            setIsEditing(false);
            setFormData({
                name: res.data.name || '',
                currentPosition: res.data.currentPosition || '',
                university: res.data.university || '',
                skills: res.data.skills ? res.data.skills.join(', ') : '',
                projects: res.data.projects ? JSON.stringify(res.data.projects) : '',
                workExperience: res.data.workExperience ? JSON.stringify(res.data.workExperience) : '',
                profilePicture: null
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                currentPosition: profile.currentPosition || '',
                university: profile.university || '',
                skills: profile.skills ? profile.skills.join(', ') : '',
                projects: profile.projects ? JSON.stringify(profile.projects) : '',
                workExperience: profile.workExperience ? JSON.stringify(profile.workExperience) : '',
                profilePicture: null
            });
        }
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete your profile?')) {
            try {
                await axios.delete(`${API_BASE}/api/profile`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setProfile(null);
                setFormData({
                    name: '',
                    currentPosition: '',
                    university: '',
                    skills: '',
                    projects: '',
                    workExperience: '',
                    profilePicture: null
                });
                setIsEditing(true);
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="Profile-container">
            <h2 className="Profile-heading">Professional Profile</h2>
            <p className="Profile-userEmail">User Email: {email}</p>

            {isEditing ? (
                <form className="Profile-form" onSubmit={handleSubmit}>
                    <div className="Profile-formGroup">
                        <label className="Profile-label">Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="Profile-input"
                            required
                        />
                    </div>

                    <div className="Profile-formGroup">
                        <label className="Profile-label">Current Position:</label>
                        <input
                            type="text"
                            name="currentPosition"
                            value={formData.currentPosition}
                            onChange={handleChange}
                            className="Profile-input"
                            required
                        />
                    </div>

                    <div className="Profile-formGroup">
                        <label className="Profile-label">University Affiliation:</label>
                        <input
                            type="text"
                            name="university"
                            value={formData.university}
                            onChange={handleChange}
                            className="Profile-input"
                            required
                        />
                    </div>

                    <div className="Profile-formGroup">
                        <label className="Profile-label">Skills (comma separated):</label>
                        <input
                            type="text"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            className="Profile-input"
                        />
                    </div>

                    <div className="Profile-formGroup">
                        <label className="Profile-label">Projects (JSON Array):</label>
                        <textarea
                            name="projects"
                            value={formData.projects}
                            onChange={handleChange}
                            className="Profile-textarea"
                            placeholder='e.g., [{"name": "Project A", "description": "Description A", "link": "http://a.com"}]'
                        ></textarea>
                    </div>

                    <div className="Profile-formGroup">
                        <label className="Profile-label">Work Experience (JSON Array):</label>
                        <textarea
                            name="workExperience"
                            value={formData.workExperience}
                            onChange={handleChange}
                            className="Profile-textarea"
                            placeholder='e.g., [{"company": "Company A", "position": "Developer", "startDate": "2020-01-01", "endDate": "2021-01-01", "description": "Developed X"}]'
                        ></textarea>
                    </div>

                    <div className="Profile-formGroup">
                        <label className="Profile-label">Profile Picture:</label>
                        <input
                            type="file"
                            name="profilePicture"
                            accept="image/*"
                            onChange={handleChange}
                            className="Profile-input"
                        />
                    </div>

                    <button type="submit" className="Profile-button">
                        {profile ? 'Update Profile' : 'Create Profile'}
                    </button>
                    {profile && (
                        <button
                            type="button"
                            className="Profile-button Profile-button--cancel"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    )}
                </form>
            ) : profile ? (
                <div className="Profile-details">
                    {profile.profilePicture && (
                        <img
                            src={profile.profilePicture}
                            alt="Profile"
                            className="Profile-picture"
                        />
                    )}
                    <h3 className="Profile-name">{profile.name}</h3>
                    <p className="Profile-position">{profile.currentPosition}</p>
                    <p className="Profile-university">{profile.university}</p>
                    <p className="Profile-skills"><strong>Skills:</strong> {profile.skills.join(', ')}</p>
                    
                    <div className="Profile-section">
                        <h4>Projects</h4>
                        {profile.projects.length === 0 ? (
                            <p>No projects listed.</p>
                        ) : (
                            <ul>
                                {profile.projects.map((project, index) => (
                                    <li key={index}>
                                        <strong>{project.name}</strong>: {project.description} {project.link && (<a href={project.link} target="_blank" rel="noopener noreferrer">[Link]</a>)}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="Profile-section">
                        <h4>Work Experience</h4>
                        {profile.workExperience.length === 0 ? (
                            <p>No work experience listed.</p>
                        ) : (
                            <ul>
                                {profile.workExperience.map((work, index) => (
                                    <li key={index}>
                                        <strong>{work.position}</strong> at <strong>{work.company}</strong> ({new Date(work.startDate).toLocaleDateString()} - {work.endDate ? new Date(work.endDate).toLocaleDateString() : 'Present'})
                                        <p>{work.description}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <button className="Profile-button" onClick={handleEdit}>
                        Edit Profile
                    </button>
                    <button className="Profile-button Profile-button--delete" onClick={handleDelete}>
                        Delete Profile
                    </button>
                </div>
            ) : (
                <p>No profile found. Please create your profile.</p>
            )}
        </div>
    );
};

export default Profile;
