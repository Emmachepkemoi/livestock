// src/services/authService.js
const API_BASE_URL = 'http://localhost:8080/api/auth';

class AuthService {
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      if (data.success && data.data) {
        this._storeUserSession(data.data);
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');

      if (data.data) {
        this._storeUserSession(data.data);
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  _storeUserSession(data) {
    // Save access/refresh tokens and user metadata
    localStorage.setItem('authToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('userData', JSON.stringify(data));
  }

  async getCurrentUser() {
    try {
      const token = this.getToken();
      if (!token) throw new Error('No authentication token found');

      const cached = this.getStoredUserData();
      if (cached) return { data: cached };

      const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Unauthorized or failed to fetch user');

      const data = await response.json();
      if (data?.data) {
        localStorage.setItem('userData', JSON.stringify(data.data));
        return { data: data.data };
      }

      return data;
    } catch (error) {
      console.error('getCurrentUser error:', error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  getStoredUserData() {
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (err) {
      console.error('Error parsing userData from localStorage:', err);
      return null;
    }
  }
}

export default new AuthService();
