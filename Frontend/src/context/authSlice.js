import axios from "axios";
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  onIdTokenChanged,
} from "firebase/auth";
import { auth } from "../firebase/init";

// Optimized token manager with event-driven approach
class OptimizedTokenManager {
  constructor() {
    this.refreshPromise = null;
    this.lastActivity = Date.now();
    this.isUserActive = true;
    this.refreshThreshold = 5 * 60 * 1000; // 5 minutes before expiry
    this.inactivityThreshold = 30 * 60 * 1000; // 30 minutes of inactivity
    this.activityTimeout = null;
    this.scheduledRefresh = null;

    this.setupEventDrivenActivity();
  }

  // Event-driven activity tracking (no continuous polling)[4][8]
  setupEventDrivenActivity() {
    const handleActivity = () => {
      this.lastActivity = Date.now();
      this.isUserActive = true;

      // Clear previous timeout
      if (this.activityTimeout) {
        clearTimeout(this.activityTimeout);
      }

      // Set user as inactive after threshold
      this.activityTimeout = setTimeout(() => {
        this.isUserActive = false;
        console.log("User marked as inactive");
      }, this.inactivityThreshold);
    };

    // Throttled activity handler to prevent excessive calls
    const throttledHandler = this.throttle(handleActivity, 2000); // Max once per 2 seconds

    const activityEvents = [
      "mousedown",
      "keypress",
      "scroll",
      "touchstart",
      "visibilitychange",
    ];
    activityEvents.forEach((event) => {
      document.addEventListener(event, throttledHandler, { passive: true });
    });

    // Initial state
    handleActivity();
  }

  // Throttle function to limit event frequency
  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // Check if token is expired
  isTokenExpired(token) {
    if (!token) return true;

    try {
      const base64Url = token.split(".")[1];
      if (!base64Url) return true;

      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decodedToken = JSON.parse(atob(base64));

      if (!decodedToken || !decodedToken.exp) return true;

      const expiryTime = decodedToken.exp * 1000;
      return Date.now() >= expiryTime;
    } catch (error) {
      console.error("Error checking token expiry:", error);
      return true;
    }
  }

  // Check if token needs refresh
  needsRefresh(token) {
    if (!token) return true;

    try {
      const base64Url = token.split(".")[1];
      if (!base64Url) return true;

      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decodedToken = JSON.parse(atob(base64));

      if (!decodedToken || !decodedToken.exp) return true;

      const expiryTime = decodedToken.exp * 1000;
      const timeUntilExpiry = expiryTime - Date.now();

      return timeUntilExpiry <= this.refreshThreshold;
    } catch (error) {
      console.error("Error checking token refresh need:", error);
      return true;
    }
  }

  // Get time until token needs refresh
  getTimeUntilRefresh(token) {
    if (!token) return 0;

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decodedToken = JSON.parse(atob(base64));

      if (!decodedToken || !decodedToken.exp) return 0;

      const expiryTime = decodedToken.exp * 1000;
      const refreshTime = expiryTime - this.refreshThreshold;

      return Math.max(0, refreshTime - Date.now());
    } catch (error) {
      return 0;
    }
  }

  // Clear expired tokens from storage
  clearExpiredTokens() {
    try {
      const storedToken =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
      const storedUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");

      if (storedToken && this.isTokenExpired(storedToken)) {
        console.log("Clearing expired token from storage");
        this.clearAllAuthData();
        return true;
      }

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.tokenExpiry && Date.now() > parsedUser.tokenExpiry) {
          console.log("Clearing expired user data from storage");
          this.clearAllAuthData();
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error clearing expired tokens:", error);
      this.clearAllAuthData();
      return true;
    }
  }

  clearAllAuthData() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("lastActivity");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
  }

  // Smart token refresh scheduling (no continuous polling)[1][4]
  scheduleTokenRefresh(dispatch) {
    // Clear any existing scheduled refresh
    if (this.scheduledRefresh) {
      clearTimeout(this.scheduledRefresh);
      this.scheduledRefresh = null;
    }

    const storedToken =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    if (!storedToken) return;

    const timeUntilRefresh = this.getTimeUntilRefresh(storedToken);

    if (timeUntilRefresh <= 0) {
      // Token needs immediate refresh if user is active
      if (this.isUserActive) {
        console.log("Token needs immediate refresh");
        dispatch(refreshUserToken());
      }
      return;
    }

    // Schedule refresh for the exact time needed
    console.log(
      `Scheduling token refresh in ${Math.round(
        timeUntilRefresh / 1000 / 60
      )} minutes`
    );

    this.scheduledRefresh = setTimeout(() => {
      if (this.isUserActive) {
        console.log("Scheduled token refresh executing");
        dispatch(refreshUserToken()).then(() => {
          // Schedule next refresh after successful refresh
          this.scheduleTokenRefresh(dispatch);
        });
      } else {
        console.log("User inactive, skipping scheduled refresh");
        // Reschedule for later check
        this.scheduledRefresh = setTimeout(() => {
          this.scheduleTokenRefresh(dispatch);
        }, 5 * 60 * 1000); // Check again in 5 minutes
      }
    }, timeUntilRefresh);
  }

  // Ensure valid token (called before API requests)
  async ensureValidToken(dispatch) {
    // Return existing refresh promise if already refreshing
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const storedToken =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    if (!storedToken || this.needsRefresh(storedToken)) {
      console.log("Token needs refresh before API call");
      this.refreshPromise = dispatch(refreshUserToken());

      try {
        await this.refreshPromise;
      } finally {
        this.refreshPromise = null;
      }
    }

    return (
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
    );
  }

  cleanup() {
    if (this.scheduledRefresh) {
      clearTimeout(this.scheduledRefresh);
      this.scheduledRefresh = null;
    }
    if (this.activityTimeout) {
      clearTimeout(this.activityTimeout);
      this.activityTimeout = null;
    }
    this.refreshPromise = null;
  }
}

export const tokenManager = new OptimizedTokenManager();
// Enhanced token refresh thunk
export const refreshUserToken = createAsyncThunk(
  "auth/refreshUserToken",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No authenticated user found");
      }

      console.log("Refreshing Firebase token...");

      // Force refresh the Firebase ID token[1][2]
      const newToken = await currentUser.getIdToken(true);

      if (!newToken) {
        throw new Error("Failed to get refreshed token");
      }

      const newExpiry = Date.now() + 55 * 60 * 1000; // 55 minutes from now

      // Update stored token
      const storedUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const updatedUser = {
          ...parsedUser,
          token: newToken,
          tokenExpiry: newExpiry,
          lastRefresh: new Date().toISOString(),
        };

        // Store in the same location as before
        try {
          if (localStorage.getItem("user")) {
            localStorage.setItem("user", JSON.stringify(updatedUser));
            localStorage.setItem("authToken", newToken);
          } else {
            sessionStorage.setItem("user", JSON.stringify(updatedUser));
            sessionStorage.setItem("authToken", newToken);
          }
        } catch (storageError) {
          console.warn("Failed to store refreshed token:", storageError);
        }

        dispatch(updateTokenData({ token: newToken, expiry: newExpiry }));

        // Schedule next refresh
        tokenManager.scheduleTokenRefresh(dispatch);

        console.log("Token refreshed successfully");
        return { token: newToken, expiry: newExpiry };
      }

      throw new Error("No user data found to update");
    } catch (error) {
      console.error("Token refresh failed:", error);
      dispatch(clearUser());

      return rejectWithValue({
        type: "TOKEN_REFRESH_ERROR",
        message: "Failed to refresh authentication token. Please login again.",
        retryable: false,
      });
    }
  }
);

// Enhanced auth initialization
export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { dispatch }) => {
    try {
      console.log("Initializing authentication...");

      // Clear any expired tokens first
      const hadExpiredTokens = tokenManager.clearExpiredTokens();

      if (hadExpiredTokens) {
        console.log("Expired tokens were cleared during initialization");
        return { user: null, isAuthenticated: false };
      }

      // Check for valid stored tokens
      const storedUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      const storedToken =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);

        // Validate token is not expired
        if (!tokenManager.isTokenExpired(storedToken)) {
          console.log("Valid token found in storage");

          // Schedule refresh if needed
          tokenManager.scheduleTokenRefresh(dispatch);

          return { user: parsedUser, isAuthenticated: true };
        } else {
          console.log("Stored token is expired - clearing");
          tokenManager.clearExpiredTokens();
        }
      }

      return { user: null, isAuthenticated: false };
    } catch (error) {
      console.error("Error initializing auth:", error);
      tokenManager.clearExpiredTokens();
      return { user: null, isAuthenticated: false };
    }
  }
);

// Enhanced auth slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    authLoading: true,
    lastActivity: null,
    tokenRefreshing: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      state.lastActivity = Date.now();
    },

    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.lastActivity = null;
      state.tokenRefreshing = false;

      // Clear storage and cleanup
      tokenManager.clearAllAuthData();
      tokenManager.cleanup();
    },

    updateTokenData: (state, action) => {
      if (state.user) {
        state.user.token = action.payload.token;
        state.user.tokenExpiry = action.payload.expiry;
        state.user.lastRefresh = new Date().toISOString();
      }
      state.tokenRefreshing = false;
    },

    setTokenRefreshing: (state, action) => {
      state.tokenRefreshing = action.payload;
    },

    updateLastActivity: (state) => {
      state.lastActivity = Date.now();
    },
  },

  extraReducers: (builder) => {
    // Initialize auth
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.authLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.authLoading = false;
        if (action.payload.isAuthenticated) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.lastActivity = Date.now();
        }
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.authLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });

    // Refresh token
    builder
      .addCase(refreshUserToken.pending, (state) => {
        state.tokenRefreshing = true;
      })
      .addCase(refreshUserToken.fulfilled, (state, action) => {
        state.tokenRefreshing = false;
        if (state.user) {
          state.user.token = action.payload.token;
          state.user.tokenExpiry = action.payload.expiry;
          state.user.lastRefresh = new Date().toISOString();
        }
      })
      .addCase(refreshUserToken.rejected, (state, action) => {
        state.tokenRefreshing = false;
        state.error = action.payload;
      });
  },
});

export const {
  setUser,
  clearUser,
  updateTokenData,
  setTokenRefreshing,
  updateLastActivity,
} = authSlice.actions;

// Setup Firebase auth state listener[5][9]
export const setupAuthListener = () => (dispatch) => {
  console.log("Setting up Firebase auth state listener...");

  // Setup ID token change listener[3][9]
  const unsubscribeIdToken = onIdTokenChanged(
    auth,
    async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const expiry = Date.now() + 55 * 60 * 1000;

          // Update token in storage
          const storedUser =
            localStorage.getItem("user") || sessionStorage.getItem("user");
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const updatedUser = {
              ...parsedUser,
              token,
              tokenExpiry: expiry,
              lastRefresh: new Date().toISOString(),
            };

            try {
              if (localStorage.getItem("user")) {
                localStorage.setItem("user", JSON.stringify(updatedUser));
                localStorage.setItem("authToken", token);
              } else {
                sessionStorage.setItem("user", JSON.stringify(updatedUser));
                sessionStorage.setItem("authToken", token);
              }
            } catch (storageError) {
              console.warn("Failed to store updated token:", storageError);
            }

            dispatch(updateTokenData({ token, expiry }));

            // Schedule next refresh
            tokenManager.scheduleTokenRefresh(dispatch);
          }
        } catch (error) {
          console.error("Error handling token change:", error);
        }
      }
    },
    (error) => {
      console.error("ID token change error:", error);
    }
  );

  // Setup auth state listener
  const unsubscribeAuth = onAuthStateChanged(
    auth,
    (user) => {
      if (user) {
        // User signed in, schedule token refresh
        tokenManager.scheduleTokenRefresh(dispatch);
      } else {
        // User signed out
        dispatch(clearUser());
      }
    },
    (error) => {
      console.error("Auth state change error:", error);
    }
  );

  return () => {
    unsubscribeIdToken();
    unsubscribeAuth();
    tokenManager.cleanup();
  };
};

// Setup API interceptors for automatic token management
export const setupApiInterceptors = (store) => {
  // Request interceptor to ensure valid token
  axios.interceptors.request.use(async (config) => {
    try {
      const token = await tokenManager.ensureValidToken(store.dispatch);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Failed to ensure valid token for API request:", error);
    }
    return config;
  });

  // Response interceptor to handle 401 errors
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        try {
          console.log("Received 401, attempting token refresh");
          await tokenManager.ensureValidToken(store.dispatch);

          // Retry the original request with new token
          const newToken =
            localStorage.getItem("authToken") ||
            sessionStorage.getItem("authToken");
          if (newToken) {
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return axios.request(error.config);
          }
        } catch (refreshError) {
          console.error("Failed to refresh token after 401:", refreshError);
          store.dispatch(clearUser());
        }
      }
      return Promise.reject(error);
    }
  );
};

// Hook for components to use token with automatic refresh
export const useAuthToken = () => {
  const { user, tokenRefreshing } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const getValidToken = useCallback(async () => {
    if (!user) return null;
    return await tokenManager.ensureValidToken(dispatch);
  }, [user, dispatch]);

  return { getValidToken, tokenRefreshing };
};

export default authSlice.reducer;
