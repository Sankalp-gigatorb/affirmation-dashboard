import api from "./api.config";

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
    const response = await api.post("/auth/login", credentials);
    if (response.data.success) {
      localStorage.setItem(TOKEN_KEY, response.data.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: async () => {
    try {
      // Try to remove FCM token from server before logging out
      await api.post("/notifications/token/remove");
    } catch (error) {
      console.error("Error removing FCM token:", error);
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
