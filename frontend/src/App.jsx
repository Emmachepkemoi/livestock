import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import Dashboard from './pages/Dashboard';
import authService from './services/authService';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    return authService.isAuthenticated() ? children : <Navigate to="/" replace />;
};

// Public Route Component
const PublicRoute = ({ children }) => {
    return !authService.isAuthenticated() ? children : <Navigate to="/dashboard" replace />;
};

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            if (authService.isAuthenticated()) {
                try {
                    const response = await authService.getCurrentUser();
                    console.log('Current user response:', response);

                    // Handle different response structures
                    const userData = response.data || response;
                    setUser(userData);
                } catch (error) {
                    console.error('Failed to get user data:', error);

                    // Try to get stored user data as fallback
                    const storedUserData = authService.getStoredUserData();
                    if (storedUserData) {
                        console.log('Using stored user data as fallback:', storedUserData);
                        setUser(storedUserData);
                    } else {
                        // If no stored data, logout user
                        authService.logout();
                    }
                }
            }
            setLoading(false);
        };

        checkAuthStatus();
    }, []);

    const handleLogin = (userData) => {
        console.log('Login userData received:', userData);

        // Handle different response structures from login/signup
        // Your registration response shows: { success: true, message: '...', data: {...} }
        const user = userData.data || userData;
        setUser(user);
    };

    const handleLogout = () => {
        authService.logout();
        setUser(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/"
                    element={
                        <PublicRoute>
                            <LoginPage onLogin={handleLogin} />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <LoginPage onLogin={handleLogin} />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <PublicRoute>
                            <SignupPage onSignup={handleLogin} />
                        </PublicRoute>
                    }
                />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard user={user} onLogout={handleLogout} />
                        </ProtectedRoute>
                    }
                />

                {/* Fallback Route */}
                <Route
                    path="*"
                    element={<Navigate to={authService.isAuthenticated() ? "/dashboard" : "/"} replace />}
                />
            </Routes>
        </Router>
    );
}

export default App;