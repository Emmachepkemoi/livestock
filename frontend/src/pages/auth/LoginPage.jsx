import React, { useState } from 'react';
import { User, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import authService from '../../services/authService';

function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setDebugInfo(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDebugInfo(null);

    try {
      console.log('Attempting login with:', {
        username: formData.username,
        email: formData.email,
        password: '***hidden***'
      });

      const response = await authService.login(formData);
      console.log('Login response received:', response);

      // Set debug info for display
      setDebugInfo({
        success: response.success,
        hasToken: !!response.token,
        tokenType: response.token ? 'received' : 'not received',
        hasUser: !!response.user,
        message: response.message
      });

      // Check if login was successful
      if (response && (response.success || response.data || response.token || response.user)) {
        console.log('Login successful, calling onLogin callback');

        // Call onLogin with the response data
        if (onLogin) {
          onLogin(response);
        }

        // You can also handle navigation here if needed
        // window.location.href = '/dashboard';

      } else {
        throw new Error('Invalid response format from server');
      }

    } catch (err) {
      console.error('Login error details:', {
        message: err.message,
        stack: err.stack,
        response: err.response
      });

      const message = err?.response?.data?.message || err.message || 'Login failed';
      setError(message);

      // Set debug info for error case
      setDebugInfo({
        success: false,
        error: message,
        hasToken: false,
        tokenType: 'error',
        hasUser: false
      });
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* Debug Information Panel */}
          {debugInfo && (
              <div className="mb-4 p-3 bg-gray-100 rounded-lg text-sm">
                <h4 className="font-semibold mb-2">Debug Information:</h4>
                <ul className="space-y-1">
                  <li>Success: {debugInfo.success ? '✅' : '❌'}</li>
                  <li>Token: {debugInfo.hasToken ? '✅' : '❌'} ({debugInfo.tokenType})</li>
                  <li>User Data: {debugInfo.hasUser ? '✅' : '❌'}</li>
                  {debugInfo.message && <li>Message: {debugInfo.message}</li>}
                  {debugInfo.error && <li className="text-red-600">Error: {debugInfo.error}</li>}
                </ul>
              </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your username"
                      required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your email"
                      required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your password"
                      required
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-green-600 hover:text-green-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>

          {/* Backend Response Inspector */}
          <div className="mt-4 p-2 bg-gray-50 rounded text-xs">
            <p className="font-semibold">Backend Status:</p>
            <p>Check browser console for detailed server response</p>
          </div>
        </div>
      </div>
  );
}

export default LoginPage;