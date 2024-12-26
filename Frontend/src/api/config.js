// API URLs
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:10001/api';
export const AUTH_API_URL = `${API_BASE_URL}/auth`;
export const USER_API_URL = `${API_BASE_URL}/user`;
export const OPTION_CHAIN_API_URL = API_BASE_URL;

// Socket URL
export const SOCKET_URL = 'http://127.0.0.1:5000';

import axios from 'axios';

// Create axios instance with advanced configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Request interceptor for adding dynamic headers
axiosInstance.interceptors.request.use(
  config => {
    // Add any dynamic headers here, like authentication token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // Centralized error handling
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Server Error:', error.response.data);
      console.error('Status Code:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error: No response received');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    
    // Standardize error response
    return Promise.reject({
      message: error.response?.data?.message || 
               error.message || 
               'An unexpected error occurred',
      status: error.response?.status
    });
  }
);

export default axiosInstance;
