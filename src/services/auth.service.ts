import api from "./api.config";
import NotificationService from "./notification.service";

interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      isAdmin: boolean;
    };
  };
}

const TOKEN_KEY = "auth_token";
const USER_KEY = "user_data";

const AuthService = {
  login: async (credentials: {
    identifier: string;
    password: string;
  }): Promise<LoginResponse> => {
    // First, delete any existing FCM token to ensure a fresh one is generated
    try {
      await NotificationService.deleteToken();
    } catch (error) {
      console.warn("Could not delete old FCM token. Proceeding anyway.", error);
    }

    const response = await api.post("/auth/login", credentials);
    if (response.data.success) {
      localStorage.setItem(TOKEN_KEY, response.data.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.data.user));

      // After successful login, set up FCM token
      try {
        console.log("Setting up FCM token after login...");
        await NotificationService.requestPermission();
        console.log("FCM token setup complete.");
      } catch (error) {
        // We don't want to block login if FCM fails, but we should log it.
        console.error("Failed to set up FCM token during login:", error);
      }
    }
    return response.data;
  },

  logout: async () => {
    try {
      // Clean up local FCM token
      await NotificationService.deleteToken();
      // Try to remove FCM token from server before logging out
      await api.post("/notifications/token/remove");
    } catch (error) {
      console.error("Error during logout cleanup:", error);
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};

export default AuthService;
