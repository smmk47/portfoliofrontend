// frontend/src/components/ViewProfile.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewProfile.css';
import { EditorState, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const API_BASE = process.env.REACT_APP_API_URL.replace('/api/auth', '');

const ViewProfile = ({ email }) => {
    const [users, setUsers] = useState([]);
    const [selectedUserEmail, setSelectedUserEmail] = useState(null);
    const [selectedUserProfile, setSelectedUserProfile] = useState(null);
    const [inquiryForm, setInquiryForm] = useState({
        message: ''
    });
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        fetchAllUsers();
    }, []);

    useEffect(() => {
        if (selectedUserEmail) {
            fetchUserProfile(selectedUserEmail);
        } else {
            setSelectedUserProfile(null); // Reset profile when no user is selected
        }
    }, [selectedUserEmail]);

    const fetchAllUsers = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/viewprofile`);
            setUsers(res.data);
        } catch (err) {
            console.error(err);
            setFeedback('Failed to fetch users.');
            setTimeout(() => setFeedback(''), 3000);
        }
    };

    const fetchUserProfile = async (email) => {
        try {
            const res = await axios.get(`${API_BASE}/api/viewprofile/${email}`);
            setSelectedUserProfile(res.data);
        } catch (err) {
            console.error(err);
            setFeedback('Failed to fetch user profile.');
            setTimeout(() => setFeedback(''), 3000);
        }
    };

    const handleInquiryChange = (e) => {
        const { name, value } = e.target;
        setInquiryForm({
            ...inquiryForm,
            [name]: value
        });
    };

    const handleInquirySubmit = async (e) => {
        e.preventDefault();
        const { message } = inquiryForm;

        if (!message) {
            setFeedback('Message is required to send an inquiry.');
            setTimeout(() => setFeedback(''), 3000);
            return;
        }

        try {
            const res = await axios.post(`${API_BASE}/api/viewprofile/${selectedUserEmail}/inquiry`, {
                fromEmail: email,
                message
            });
            setFeedback(res.data.message || 'Inquiry sent successfully.');
            setInquiryForm({
                message: ''
            });
            setTimeout(() => setFeedback(''), 3000);
        } catch (err) {
            console.error(err);
            setFeedback(err.response?.data?.message || 'Failed to send inquiry.');
            setTimeout(() => setFeedback(''), 3000);
        }
    };

    // Function to convert stored JSON blog content to EditorState
    const getEditorState = (content) => {
        try {
            const contentState = convertFromRaw(JSON.parse(content));
            return EditorState.createWithContent(contentState);
        } catch (error) {
            console.error('Error parsing blog content:', error);
            return EditorState.createEmpty();
        }
    };

    return (
        <div className="ViewProfile-container">
            <h2 className="ViewProfile-heading">View Profiles</h2>

            {feedback && <p className="ViewProfile-feedback">{feedback}</p>}

            <div className="ViewProfile-content">
                <div className="ViewProfile-userList">
                    <h3 className="ViewProfile-subheading">Users</h3>
                    <ul className="ViewProfile-list">
                        {users.map(user => (
                            <li
                                key={user.email}
                                className={`ViewProfile-listItem ${selectedUserEmail === user.email ? 'ViewProfile-selected' : ''}`}
                                onClick={() => setSelectedUserEmail(user.email)}
                            >
                                {user.profilePic ? (
                                    <img src={`/${user.profilePic}`} alt={`${user.name}'s profile`} className="ViewProfile-userPic" />
                                ) : (
                                    <div className="ViewProfile-placeholderPic">{user.name.charAt(0).toUpperCase()}</div>
                                )}
                                <span>{user.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="ViewProfile-profileDetails">
                    {selectedUserEmail ? (
                        selectedUserProfile ? (
                            <div>
                                {/* Profile Section */}
                                {selectedUserProfile.profile && (
                                    <div className="ViewProfile-section">
                                        <h3 className="ViewProfile-sectionHeading">Profile</h3>
                                        {selectedUserProfile.profile.profilePic && (
                                            <img src={`/${selectedUserProfile.profile.profilePic}`} alt={`${selectedUserProfile.profile.name}'s profile`} className="ViewProfile-profilePic" />
                                        )}
                                        <p><strong>Name:</strong> {selectedUserProfile.profile.name}</p>
                                        <p><strong>Email:</strong> {selectedUserProfile.profile.email}</p>
                                        <p><strong>Date of Birth:</strong> {new Date(selectedUserProfile.profile.dob).toLocaleDateString()}</p>
                                        <p><strong>Phone:</strong> {selectedUserProfile.profile.phone}</p>
                                    </div>
                                )}

                                {/* Blog Section */}
                                {selectedUserProfile.blog && (
                                    <div className="ViewProfile-section">
                                        <h3 className="ViewProfile-sectionHeading">Blog</h3>
                                        {selectedUserProfile.blog.length === 0 ? (
                                            <p>No blog posts available.</p>
                                        ) : (
                                            selectedUserProfile.blog.map(blog => (
                                                <div key={blog._id} className="ViewProfile-blogPost">
                                                    <h4>{blog.title}</h4>
                                                    <Editor
                                                        editorState={getEditorState(blog.content)}
                                                        toolbarHidden
                                                        readOnly
                                                    />
                                                    {blog.categories && <p><strong>Categories:</strong> {blog.categories}</p>}
                                                    {blog.tags && <p><strong>Tags:</strong> {blog.tags}</p>}
                                                    <p><strong>Visibility:</strong> {blog.visibility}</p>
                                                    <p><strong>Posted on:</strong> {new Date(blog.createdAt).toLocaleDateString()}</p>
                                                    <hr />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                                {/* Contact Information Section */}
                                {selectedUserProfile.contact && (
                                    <div className="ViewProfile-section">
                                        <h3 className="ViewProfile-sectionHeading">Contact Information</h3>
                                        {selectedUserProfile.contact.primaryEmail && (
                                            <p><strong>Primary Email:</strong> {selectedUserProfile.contact.primaryEmail}</p>
                                        )}
                                        {selectedUserProfile.contact.linkedIn && (
                                            <p><strong>LinkedIn:</strong> <a href={selectedUserProfile.contact.linkedIn} target="_blank" rel="noopener noreferrer">{selectedUserProfile.contact.linkedIn}</a></p>
                                        )}
                                        {selectedUserProfile.contact.github && (
                                            <p><strong>GitHub:</strong> <a href={selectedUserProfile.contact.github} target="_blank" rel="noopener noreferrer">{selectedUserProfile.contact.github}</a></p>
                                        )}
                                        {selectedUserProfile.contact.huggingFace && (
                                            <p><strong>HuggingFace:</strong> <a href={selectedUserProfile.contact.huggingFace} target="_blank" rel="noopener noreferrer">{selectedUserProfile.contact.huggingFace}</a></p>
                                        )}

                                        <h4>Send an Inquiry</h4>
                                        <form className="ViewProfile-inquiryForm" onSubmit={handleInquirySubmit}>
                                            <div className="ViewProfile-formGroup">
                                                <label htmlFor="fromEmail">Your Email:</label>
                                                <input
                                                    type="email"
                                                    id="fromEmail"
                                                    name="fromEmail"
                                                    value={email}
                                                    disabled
                                                    className="ViewProfile-inputDisabled"
                                                    placeholder="your.email@example.com"
                                                />
                                            </div>
                                            <div className="ViewProfile-formGroup">
                                                <label htmlFor="message">Message:</label>
                                                <textarea
                                                    id="message"
                                                    name="message"
                                                    value={inquiryForm.message}
                                                    onChange={handleInquiryChange}
                                                    className="ViewProfile-textarea"
                                                    required
                                                    placeholder="Your message here..."
                                                ></textarea>
                                            </div>
                                            <button type="submit" className="ViewProfile-button">
                                                Send Inquiry
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {/* Gallery Section */}
                                {selectedUserProfile.gallery && (
                                    <div className="ViewProfile-section">
                                        <h3 className="ViewProfile-sectionHeading">Gallery</h3>
                                        {selectedUserProfile.gallery.length === 0 ? (
                                            <p>No gallery images available.</p>
                                        ) : (
                                            <div className="ViewProfile-galleryGrid">
                                                {selectedUserProfile.gallery.map(image => (
                                                    <div key={image._id} className="ViewProfile-galleryItem">
                                                        <img src={image.url} alt={image.category} className="ViewProfile-galleryImage" />
                                                        <p className="ViewProfile-galleryCaption">{image.category}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Publications Section */}
                                {selectedUserProfile.publications && (
                                    <div className="ViewProfile-section">
                                        <h3 className="ViewProfile-sectionHeading">Publications</h3>
                                        {selectedUserProfile.publications.length === 0 ? (
                                            <p>No publications available.</p>
                                        ) : (
                                            <div className="ViewProfile-publicationList">
                                                {selectedUserProfile.publications.map(pub => (
                                                    <div key={pub._id} className="ViewProfile-publication">
                                                        <h4>{pub.title}</h4>
                                                        <div className="ViewProfile-publicationLinks">
                                                            <a href={pub.link} target="_blank" rel="noopener noreferrer">View Publication</a>
                                                            {pub.pdf && <a href={`/${pub.pdf}`} target="_blank" rel="noopener noreferrer">Download PDF</a>}
                                                        </div>
                                                        <p><strong>Posted on:</strong> {new Date(pub.createdAt).toLocaleDateString()}</p>
                                                        <hr />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Teaching Section */}
                                {selectedUserProfile.teaching && (
                                    <div className="ViewProfile-section">
                                        <h3 className="ViewProfile-sectionHeading">Teaching</h3>
                                        {selectedUserProfile.teaching.length === 0 ? (
                                            <p>No teaching experiences available.</p>
                                        ) : (
                                            <div className="ViewProfile-teachingList">
                                                {selectedUserProfile.teaching.map(teaching => (
                                                    <div key={teaching._id} className="ViewProfile-teaching">
                                                        <h4>{teaching.courseTitle}</h4>
                                                        <p><strong>Syllabus:</strong> {teaching.syllabus}</p>
                                                        <p><strong>Duration:</strong> {teaching.duration}</p>
                                                        <p><strong>Feedback:</strong> {teaching.feedback}</p>
                                                        {teaching.lectureMaterial && (
                                                            <a href={`/${teaching.lectureMaterial}`} target="_blank" rel="noopener noreferrer">Download Lecture Material</a>
                                                        )}
                                                        <hr />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Funding Section */}
                                {selectedUserProfile.funding && (
                                    <div className="ViewProfile-section">
                                        <h3 className="ViewProfile-sectionHeading">Funding</h3>
                                        {selectedUserProfile.funding.length === 0 ? (
                                            <p>No funding information available.</p>
                                        ) : (
                                            <div className="ViewProfile-fundingList">
                                                {selectedUserProfile.funding.map(fund => (
                                                    <div key={fund._id} className="ViewProfile-funding">
                                                        <p><strong>Agency:</strong> {fund.agency}</p>
                                                        <p><strong>Amount:</strong> ${fund.amount.toLocaleString()}</p>
                                                        <p><strong>Project Timeline:</strong> {new Date(fund.projectTimeline.startDate).toLocaleDateString()} - {new Date(fund.projectTimeline.endDate).toLocaleDateString()}</p>
                                                        <p><strong>Type:</strong> {fund.type}</p>
                                                        <p><strong>Duration:</strong> {fund.duration}</p>
                                                        <hr />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p>Loading user profile...</p>
                        )
                    ) : (
                        <p>Select a user to view their profile.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewProfile;
