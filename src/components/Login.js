// frontend/src/components/Login.js
import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    CircularProgress,
    Alert,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const features = [
    "User Profile Creation",
    "Publications Management",
    "Teaching Portfolio",
    "Fundings and Grants",
    "Photo Gallery",
    "Contact and Networking",
    "Security and Privacy",
    "Blog Section",
    "Academic Awards and Honors",
    "Conference Participation",
    "Workshop and Seminar Details",
    "Research Interests",
    "Professional Memberships",
    "Collaborative Projects",
    "Student Mentorship Records",
    "Educational Background",
    "Languages and Skills",
    "Volunteer Experience",
    "Community Outreach Activities",
    "Hobbies and Personal Interests",
    "Upcoming Events",
    "Achievements Timeline",
    "Testimonials and Endorsements",
    "Media and Press Mentions",
    "Professional Goals and Vision",
];


const fonts = [
    'Roboto, sans-serif',
    'Montserrat, sans-serif',
    'Playfair Display, serif',
    'Lora, serif',
    'Open Sans, sans-serif',
    'Poppins, sans-serif',
    'Raleway, sans-serif',
];

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Prevent scrolling on the body
        document.body.style.overflow = 'hidden';
        return () => {
            // Restore scrolling when component unmounts
            document.body.style.overflow = 'auto';
        };
    }, []);

    // Handle input changes
    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    // Client-side form validation
    const validateForm = () => {
        const { email, password } = formData;
        if (!email || !password) {
            setError('Please fill in all fields.');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return false;
        }
        setError('');
        return true;
    };

    // Handle form submission
    const onSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/login`,
                formData,
                { headers: { 'Content-Type': 'application/json' } }
            );
            localStorage.setItem('token', res.data.token);
            navigate('/home');
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'An unexpected error occurred. Please try again.'
            );
        } finally {
            setLoading(false);
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
                overflow: 'hidden', // Prevent scrollbars
                bgcolor: '#f5f5f5',
                backgroundImage: 'linear-gradient(135deg,rgb(255, 255, 255) 30%, #ffffff 90%)',
            }}
        >
            {/* Feature Labels */}
            {features.map((feature, index) => {
                const angle = Math.random() * 360; // Random angle
                const radius = Math.random() * 400 + 300; // Radius between 250px and 650px
                const radians = (angle * Math.PI) / 180;
                const x = radius * Math.cos(radians);
                const y = radius * Math.sin(radians);

                // Exclude area near the card
                const isOverlappingCard =
                    Math.abs(x) < 250 && Math.abs(y) < 200;

                if (isOverlappingCard) return null;

                // Randomize font properties
                const fontSize = Math.random() < 0.5 ? '2rem' : '3.5rem';
                const fontFamily = fonts[Math.floor(Math.random() * fonts.length)];
                const fontWeight = Math.random() < 0.5 ? 400 : 700;

                return (
                    <Typography
                        key={index}
                        variant="h6"
                        sx={{
                            position: 'absolute',
                            top: `calc(50% + ${y}px)`,
                            left: `calc(50% + ${x}px)`,
                            transform: 'translate(-50%, -50%)',
                            fontSize,
                            color: 'rgba(0, 0, 0, 0.7)', // Black with slight opacity
                            fontFamily,
                            fontWeight,
                            whiteSpace: 'nowrap',
                            pointerEvents: 'none', // Disable interactions
                            userSelect: 'none', // Prevent text selection
                            textAlign: 'center',
                            transition: 'transform 0.3s ease, color 0.3s ease',
                            '&:hover': {
                                color: 'rgba(0, 0, 0, 1)', // Fully black on hover
                                transform: 'scale(1.1)',
                            },
                        }}
                    >
                        {feature}
                    </Typography>
                );
            })}

            {/* Login Card */}
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 450,
                    p: 5,
                    bgcolor: 'white',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                    borderRadius: 2,
                    textAlign: 'center',
                    zIndex: 1, // Ensure it's above feature labels
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        mb: 2,
                        fontWeight: 'bold',
                        color: '#1976d2',
                    }}
                >
                    Welcome to My Portfolio Helper
                </Typography>
                <Typography
                    variant="body1"
                    color="textSecondary"
                    sx={{ mb: 3 }}
                >
                    Empowering academics to showcase their achievements effortlessly.
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <form onSubmit={onSubmit}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={onChange}
                        margin="normal"
                        variant="outlined"
                        type="email"
                        required
                        autoFocus
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#1976d2',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#115293',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#115293',
                                },
                            },
                        }}
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
                        required
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#1976d2',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#115293',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#115293',
                                },
                            },
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            py: 1.5,
                            bgcolor: '#1976d2',
                            '&:hover': {
                                bgcolor: '#115293',
                            },
                        }}
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Login'
                        )}
                    </Button>
                </form>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Don't have an account?{' '}
                    <Link
                        to="/signup"
                        style={{ color: '#1976d2', textDecoration: 'none' }}
                    >
                        Signup here
                    </Link>
                    .
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        fontStyle: 'italic',
                        color: '#555555',
                        mt: 3,
                    }}
                >
                    "Your academic journey deserves a platform that highlights your excellence."
                </Typography>
            </Box>
        </Box>
    );
};

export default Login;
