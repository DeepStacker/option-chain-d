// src/api/axiosInstance.js
import axios from "axios";
import { store } from "../context/store";

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
    // 🔄 Pull latest baseURL from Redux before each request
    const state = store.getState();
    const baseURL = state.config.baseURL;

    config.baseURL = baseURL;

    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios Error:", error);
    return Promise.reject({
      message:
        error.response?.data?.message || error.message || "Unexpected error",
      status: error.response?.status,
    });
  }
);

export default axiosInstance;
