import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { API_BASE_URL } from '../api/config';
import { firebaseConfig } from '../firebase/config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const AUTH_API_URL = `${API_BASE_URL}/auth`;

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Create axios instance with custom config
const axiosInstance = axios.create({
  baseURL: AUTH_API_URL,
  withCredentials: true,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Helper function to handle API errors
const handleApiError = (error) => {
  if (error.response) {
    return error.response.data?.error || 'Server error occurred';
  } else if (error.request) {
    return 'No response from server. Please check your internet connection.';
  }
  return error.message || 'An error occurred';
};

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      // Use the helper function for email/password sign-in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get ID token
      const idToken = await user.getIdToken(true);
      
      // Send token to backend for verification
      const response = await axiosInstance.post('/login', { idToken });
      
      // Store user data and token in local storage
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('token', idToken);
      
      dispatch(setUser(response.data));
      return response.data;
    } catch (error) {
      console.error('Login Error:', error);
      dispatch(setError(error.message || 'Login failed'));
      return rejectWithValue({ message: error.message || 'Login failed' });
    }
  }
);

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password, username }, { rejectWithValue, dispatch }) => {
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get ID token
      const idToken = await user.getIdToken(true);

      // Send registration request to backend
      const response = await axiosInstance.post('/register', {
        email,
        username,
        idToken
      });

      // Store user data and token in local storage
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('token', idToken);

      dispatch(setUser(response.data));
      return response.data;
    } catch (error) {
      console.error('Registration Error:', error);
      
      // Map Firebase specific errors
      const firebaseErrorMap = {
        'auth/email-already-in-use': 'Email is already registered',
        'auth/invalid-email': 'Invalid email address',
        'auth/weak-password': 'Password is too weak'
      };

      const mappedErrorMessage = firebaseErrorMap[error.code] || error.message || 'Registration failed';
      dispatch(setError(mappedErrorMessage));
      return rejectWithValue({ message: mappedErrorMessage });
    }
  }
);

// Async thunk for Google login
export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (user, { rejectWithValue, dispatch }) => {
    try {
      // Get the ID token
      const idToken = await user.getIdToken();
      
      // Send the token to your backend
      const response = await axiosInstance.post('/auth/google', { idToken });
      
      // Store the token
      localStorage.setItem('token', response.data.token);
      
      dispatch(setUser(response.data.user));
      return response.data;
    } catch (error) {
      console.error('Google Login Error:', error);
      dispatch(setError(error.message || 'Login failed'));
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Load initial state from localStorage
const loadInitialState = () => {
  try {
    const user = localStorage.getItem('user');
    return {
      user: user ? JSON.parse(user) : null,
      isAuthenticated: !!user,
      loading: false,
      error: null
    };
  } catch (error) {
    console.error('Error loading auth state:', error);
    return {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null
    };
  }
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialState(),
  reducers: {
    setUser: (state, action) => {
      console.log('Setting user in Redux:', action.payload); // Debug log
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      
      // Store in localStorage
      try {
        localStorage.setItem('user', JSON.stringify(action.payload));
        // Ensure we have the token in localStorage
        const token = localStorage.getItem('authToken');
        if (!token && action.payload?.token) {
          localStorage.setItem('authToken', action.payload.token);
        }
        console.log('User stored in localStorage'); // Debug log
      } catch (error) {
        console.error('Error storing user in localStorage:', error);
      }
    },
    clearUser: (state) => {
      console.log('Clearing user from Redux'); // Debug log
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      // Clear localStorage
      try {
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        console.log('User removed from localStorage'); // Debug log
      } catch (error) {
        console.error('Error removing user from localStorage:', error);
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { setUser, clearUser, setError, setLoading } = authSlice.actions;

// Initialize auth state from localStorage
export const initializeAuth = () => (dispatch) => {
  try {
    const user = localStorage.getItem('user');
    if (user) {
      console.log('Initializing auth state with stored user'); // Debug log
      dispatch(setUser(JSON.parse(user)));
    }
  } catch (error) {
    console.error('Error initializing auth state:', error);
  }
};

export default authSlice.reducer;
