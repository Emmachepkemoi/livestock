// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import Dashboard from './pages/Dashboard';
import VetDashboard from './pages/VetDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoadingSpinner from './components/common/LoadingSpinner';
import authService from './services/authService';

const App = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = authService.getStoredUserData();
        if (storedUser) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const handleLogin = (userData) => {
        console.log('Login data received:', userData);

        // Safely extract nested user payload
        const fullData = userData.data?.data || userData.user || userData;

        // Extract tokens
        const token = userData.token || fullData.accessToken;
        const refreshToken = fullData.refreshToken;

        // Store session
        authService._storeUserSession(fullData, token, refreshToken);
        setUser(fullData);

        // Safely extract the role
        const userRole = fullData.role;
        console.log('User role:', userRole);

        switch (userRole) {
            case 'FARMER':
                navigate('/dashboard');
                break;
            case 'VET':
            case 'VETERINARY':
            case 'VETERINARIAN':
                navigate('/vet');
                break;
            case 'ADMIN':
                navigate('/admin');
                break;
            default:
                console.warn('Unknown role:', userRole);
                navigate('/dashboard');
        }
    };

    const handleLogout = () => {
        authService.logout();
        setUser(null);
        navigate('/login');
    };

    if (loading) return <LoadingSpinner />;

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <PublicRoute user={user}>
                        <LoginPage onLogin={handleLogin} />
                    </PublicRoute>
                }
            />
            <Route
                path="/login"
                element={
                    <PublicRoute user={user}>
                        <LoginPage onLogin={handleLogin} />
                    </PublicRoute>
                }
            />
            <Route
                path="/signup"
                element={
                    <PublicRoute user={user}>
                        <SignupPage onSignup={handleLogin} />
                    </PublicRoute>
                }
            />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute user={user} role="FARMER">
                        <Dashboard user={user} onLogout={handleLogout} />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/vet"
                element={
                    <ProtectedRoute user={user} role={["VET", "VETERINARY", "VETERINARIAN"]}>
                        <VetDashboard user={user} onLogout={handleLogout} />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin"
                element={
                    <ProtectedRoute user={user} role="ADMIN">
                        <AdminDashboard user={user} onLogout={handleLogout} />
                    </ProtectedRoute>
                }
            />
            <Route
                path="*"
                element={<Navigate to={user ? getDefaultRoute(user) : '/login'} replace />}
            />
        </Routes>
    );
};

const getDefaultRoute = (user) => {
    const role = user?.role || user?.user?.role;
    switch (role) {
        case 'FARMER':
            return '/dashboard';
        case 'VET':
        case 'VETERINARY':
        case 'VETERINARIAN':
            return '/vet';
        case 'ADMIN':
            return '/admin';
        default:
            return '/dashboard';
    }
};

const ProtectedRoute = ({ children, user, role }) => {
    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if (role) {
        const userRole = user?.role || user?.user?.role;
        const allowedRoles = Array.isArray(role) ? role : [role];

        if (!allowedRoles.includes(userRole)) {
            return <Navigate to={getDefaultRoute(user)} replace />;
        }
    }

    return children;
};

const PublicRoute = ({ children, user }) => {
    if (user && authService.isAuthenticated()) {
        return <Navigate to={getDefaultRoute(user)} replace />;
    }
    return children;
};

export default App;