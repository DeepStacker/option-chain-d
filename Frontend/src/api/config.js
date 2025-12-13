// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  withCredentials: true,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Base URL is already set correctly in .env
    let baseURL = import.meta.env.VITE_API_BASE_URL;
    config.baseURL = baseURL;

    // Check both storage keys for backwards compatibility
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Handle FastAPI response wrapper {success, data, message}
    if (response.data && typeof response.data.success !== 'undefined') {
      // If success is true, return the data directly
      if (response.data.success) {
        return { ...response, data: response.data.data || response.data };
      } else {
        // If success is false, reject with the error
        return Promise.reject({
          message: response.data.message || 'Request failed',
          status: response.status,
        });
      }
    }
    // Return response as-is if no wrapper
    return response;
  },
  (error) => {
    console.error("Axios Error:", error);

    // Handle FastAPI error format
    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      "Unexpected error";

    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      detail: error.response?.data?.detail,
    });
  }
);

export default axiosInstance;
