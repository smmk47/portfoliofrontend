// frontend/src/components/Setting.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Setting.css';

const API_BASE = process.env.REACT_APP_API_URL.replace('/api/auth', '');

const Setting = ({ email }) => {
    const [settings, setSettings] = useState({
        profile: true,
        blog: true,
        contact: true,
        gallery: true,
        publications: true,
        teaching: true,
        funding: true
    });
    const [isEditingSettings, setIsEditingSettings] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        password: '',
        profilePic: null
    });
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        fetchSettings();
        fetchUserProfile();
    }, [email]);

    // Fetch settings
    const fetchSettings = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/settings`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setSettings(res.data.visibility);
        } catch (err) {
            console.error(err);
            setFeedback('Failed to fetch settings.');
            setTimeout(() => setFeedback(''), 3000);
        }
    };

    // Fetch user profile
    const fetchUserProfile = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/auth/user`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setProfile({
                name: res.data.name || '',
                password: '',
                profilePic: null
            });
        } catch (err) {
            console.error(err);
            setFeedback('Failed to fetch user profile.');
            setTimeout(() => setFeedback(''), 3000);
        }
    };

    // Handle settings toggle
    const handleSettingsChange = (e) => {
        const { name, checked } = e.target;
        setSettings({
            ...settings,
            [name]: checked
        });
    };

    // Submit settings update
    const handleSettingsSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`${API_BASE}/api/settings`, { visibility: settings }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            setSettings(res.data.visibility);
            setIsEditingSettings(false);
            setFeedback('Settings updated successfully.');
            setTimeout(() => setFeedback(''), 3000);
        } catch (err) {
            console.error(err);
            setFeedback('Failed to update settings.');
            setTimeout(() => setFeedback(''), 3000);
        }
    };

    // Handle profile input change
    const handleProfileChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'profilePic') {
            setProfile({
                ...profile,
                profilePic: files[0]
            });
        } else {
            setProfile({
                ...profile,
                [name]: value
            });
        }
    };

    // Submit profile update
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (profile.name) formData.append('name', profile.name);
        if (profile.password) formData.append('password', profile.password);
        if (profile.profilePic) formData.append('profilePic', profile.profilePic);

        try {
            const res = await axios.put(`${API_BASE}/api/settings/profile`, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setIsEditingProfile(false);
            setFeedback(res.data.message || 'Profile updated successfully.');
            setTimeout(() => setFeedback(''), 3000);
            fetchUserProfile();
        } catch (err) {
            console.error(err);
            setFeedback(err.response?.data?.message || 'Failed to update profile.');
            setTimeout(() => setFeedback(''), 3000);
        }
    };

    return (
        <div className="Setting-container">
            <h2 className="Setting-heading">Settings and Privacy</h2>
            <p className="Setting-userEmail">User Email: {email}</p>

            {feedback && <p className="Setting-feedback">{feedback}</p>}

            {/* Portfolio Visibility Settings */}
            <div className="Setting-section">
                <h3 className="Setting-subheading">Portfolio Visibility</h3>
                {isEditingSettings ? (
                    <form className="Setting-form" onSubmit={handleSettingsSubmit}>
                        <div className="Setting-formGroup">
                            <label className="Setting-label">
                                <input
                                    type="checkbox"
                                    name="profile"
                                    checked={settings.profile}
                                    onChange={handleSettingsChange}
                                />
                                Profile
                            </label>
                        </div>
                        <div className="Setting-formGroup">
                            <label className="Setting-label">
                                <input
                                    type="checkbox"
                                    name="blog"
                                    checked={settings.blog}
                                    onChange={handleSettingsChange}
                                />
                                Blog
                            </label>
                        </div>
                        <div className="Setting-formGroup">
                            <label className="Setting-label">
                                <input
                                    type="checkbox"
                                    name="contact"
                                    checked={settings.contact}
                                    onChange={handleSettingsChange}
                                />
                                Contact
                            </label>
                        </div>
                        <div className="Setting-formGroup">
                            <label className="Setting-label">
                                <input
                                    type="checkbox"
                                    name="gallery"
                                    checked={settings.gallery}
                                    onChange={handleSettingsChange}
                                />
                                Gallery
                            </label>
                        </div>
                        <div className="Setting-formGroup">
                            <label className="Setting-label">
                                <input
                                    type="checkbox"
                                    name="publications"
                                    checked={settings.publications}
                                    onChange={handleSettingsChange}
                                />
                                Publications
                            </label>
                        </div>
                        <div className="Setting-formGroup">
                            <label className="Setting-label">
                                <input
                                    type="checkbox"
                                    name="teaching"
                                    checked={settings.teaching}
                                    onChange={handleSettingsChange}
                                />
                                Teaching
                            </label>
                        </div>
                        <div className="Setting-formGroup">
                            <label className="Setting-label">
                                <input
                                    type="checkbox"
                                    name="funding"
                                    checked={settings.funding}
                                    onChange={handleSettingsChange}
                                />
                                Funding
                            </label>
                        </div>
                        <button type="submit" className="Setting-button">
                            Save Settings
                        </button>
                        <button
                            type="button"
                            className="Setting-button Setting-button--cancel"
                            onClick={() => {
                                fetchSettings();
                                setIsEditingSettings(false);
                            }}
                        >
                            Cancel
                        </button>
                    </form>
                ) : (
                    <div className="Setting-visibilityDetails">
                        <p><strong>Profile:</strong> {settings.profile ? 'Public' : 'Private'}</p>
                        <p><strong>Blog:</strong> {settings.blog ? 'Public' : 'Private'}</p>
                        <p><strong>Contact:</strong> {settings.contact ? 'Public' : 'Private'}</p>
                        <p><strong>Gallery:</strong> {settings.gallery ? 'Public' : 'Private'}</p>
                        <p><strong>Publications:</strong> {settings.publications ? 'Public' : 'Private'}</p>
                        <p><strong>Teaching:</strong> {settings.teaching ? 'Public' : 'Private'}</p>
                        <p><strong>Funding:</strong> {settings.funding ? 'Public' : 'Private'}</p>
                        <button className="Setting-button" onClick={() => setIsEditingSettings(true)}>
                            Edit Settings
                        </button>
                    </div>
                )}
            </div>

            <hr className="Setting-divider" />

            {/* User Profile Update */}
            <div className="Setting-section">
                <h3 className="Setting-subheading">Update Profile</h3>
                {isEditingProfile ? (
                    <form className="Setting-form" onSubmit={handleProfileSubmit}>
                        <div className="Setting-formGroup">
                            <label className="Setting-label">Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleProfileChange}
                                className="Setting-input"
                                required
                            />
                        </div>
                        <div className="Setting-formGroup">
                            <label className="Setting-label">Password:</label>
                            <input
                                type="password"
                                name="password"
                                value={profile.password}
                                onChange={handleProfileChange}
                                className="Setting-input"
                                placeholder="Enter new password"
                            />
                        </div>
                        <div className="Setting-formGroup">
                            <label className="Setting-label">Profile Picture:</label>
                            <input
                                type="file"
                                name="profilePic"
                                accept="image/*"
                                onChange={handleProfileChange}
                                className="Setting-input"
                            />
                        </div>
                        <button type="submit" className="Setting-button">
                            Save Profile
                        </button>
                        <button
                            type="button"
                            className="Setting-button Setting-button--cancel"
                            onClick={() => {
                                fetchUserProfile();
                                setIsEditingProfile(false);
                            }}
                        >
                            Cancel
                        </button>
                    </form>
                ) : (
                    <div className="Setting-profileDetails">
                        <p><strong>Name:</strong> {profile.name}</p>
                        {/* Optionally display profile picture */}
                        <p><strong>Email:</strong> {email}</p>
                        <button className="Setting-button" onClick={() => setIsEditingProfile(true)}>
                            Edit Profile
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

};

export default Setting;
