import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Avatar,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Divider,
    ListItemIcon,
    IconButton,
    Tooltip,
    useTheme,
} from '@mui/material';
import {
    Menu,
    ChevronLeft,
    ChevronRight,
    Person,
    Book,
    ContactMail,
    Image,
    LibraryBooks,
    Settings,
    School,
    Info,
    People,
    CreditCard,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Profile from './Profile';
import Blog from './Blog';
import Contact from './Contact';
import Gallery from './Gallery';
import Publications from './Publications';
import Setting from './Setting';
import Teaching from './Teaching';
import ViewProfile from './ViewProfile';
import Introduction from './Introduction';
import Funding from './Fundings';

const drawerWidth = 280;

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [selectedComponent, setSelectedComponent] = useState('About');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data);
            } catch (err) {
                setError('Failed to fetch user');
                navigate('/login');
            }
        };

        fetchUser();
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (!user && !error) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    const renderComponent = () => {
        switch (selectedComponent) {
            case 'About':
                return <Introduction email={user.email} />;
            case 'Profile':
                return <Profile email={user.email} />;
            case 'Blog':
                return <Blog email={user.email} />;
            case 'Contact':
                return <Contact email={user.email} />;
            case 'Gallery':
                return <Gallery email={user.email} />;
            case 'Publications':
                return <Publications email={user.email} />;
            case 'Setting':
                return <Setting email={user.email} />;
            case 'Teaching':
                return <Teaching email={user.email} />;
            case 'Funding':
                return <Funding email={user.email} />;
            case 'Explore Portfolios':
                return <ViewProfile email={user.email} />;
            default:
                return <Profile email={user.email} />;
        }
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
            {/* Sidebar */}
            <Drawer
                sx={{
                    width: sidebarOpen ? drawerWidth : 72,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: sidebarOpen ? drawerWidth : 72,
                        boxSizing: 'border-box',
                        transition: 'width 0.3s',
                        background: `linear-gradient(180deg, #115293 20%, #1976d2 80%)`,
                        boxShadow: sidebarOpen ? '3px 0 10px rgba(0,0,0,0.2)' : 'none',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                {/* Sidebar Header */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: sidebarOpen ? 'space-between' : 'center',
                        p: 2,
                        bgcolor: '#115293',
                        color: '#fff',
                        transition: 'padding 0.3s',
                    }}
                >
                    {sidebarOpen && (
                        <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: '0.5px' }}>
                            Navigation
                        </Typography>
                    )}
                    <IconButton onClick={toggleSidebar} sx={{ color: '#fff' }}>
                        {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
                    </IconButton>
                </Box>

                {/* User Profile Section */}
                <Box
                    sx={{
                        p: 2,
                        textAlign: 'center',
                        color: '#fff',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        boxShadow: '0px 4px 8px rgba(0,0,0,0.3)',
                    }}
                >
                    <Avatar
                        src={`${process.env.REACT_APP_API_URL.replace('/api/auth', '')}/${user.profilePic}`}
                        alt="Profile"
                        sx={{
                            width: sidebarOpen ? 80 : 40, // Adjust size based on sidebar state
                            height: sidebarOpen ? 80 : 40,
                            mb: 1,
                            borderRadius: '50%',
                            border: '2px solid #ffffff',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.4)',
                            mx: 'auto',
                            transition: 'all 0.3s ease', // Smooth transition for size change
                        }}
                    />
                    {sidebarOpen && (
                        <>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 'bold',
                                    textShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
                                }}
                            >
                                {user.name}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#f0f0f0',
                                    fontStyle: 'italic',
                                    textShadow: '0px 1px 3px rgba(0, 0, 0, 0.5)',
                                }}
                            >
                                {user.email}
                            </Typography>
                        </>
                    )}
                </Box>

                <Divider sx={{ borderColor: '#ffffff40', mt: 2 }} />

                {/* Menu Items */}
                <List
                    sx={{
                        flexGrow: 1,
                        overflowY: 'auto',
                        scrollbarWidth: 'none', // For Firefox
                        '&::-webkit-scrollbar': {
                            display: 'none', // Hide scrollbar for Webkit browsers
                        },
                    }}
                >
                    {[
                        { text: 'About', icon: <Info /> },
                        { text: 'Profile', icon: <Person /> },
                        { text: 'Blog', icon: <Book /> },
                        { text: 'Contact', icon: <ContactMail /> },
                        { text: 'Gallery', icon: <Image /> },
                        { text: 'Publications', icon: <LibraryBooks /> },
                        { text: 'Teaching', icon: <School /> },
                        { text: 'Funding', icon: <CreditCard /> },
                        { text: 'Explore Portfolios', icon: <People /> },
                        { text: 'Setting', icon: <Settings /> },
                    ].map(({ text, icon }) => (
                        <Tooltip title={!sidebarOpen ? text : ''} placement="right" key={text}>
                            <ListItem
                                button
                                onClick={() => setSelectedComponent(text)}
                                sx={{
                                    '&:hover': { backgroundColor: '#1976d2' },
                                    display: 'flex',
                                    justifyContent: sidebarOpen ? 'flex-start' : 'center',
                                    px: sidebarOpen ? 3 : 2,
                                    py: 1,
                                    borderRadius: 2,
                                    mb: 1,
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <ListItemIcon sx={{ color: '#ffffff', minWidth: 40 }}>{icon}</ListItemIcon>
                                {sidebarOpen && (
                                    <ListItemText
                                        primary={text}
                                        primaryTypographyProps={{
                                            fontWeight: 'medium',
                                            color: '#fff',
                                        }}
                                    />
                                )}
                            </ListItem>
                        </Tooltip>
                    ))}
                </List>

               <Divider sx={{ borderColor: '#ffffff40', mt: 2 }} />

                {/* Logout Button */}
                {sidebarOpen && (
                    <Box sx={{ p: 2 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{
                                bgcolor: '#ffffff',
                                color: '#1976d2',
                                '&:hover': { bgcolor: '#e3f2fd', color: '#1976d2' },
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                                fontWeight: 'bold',
                            }}
                            onClick={logout}
                        >
                            Logout
                        </Button>
                    </Box>
                )}
            </Drawer>

            {/* Main Content */}
            <Box
                sx={{
                    flexGrow: 1,
                    bgcolor: '#f9f9f9',
                    p: 4,
                    minHeight: '95vh',
                    transition: 'margin-left 0.3s',
                    overflow:"auto",
                    '&::-webkit-scrollbar': {
                        display: 'none', // Hide scrollbar for Webkit browsers
                    },
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        mb: 3,
                        fontWeight: 'bold',
                        color: '#1976d2',
                        letterSpacing: '0.5px',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    Welcome, {user.name}
                </Typography>
                {renderComponent()}
            </Box>
        </Box>
    );
};

export default Home;
