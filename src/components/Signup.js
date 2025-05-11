// frontend/src/components/Signup.js
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Avatar, Alert } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const quotes = [
    "“The best way to predict your future is to create it.” – Abraham Lincoln",
    "“Success is not final, failure is not fatal: It is the courage to continue that counts.” – Winston Churchill",
    "“Knowledge is power.” – Francis Bacon",
    "“Strive not to be a success, but rather to be of value.” – Albert Einstein",
    "“Opportunities don’t happen, you create them.” – Chris Grosser",
    "“The only way to do great work is to love what you do.” – Steve Jobs",
    "“Education breeds confidence. Confidence breeds hope. Hope breeds peace.” – Confucius",
    "“The function of education is to teach one to think intensively and to think critically. Intelligence plus character – that is the goal of true education.” – Martin Luther King Jr.",
    "“Leadership and learning are indispensable to each other.” – John F. Kennedy",
    "“You don’t just learn to share ideas; you grow by sharing them.” – Anonymous",
    "“Teaching is the one profession that creates all other professions.” – Unknown",
    "“The aim of education is not knowledge but action.” – Herbert Spencer",
    "“Success usually comes to those who are too busy to be looking for it.” – Henry David Thoreau",
    "“Do not go where the path may lead, go instead where there is no path and leave a trail.” – Ralph Waldo Emerson",
    "“Wisdom is not a product of schooling but of the lifelong attempt to acquire it.” – Albert Einstein",
    "“Your portfolio is the mirror of your dedication and dreams.” – Anonymous",
];


const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        dob: '',
        phone: '',
        profilePic: null,
    });
    const [error, setError] = useState('');
    const [randomQuote, setRandomQuote] = useState(() => 
        quotes[Math.floor(Math.random() * quotes.length)]
    );

    const onChange = (e) => {
        if (e.target.name === 'profilePic') {
            setFormData({ ...formData, profilePic: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('dob', formData.dob);
        data.append('phone', formData.phone);
        if (formData.profilePic) {
            data.append('profilePic', formData.profilePic);
        }

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/signup`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            localStorage.setItem('token', res.data.token);
            navigate('/home');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                overflow: 'hidden', // Prevent scrolling
                textAlign: 'center',
                p: 2,
                backgroundImage: 'linear-gradient(135deg,rgb(255, 255, 255) 30%, #ffffff 90%)',

            }}
        >
            {/* Background Quotes */}
            {quotes.map((quote, index) => {
                const angle = Math.random() * 360;
                const radius = Math.random() * 400 + 300;
                const radians = (angle * Math.PI) / 180;
                const x = radius * Math.cos(radians);
                const y = radius * Math.sin(radians);

                return (
                    <Typography
                        key={index}
                        variant="h6"
                        sx={{
                            position: 'absolute',
                            top: `calc(50% + ${y}px)`,
                            left: `calc(50% + ${x}px)`,
                            transform: 'translate(-50%, -50%)',
                            color: 'rgb(0, 0, 0)',
                            fontSize: Math.random() < 0.5 ? '1.2rem' : '1.5rem',
                            fontWeight: 600,
                            fontStyle: 'italic',
                            textAlign: 'center',
                            pointerEvents: 'none',
                        }}
                    >
                        {quote}
                    </Typography>
                );
            })}

            {/* Signup Card */}
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 400,
                    p: 4,
                    bgcolor: 'white',
                    boxShadow: 3,
                    borderRadius: 2,
                    textAlign: 'center',
                    zIndex: 1,
                }}
            >
                <Avatar
                    sx={{
                        bgcolor: '#1976d2',
                        width: 80,
                        height: 80,
                        mb: 2,
                        mx: 'auto',
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 28,
                            fontWeight: 'bold',
                            color: 'white',
                        }}
                    >
                        PH
                    </Typography>
                </Avatar>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#1976d2' }}>
                    Create an Account
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <form onSubmit={onSubmit}>
                    <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={onChange}
                        margin="normal"
                        variant="outlined"
                        type="email"
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        value={formData.password}
                        onChange={onChange}
                        margin="normal"
                        variant="outlined"
                        type="password"
                    />
                    <TextField
                        fullWidth
                        label="Date of Birth"
                        name="dob"
                        value={formData.dob}
                        onChange={onChange}
                        margin="normal"
                        variant="outlined"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={onChange}
                        margin="normal"
                        variant="outlined"
                        type="tel"
                    />
                    <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Upload Profile Picture
                        <input type="file" name="profilePic" hidden onChange={onChange} />
                    </Button>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, py: 1.5 }}
                    >
                        Signup
                    </Button>
                </form>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
                        Login here
                    </Link>.
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        fontStyle: 'italic',
                        color: '#555',
                        mt: 4,
                    }}
                >
                    {randomQuote}
                </Typography>
            </Box>
        </Box>
    );
};

export default Signup;
