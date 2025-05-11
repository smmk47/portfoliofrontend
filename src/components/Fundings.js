// src/components/Funding.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Funding.css';

const API_BASE = process.env.REACT_APP_API_URL.replace('/api/auth', '');

const Funding = ({ email }) => {
    const [fundings, setFundings] = useState([]);
    const [formData, setFormData] = useState({
        agency: '',
        amount: '',
        projectTimeline: {
            startDate: '',
            endDate: ''
        },
        type: 'National',
        duration: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    useEffect(() => {
        fetchFundings();
    }, [email]);

    const fetchFundings = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/fundings`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setFundings(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'startDate' || name === 'endDate') {
            setFormData({
                ...formData,
                projectTimeline: {
                    ...formData.projectTimeline,
                    [name]: value
                }
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
        try {
            if (isEditing) {
                await axios.put(`${API_BASE}/api/fundings/${currentId}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setIsEditing(false);
                setCurrentId(null);
            } else {
                await axios.post(`${API_BASE}/api/fundings`, formData, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
            }
            setFormData({
                agency: '',
                amount: '',
                projectTimeline: {
                    startDate: '',
                    endDate: ''
                },
                type: 'National',
                duration: ''
            });
            fetchFundings();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (funding) => {
        setIsEditing(true);
        setCurrentId(funding._id);
        setFormData({
            agency: funding.agency,
            amount: funding.amount,
            projectTimeline: {
                startDate: funding.projectTimeline.startDate.split('T')[0],
                endDate: funding.projectTimeline.endDate.split('T')[0]
            },
            type: funding.type,
            duration: funding.duration
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this funding?')) {
            try {
                await axios.delete(`${API_BASE}/api/fundings/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                fetchFundings();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="Funding-container">
            <h2 className="Funding-heading">Fundings and Grants</h2>
            <p className="Funding-userEmail">User Email: {email}</p>
            
            <form className="Funding-form" onSubmit={handleSubmit}>
                <div className="Funding-formGroup">
                    <label className="Funding-label">Funding Agency:</label>
                    <input
                        type="text"
                        name="agency"
                        value={formData.agency}
                        onChange={handleChange}
                        className="Funding-input"
                        required
                    />
                </div>

                <div className="Funding-formGroup">
                    <label className="Funding-label">Amount:</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className="Funding-input"
                        required
                    />
                </div>

                <div className="Funding-formGroup">
                    <label className="Funding-label">Project Start Date:</label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.projectTimeline.startDate}
                        onChange={handleChange}
                        className="Funding-input"
                        required
                    />
                </div>

                <div className="Funding-formGroup">
                    <label className="Funding-label">Project End Date:</label>
                    <input
                        type="date"
                        name="endDate"
                        value={formData.projectTimeline.endDate}
                        onChange={handleChange}
                        className="Funding-input"
                        required
                    />
                </div>

                <div className="Funding-formGroup">
                    <label className="Funding-label">Type:</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="Funding-select"
                        required
                    >
                        <option value="National">National</option>
                        <option value="International">International</option>
                    </select>
                </div>

                <div className="Funding-formGroup">
                    <label className="Funding-label">Duration:</label>
                    <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className="Funding-input"
                        required
                    />
                </div>

                <button type="submit" className="Funding-button">
                    {isEditing ? 'Update Funding' : 'Add Funding'}
                </button>
                {isEditing && (
                    <button
                        type="button"
                        className="Funding-button Funding-button--cancel"
                        onClick={() => {
                            setIsEditing(false);
                            setCurrentId(null);
                            setFormData({
                                agency: '',
                                amount: '',
                                projectTimeline: {
                                    startDate: '',
                                    endDate: ''
                                },
                                type: 'National',
                                duration: ''
                            });
                        }}
                    >
                        Cancel
                    </button>
                )}
            </form>

            <div className="Funding-list">
                {fundings.length === 0 ? (
                    <p className="Funding-noData">No funding records found.</p>
                ) : (
                    <table className="Funding-table">
                        <thead>
                            <tr>
                                <th className="Funding-tableHeader">Agency</th>
                                <th className="Funding-tableHeader">Amount</th>
                                <th className="Funding-tableHeader">Start Date</th>
                                <th className="Funding-tableHeader">End Date</th>
                                <th className="Funding-tableHeader">Type</th>
                                <th className="Funding-tableHeader">Duration</th>
                                <th className="Funding-tableHeader">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fundings.map(funding => (
                                <tr key={funding._id} className="Funding-tableRow">
                                    <td className="Funding-tableData">{funding.agency}</td>
                                    <td className="Funding-tableData">${funding.amount.toLocaleString()}</td>
                                    <td className="Funding-tableData">{new Date(funding.projectTimeline.startDate).toLocaleDateString()}</td>
                                    <td className="Funding-tableData">{new Date(funding.projectTimeline.endDate).toLocaleDateString()}</td>
                                    <td className="Funding-tableData">{funding.type}</td>
                                    <td className="Funding-tableData">{funding.duration}</td>
                                    <td className="Funding-tableData">
                                        <button
                                            className="Funding-button Funding-button--edit"
                                            onClick={() => handleEdit(funding)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="Funding-button Funding-button--delete"
                                            onClick={() => handleDelete(funding._id)}
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

export default Funding;
