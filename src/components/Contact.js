// src/components/Contact.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Contact.css';

const API_BASE = process.env.REACT_APP_API_URL.replace('/api/auth', '');

const Contact = ({ email }) => {
    const [contactInfo, setContactInfo] = useState({
        primaryEmail: '',
        linkedIn: '',
        github: '',
        huggingFace: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [inquiries, setInquiries] = useState([]);
    const [inquiryForm, setInquiryForm] = useState({
        recipientEmail: '',
        fromEmail: '',
        message: ''
    });
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        fetchContactInfo();
    }, [email]);

    const fetchContactInfo = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/contact`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setContactInfo({
                primaryEmail: res.data.primaryEmail || '',
                linkedIn: res.data.linkedIn || '',
                github: res.data.github || '',
                huggingFace: res.data.huggingFace || ''
            });
            setInquiries(res.data.inquiries || []);
            setIsEditing(false);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                // Contact info not found
                setContactInfo({
                    primaryEmail: '',
                    linkedIn: '',
                    github: '',
                    huggingFace: ''
                });
                setInquiries([]);
                setIsEditing(true);
            } else {
                console.error(err);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContactInfo({
            ...contactInfo,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_BASE}/api/contact`, contactInfo, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            setContactInfo({
                primaryEmail: res.data.primaryEmail || '',
                linkedIn: res.data.linkedIn || '',
                github: res.data.github || '',
                huggingFace: res.data.huggingFace || ''
            });
            setIsEditing(false);
            setFeedback('Contact information updated successfully.');
            setTimeout(() => setFeedback(''), 3000);
        } catch (err) {
            console.error(err);
            setFeedback('Failed to update contact information.');
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
        const { recipientEmail, fromEmail, message } = inquiryForm;

        if (!recipientEmail || !fromEmail || !message) {
            setFeedback('All fields are required to send an inquiry.');
            setTimeout(() => setFeedback(''), 3000);
            return;
        }

        try {
            const res = await axios.post(`/api/contact/inquiry/${recipientEmail}`, {
                fromEmail,
                message
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setFeedback(res.data.message || 'Inquiry sent successfully.');
            setInquiryForm({
                recipientEmail: '',
                fromEmail: '',
                message: ''
            });
            setTimeout(() => setFeedback(''), 3000);
        } catch (err) {
            console.error(err);
            setFeedback(err.response?.data?.message || 'Failed to send inquiry.');
            setTimeout(() => setFeedback(''), 3000);
        }
    };

    const handleDeleteInquiry = async (inquiryId) => {
        if (window.confirm('Are you sure you want to delete this inquiry?')) {
            try {
                await axios.delete(`/api/contact/inquiry/${inquiryId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setInquiries(inquiries.filter(inq => inq._id !== inquiryId));
                setFeedback('Inquiry deleted successfully.');
                setTimeout(() => setFeedback(''), 3000);
            } catch (err) {
                console.error(err);
                setFeedback('Failed to delete inquiry.');
                setTimeout(() => setFeedback(''), 3000);
            }
        }
    };

    return (
        <div className="Contact-container">

            <h2 className="Contact-heading">Contact and Networking Information</h2>
            <p className="Contact-userEmail">User Email: {email}</p>

            {feedback && <p className="Contact-feedback">{feedback}</p>}

            {isEditing ? (
                <form className="Contact-form" onSubmit={handleSubmit}>
                    <div className="Contact-formGroup">
                        <label className="Contact-label">Primary Email:</label>
                        <input
                            type="email"
                            name="primaryEmail"
                            value={contactInfo.primaryEmail}
                            onChange={handleChange}
                            className="Contact-input"
                            required
                        />
                    </div>

                    <div className="Contact-formGroup">
                        <label className="Contact-label">LinkedIn Profile:</label>
                        <input
                            type="url"
                            name="linkedIn"
                            value={contactInfo.linkedIn}
                            onChange={handleChange}
                            className="Contact-input"
                            placeholder="https://www.linkedin.com/in/yourprofile"
                        />
                    </div>

                    <div className="Contact-formGroup">
                        <label className="Contact-label">GitHub Profile:</label>
                        <input
                            type="url"
                            name="github"
                            value={contactInfo.github}
                            onChange={handleChange}
                            className="Contact-input"
                            placeholder="https://github.com/yourusername"
                        />
                    </div>

                    <div className="Contact-formGroup">
                        <label className="Contact-label">HuggingFace Profile:</label>
                        <input
                            type="url"
                            name="huggingFace"
                            value={contactInfo.huggingFace}
                            onChange={handleChange}
                            className="Contact-input"
                            placeholder="https://huggingface.co/yourusername"
                        />
                    </div>

                    <button type="submit" className="Contact-button">
                        Save Contact Information
                    </button>
                    {!isEditing && (
                        <button
                            type="button"
                            className="Contact-button Contact-button--cancel"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </button>
                    )}
                </form>
            ) : (
                <div className="Contact-details">
                    <p><strong>Primary Email:</strong> {contactInfo.primaryEmail}</p>
                    {contactInfo.linkedIn && (
                        <p><strong>LinkedIn:</strong> <a href={contactInfo.linkedIn} target="_blank" rel="noopener noreferrer">{contactInfo.linkedIn}</a></p>
                    )}
                    {contactInfo.github && (
                        <p><strong>GitHub:</strong> <a href={contactInfo.github} target="_blank" rel="noopener noreferrer">{contactInfo.github}</a></p>
                    )}
                    {contactInfo.huggingFace && (
                        <p><strong>HuggingFace:</strong> <a href={contactInfo.huggingFace} target="_blank" rel="noopener noreferrer">{contactInfo.huggingFace}</a></p>
                    )}
                    <button className="Contact-button" onClick={() => setIsEditing(true)}>
                        Edit Contact Information
                    </button>
                </div>
            )}

            <hr className="Contact-divider" />

            <div className="Contact-inquirySection">
                <h3 className="Contact-subheading">Send an Inquiry</h3>
                <form className="Contact-inquiryForm" onSubmit={handleInquirySubmit}>
                    <div className="Contact-formGroup">
                        <label className="Contact-label">Recipient Email:</label>
                        <input
                            type="email"
                            name="recipientEmail"
                            value={inquiryForm.recipientEmail}
                            onChange={handleInquiryChange}
                            className="Contact-input"
                            required
                        />
                    </div>

                    <div className="Contact-formGroup">
                        <label className="Contact-label">Your Email:</label>
                        <input
                            type="email"
                            name="fromEmail"
                            value={inquiryForm.fromEmail}
                            onChange={handleInquiryChange}
                            className="Contact-input"
                            required
                        />
                    </div>

                    <div className="Contact-formGroup">
                        <label className="Contact-label">Message:</label>
                        <textarea
                            name="message"
                            value={inquiryForm.message}
                            onChange={handleInquiryChange}
                            className="Contact-textarea"
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="Contact-button">
                        Send Inquiry
                    </button>
                </form>
            </div>

            <hr className="Contact-divider" />

            <div className="Contact-inquiriesSection">
                <h3 className="Contact-subheading">Received Inquiries</h3>
                {inquiries.length === 0 ? (
                    <p className="Contact-noInquiries">No inquiries received yet.</p>
                ) : (
                    <table className="Contact-table">
                        <thead>
                            <tr>
                                <th className="Contact-tableHeader">From</th>
                                <th className="Contact-tableHeader">Message</th>
                                <th className="Contact-tableHeader">Date</th>
                                <th className="Contact-tableHeader">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inquiries.map(inquiry => (
                                <tr key={inquiry._id} className="Contact-tableRow">
                                    <td className="Contact-tableData">{inquiry.fromEmail}</td>
                                    <td className="Contact-tableData">{inquiry.message}</td>
                                    <td className="Contact-tableData">{new Date(inquiry.date).toLocaleString()}</td>
                                    <td className="Contact-tableData">
                                        <button
                                            className="Contact-button Contact-button--delete"
                                            onClick={() => handleDeleteInquiry(inquiry._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );

};

export default Contact;
