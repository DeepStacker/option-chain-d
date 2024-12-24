// API URLs
export const API_BASE_URL = 'https://16.16.204.22:10001/api';
export const AUTH_API_URL = `${API_BASE_URL}/auth`;
export const USER_API_URL = `${API_BASE_URL}/user`;
export const OPTION_CHAIN_API_URL = API_BASE_URL;

// Socket URL
export const SOCKET_URL = 'https://16.16.204.22:5000';

// Axios configuration
export const axiosConfig = {
    withCredentials: true,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
};
