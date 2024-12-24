// API URLs
export const API_BASE_URL = 'https://option-chain-d.onrender.com/api';
export const AUTH_API_URL = `${API_BASE_URL}/auth`;
export const USER_API_URL = `${API_BASE_URL}/user`;
export const OPTION_CHAIN_API_URL = API_BASE_URL;

// Socket URL
export const SOCKET_URL = 'https://option-chain-d-new-app.onrender.com';

// Axios configuration
export const axiosConfig = {
    withCredentials: true,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};
