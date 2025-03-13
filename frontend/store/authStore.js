import { create } from "zustand"; // state management library
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,
  setError: (error) => set({ error }),

  signup: async (email, password, name) => {
    console.log("Signup Request:", { email, password, name });
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name
      });

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (err) {
      console.error("Signup Error:", err.response?.data);

      const errorMessage = err.response?.data?.message || "Error signing up";

      set({
        error: errorMessage,
        isLoading: false
      });

      throw err; // Return error message instead of throwing
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    console.log(code);
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false
      });
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error verifying email";

      set({
        error: errorMessage,
        isLoading: false
      });

      return errorMessage;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });

    const token = localStorage.getItem("authToken"); // ✅ Get token from localStorage

    if (!token) {
      console.warn("No authentication token found. Skipping auth check.");
      set({ isAuthenticated: false, isCheckingAuth: false });
      return; // 🚀 Exit early if there's no token
    }

    try {
      const response = await axios.get(`${API_URL}/check-auth`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({ user: response.data.user, isAuthenticated: true });
    } catch (err) {
      console.error("Authentication check failed:", err);
      set({ isAuthenticated: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });
      // const { user, token } = response.data;
      // if (token) {
      //   localStorage.setItem("authToken", token); // ✅ Store token for future use
      //   axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; // ✅ Attach token globally
      // }

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Error logging in",
        isLoading: false
      });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });

    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true }); // ✅ Ensures cookies are sent
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response.data.message || "Error sending reset password email"
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    console.log(`token: ${token}`);
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error resetting passowrd"
      });
      throw error;
    }
  }
}));
