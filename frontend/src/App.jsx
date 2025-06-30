// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import Dashboard from './pages/Dashboard';
import VetDashboard from './pages/VetDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoadingSpinner from './components/common/LoadingSpinner';

import authService from './services/authService';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeUser = async () => {
            try {
                const token = authService.getToken();
                const storedUser = authService.getCurrentUser();

                if (token && storedUser) {
                    setUser(storedUser);
                }
            } catch (error) {
                console.error("Failed to load user:", error);
                authService.logout();
            } finally {
                setLoading(false);
            }
        };

        initializeUser();
    }, []);

    const handleLogin = (userData) => {
        const { accessToken, ...user } = userData.data || userData;
        authService.setToken(accessToken);
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
    };

    const handleLogout = () => {
        authService.logout();
        setUser(null);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <PublicRoute>
                        <LoginPage onLogin={handleLogin} />
                    </PublicRoute>
                } />
                <Route path="/login" element={
                    <PublicRoute>
                        <LoginPage onLogin={handleLogin} />
                    </PublicRoute>
                } />
                <Route path="/signup" element={
                    <PublicRoute>
                        <SignupPage onSignup={handleLogin} />
                    </PublicRoute>
                } />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard user={user} onLogout={handleLogout} />
                    </ProtectedRoute>
                } />
                <Route path="/vet" element={<VetDashboard />} />

                <Route path="/admin" element={<AdminDashboard />} />

                <Route path="*" element={
                    <Navigate to={authService.isAuthenticated() ? "/dashboard" : "/"} replace />
                } />
            </Routes>
        </Router>
    );
}

// Route Guards
const ProtectedRoute = ({ children }) => {
    return authService.isAuthenticated() ? children : <Navigate to="/" replace />;
};

const PublicRoute = ({ children }) => {
    return !authService.isAuthenticated() ? children : <Navigate to="/dashboard" replace />;
};

const VetRoute = ({ children }) => {
    const user = authService.getCurrentUser();
    return user?.role === 'vet' ? children : <Navigate to="/" replace />;
};

const AdminRoute = ({ children }) => {
    const user = authService.getCurrentUser();
    return user?.role === 'admin' ? children : <Navigate to="/" replace />;
};

export default App;
