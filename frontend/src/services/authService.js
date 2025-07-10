const USER_KEY = "user";
const TOKEN_KEY = "token";

const BASE_URL = "http://localhost:8080/api/auth";

const authService = {
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
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      // Store token immediately if available
      const token = data?.data?.accessToken || data?.accessToken;
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      }

      return data;
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  },

  _storeUserSession: (userData) => {
    try {
      // Store user data
      localStorage.setItem(USER_KEY, JSON.stringify(userData));

      // Store token separately for easier access
      const token = userData?.accessToken || userData?.data?.accessToken;
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      }
    } catch (err) {
      console.error("Failed to store user session", err);
    }
  },

  getStoredUserData: () => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (!raw) return null;

      const user = JSON.parse(raw);
      if (typeof user !== "object") {
        authService.logout();
        return null;
      }

      // Validate that we have a token
      const token = authService.getToken();
      if (!token) {
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

  getToken: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (err) {
      console.error("Error getting token:", err);
      return null;
    }
  },

  isAuthenticated: () => {
    const token = authService.getToken();
    return !!token;
  },

  getRole: () => {
    const user = authService.getStoredUserData();
    return user?.role || user?.user?.role || null;
  },

  logout: () => {
    try {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
    } catch (err) {
      console.error("Failed to clear localStorage on logout", err);
    }
  }
};

export default authService;