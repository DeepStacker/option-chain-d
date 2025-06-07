import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/init";

// Helper function to handle API errors
const handleApiError = (error) => {
  if (error.response) {
    return error.response.data?.error || "Server error occurred";
  } else if (error.request) {
    return "No response from server. Please check your internet connection.";
  }
  return error.message || "An error occurred";
};

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue, dispatch, getState }) => {
    try {
      const baseURL = getState().config.baseURL;

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const idToken = await user.getIdToken(true);

      const response = await axios.post(
        `${baseURL}/auth/login`,
        { idToken },
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("authToken", idToken);

      dispatch(setUser(response.data));
      return response.data;
    } catch (error) {
      const message = handleApiError(error);
      dispatch(setError(message));
      return rejectWithValue({ message });
    }
  }
);

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    { email, password, username },
    { rejectWithValue, dispatch, getState }
  ) => {
    try {
      const baseURL = getState().config.baseURL;

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const idToken = await user.getIdToken(true);

      const response = await axios.post(
        `${baseURL}/auth/register`,
        {
          email,
          username,
          idToken,
        },
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("authToken", idToken);

      dispatch(setUser(response.data));
      return response.data;
    } catch (error) {
      const firebaseErrorMap = {
        "auth/email-already-in-use": "Email is already registered",
        "auth/invalid-email": "Invalid email address",
        "auth/weak-password": "Password is too weak",
      };

      const mappedError = firebaseErrorMap[error.code] || handleApiError(error);
      dispatch(setError(mappedError));
      return rejectWithValue({ message: mappedError });
    }
  }
);

// Google login
export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (user, { rejectWithValue, dispatch, getState }) => {
    try {
      const baseURL = getState().config.baseURL;
      const idToken = await user.getIdToken();

      const response = await axios.post(
        `${baseURL}/auth/google`,
        { idToken },
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      localStorage.setItem("authToken", response.data.token);
      dispatch(setUser(response.data.user));
      return response.data;
    } catch (error) {
      const message = handleApiError(error);
      dispatch(setError(message));
      return rejectWithValue({ message: error });
    }
  }
);

// Load initial state
const loadInitialState = () => {
  try {
    const user = localStorage.getItem("user");
    return {
      user: user ? JSON.parse(user) : null,
      isAuthenticated: !!user,
      loading: false,
      error: null,
      authLoading: true,
    };
  } catch (error) {
    console.error("Error loading auth state:", error);
    return {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      authLoading: true,
    };
  }
};

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState: loadInitialState(),
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      try {
        localStorage.setItem("user", JSON.stringify(action.payload));
        const token = localStorage.getItem("authToken");
        if (!token && action.payload?.token) {
          localStorage.setItem("authToken", action.payload.token);
        }
      } catch (error) {
        console.error("Error storing user in localStorage:", error);
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      try {
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
      } catch (error) {
        console.error("Error clearing localStorage:", error);
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAuthLoading: (state, action) => {
      state.authLoading = action.payload;
    },
  },
});

export const { setUser, clearUser, setError, setLoading, setAuthLoading } =
  authSlice.actions;

// Function to check token expiry
export const checkTokenExpiry = async(dispatch) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedToken = JSON.parse(atob(base64));
      if (decodedToken && decodedToken.exp) {
        const expiryTime = decodedToken.exp * 1000; // Convert seconds to milliseconds
        const timeUntilExpiry = expiryTime - Date.now();
        if (timeUntilExpiry <= 60000) { // 60000 milliseconds = 1 minute
          // Token is expiring within 1 minute, refresh it
          const user = auth.currentUser;
          if (user) {
            
            async function refreshToken() {
             try {
               const newToken = await user.getIdToken(true);
                localStorage.setItem("authToken", newToken);
                console.log("Token refreshed successfully");
              } catch (refreshError) {
                console.error("Error refreshing token:", refreshError);
                dispatch(clearUser());
              }
            }
            refreshToken().catch((e) => {
             console.error("Error getting user", e);
             dispatch(clearUser());
           });
          } else {
            dispatch(clearUser());
          }
        } else if (Date.now() >= expiryTime) {
          dispatch(clearUser());
          console.log("Token expired - logging out");
        }
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
};

export const initializeAuth = () => (dispatch) => {
  dispatch(setAuthLoading(true));

  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    }
  } catch (error) {
    console.error("Error initializing auth state:", error);
  }

  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user && !localStorage.getItem("user")) {
      user.getIdToken().then((token) => {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          token,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        dispatch(setUser(userData));
      });
    } else if (!user) {
      dispatch(clearUser());
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
    }
    dispatch(setAuthLoading(false));
    unsubscribe();
  });

  // Set up interval to check token expiry every minute
  setInterval(() => {
    checkTokenExpiry(dispatch);
  }, 60000); // 60000 milliseconds = 1 minute
};

export default authSlice.reducer;
