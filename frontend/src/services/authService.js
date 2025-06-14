// src/services/authService.js
const API_BASE_URL = 'http://localhost:8080/api/auth'; // Adjust to your backend URL

class AuthService {
  async register(userData) {
    try {
      console.log('Sending registration request:', userData);

      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store tokens and user data if registration successful
      if (data.success && data.data) {
        localStorage.setItem('authToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('userId', data.data.userId);
        localStorage.setItem('username', data.data.username);

        // Store complete user data for immediate access
        localStorage.setItem('userData', JSON.stringify(data.data));
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(credentials) {
    try {
      console.log('Sending login request:', credentials);

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store tokens and user data - handle different response structures
      if (data.success || data.token) {
        // Handle token storage (could be data.token or data.data.accessToken)
        const token = data.token || (data.data && data.data.accessToken);
        if (token) {
          localStorage.setItem('authToken', token);
        }

        // Store refresh token if available
        if (data.data && data.data.refreshToken) {
          localStorage.setItem('refreshToken', data.data.refreshToken);
        }

        // Store user data
        const userData = data.data || data.user || data;
        if (userData) {
          localStorage.setItem('userData', JSON.stringify(userData));

          // Store individual fields for backwards compatibility
          if (userData.userId) localStorage.setItem('userId', userData.userId);
          if (userData.username) localStorage.setItem('username', userData.username);
        }
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // First try to get user data from localStorage
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          console.log('Retrieved user data from localStorage:', userData);
          return { data: userData };
        } catch (parseError) {
          console.warn('Failed to parse stored user data:', parseError);
        }
      }

      // If no stored data, try to fetch from API
      console.log('Fetching user data from API...');
      const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // If API call fails, try to construct user data from stored tokens
        const userId = localStorage.getItem('userId');
        const username = localStorage.getItem('username');

        if (userId || username) {
          const fallbackData = {
            userId: userId,
            username: username,
            // Add other fields that might be available
          };
          console.log('Using fallback user data:', fallbackData);
          return { data: fallbackData };
        }

        throw new Error('Failed to get user data and no fallback available');
      }

      const data = await response.json();
      console.log('API user data response:', data);

      // Cache the user data for future use
      if (data.data || data) {
        localStorage.setItem('userData', JSON.stringify(data.data || data));
      }

      return data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  logout() {
    // Clear all authentication-related data
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('userData');
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  // Helper method to get stored user data
  getStoredUserData() {
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  }
}

export default new AuthService();