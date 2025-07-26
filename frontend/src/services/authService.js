const USER_KEY = "user";
const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refresh_token";

const BASE_URL = "http://localhost:8080/api/auth";

const authService = {
  /**
   * Internal helper to store session tokens and user data
   */
  _storeUserSession: (userData = {}, accessToken, refreshToken) => {
    if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

    const cleanUserData = { ...userData };
    delete cleanUserData.password;
    delete cleanUserData.accessToken;
    delete cleanUserData.refreshToken;
    delete cleanUserData.token;

    localStorage.setItem(USER_KEY, JSON.stringify(cleanUserData));
  },

  /**
   * Login user and store authentication data
   */
  login: async ({ username, email, password }) => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Login failed with status ${response.status}`);
      }

      const data = await response.json();

      const accessToken =
          data?.accessToken || data?.data?.accessToken || data?.token || data?.data?.token;

      const refreshToken =
          data?.refreshToken || data?.data?.refreshToken || data?.refresh_token || data?.data?.refresh_token;

      const userData = data?.user || data?.data?.user || data?.data || {};

      // Store session
      authService._storeUserSession(userData, accessToken, refreshToken);

      return {
        success: true,
        data,
        user: userData,
        token: accessToken
      };
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  },

  /**
   * Get stored user data
   */
  getStoredUserData: () => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (!raw) return null;

      const user = JSON.parse(raw);
      if (typeof user !== "object" || user === null) {
        authService.logout();
        return null;
      }

      return user;
    } catch (err) {
      console.error("Error parsing stored user:", err);
      authService.logout();
      return null;
    }
  },

  /**
   * Get stored tokens
   */
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => !!(authService.getToken() || authService.getStoredUserData()),

  /**
   * Get auth headers
   */
  getAuthHeaders: () => {
    const token = authService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  },

  /**
   * Get user role and ID
   */
  getRole: () => authService.getStoredUserData()?.role || null,
  getUserId: () => authService.getStoredUserData()?.id || null,

  /**
   * Make authenticated API call
   */
  authenticatedRequest: async (url, options = {}) => {
    try {
      let response = await fetch(url, {
        ...options,
        headers: {
          ...authService.getAuthHeaders(),
          ...options.headers
        }
      });

      if (response.status === 401 && authService.getRefreshToken()) {
        try {
          await authService.refreshToken();

          response = await fetch(url, {
            ...options,
            headers: {
              ...authService.getAuthHeaders(),
              ...options.headers
            }
          });
        } catch (refreshErr) {
          console.error("Token refresh failed:", refreshErr);
          authService.logout();
          throw new Error("Authentication failed, please login again");
        }
      }

      return response;
    } catch (err) {
      console.error("Authenticated request error:", err);
      throw err;
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async () => {
    try {
      const refreshToken = authService.getRefreshToken();
      if (!refreshToken) throw new Error("No refresh token available");

      const response = await fetch(`${BASE_URL}/refresh`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        authService.logout();
        throw new Error(`Token refresh failed with status ${response.status}`);
      }

      const data = await response.json();
      const newAccessToken = data?.accessToken || data?.token;
      const newRefreshToken = data?.refreshToken || data?.refresh_token;

      if (!newAccessToken) {
        authService.logout();
        throw new Error("No new access token received");
      }

      localStorage.setItem(TOKEN_KEY, newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
      }

      return newAccessToken;
    } catch (err) {
      console.error("Token refresh error:", err);
      authService.logout();
      throw err;
    }
  },

  /**
   * Register user
   */
  register: async ({ username, email, password, firstName, lastName, role }) => {
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password, firstName, lastName, role })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Registration failed with status ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error("Registration error:", err);
      throw err;
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    try {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      console.log("User logged out successfully");
    } catch (err) {
      console.error("Failed to clear localStorage on logout:", err);
    }
  }
};

export default authService;
