import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { io } from "socket.io-client";
import { decode } from "@msgpack/msgpack";

axios.defaults.withCredentials = true;

let socket = null;
let activeRequests = new Map(); // Track active requests to prevent duplicates

// Helpers
const getAuthToken = () => localStorage.getItem("authToken");

const handleApiError = (error) => {
  if (error.response) return error.response.data?.message || "Server error";
  if (error.request) return "No response from server";
  return error.message || "An error occurred";
};

const createSocketConnection = (socketURL) => {
  const token = getAuthToken();
  if (!token) {
    console.error("No auth token available for socket connection");
    return null;
  }

  if (socket && socket.connected) {
    return socket;
  }

  if (!socket) {
    socket = io(socketURL, {
      auth: { token },
      transports: ["websocket"],
      withCredentials: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 5000,
    });

    socket.on("connect", () => {
      console.log("Socket connected successfully");
    });

    socket.on("disconnect", (reason) => {
      console.warn("Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });
  }

  return socket;
};

const getLatestExpiry = (expiryArray) => {
  if (!Array.isArray(expiryArray) || expiryArray.length === 0) {
    return null;
  }

  return Math.min(
    ...expiryArray.map((exp) => {
      if (typeof exp === "object") {
        return exp.exp_sid || exp.value || exp.timestamp || 0;
      }
      return typeof exp === "number" ? exp : parseInt(exp) || 0;
    })
  );
};

// DUPLICATE PREVENTION: Helper to create request keys
const createRequestKey = (action, params = {}) => {
  return `${action}_${JSON.stringify(params)}`;
};

// Enhanced Thunks with Duplicate Prevention

export const fetchExpiryDate = createAsyncThunk(
  "data/fetchExpiryDate",
  async (params, { getState, rejectWithValue }) => {
    try {
      const requestKey = createRequestKey("fetchExpiryDate", params);

      // DUPLICATE PREVENTION: Check if request is already in progress
      if (activeRequests.has(requestKey)) {
        // console.log(
        //   "🚫 DUPLICATE PREVENTION: fetchExpiryDate already in progress"
        // );
        return activeRequests.get(requestKey);
      }

      const token = getAuthToken();
      if (!token) throw new Error("No auth token");

      const state = getState();
      const API_BASE_URL = state.config.baseURL;

      const requestPromise = axios
        .get(`${API_BASE_URL}/exp-date/`, {
          params,
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => response.data);

      // Track the request
      activeRequests.set(requestKey, requestPromise);

      const result = await requestPromise;

      // Clean up tracking
      activeRequests.delete(requestKey);

      return result;
    } catch (err) {
      // Clean up tracking on error
      const requestKey = createRequestKey("fetchExpiryDate", params);
      activeRequests.delete(requestKey);
      return rejectWithValue(handleApiError(err));
    }
  }
);

// DUPLICATE PREVENTION: Enhanced fetchLiveData
export const fetchLiveData = createAsyncThunk(
  "data/fetchLiveData",
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      const freshState = getState();
      const requestKey = createRequestKey("fetchLiveData", {
        sid: freshState.data.sid,
        exp_sid: freshState.data.exp_sid,
      });

      // DUPLICATE PREVENTION: Check if same request is in progress
      if (activeRequests.has(requestKey)) {
        // console.log(
        //   "🚫 DUPLICATE PREVENTION: fetchLiveData already in progress"
        // );
        return activeRequests.get(requestKey);
      }

      const token = getAuthToken();
      if (!token) throw new Error("No auth token");

      const API_BASE_URL = freshState.config.baseURL;
      const SOCKET_URL = freshState.config.socketURL;

      const currentParams = {
        sid: freshState.data.sid,
        exp_sid: freshState.data.exp_sid,
      };

      // console.log(
      //   `🔧 DUPLICATE PREVENTION: Starting fetchLiveData with params:`,
      //   currentParams
      // );

      // Create request promise
      const requestPromise = (async () => {
        // API call
        const response = await axios.get(`${API_BASE_URL}/live-data/`, {
          params: currentParams,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // WebSocket setup
        const socketInstance = createSocketConnection(SOCKET_URL);
        if (!socketInstance) {
          throw new Error("Socket connection failed");
        }

        if (!socketInstance.connected) {
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error("Socket connection timeout"));
            }, 5000);

            const onConnect = () => {
              clearTimeout(timeout);
              socketInstance.off("connect", onConnect);
              socketInstance.off("connect_error", onError);
              resolve();
            };

            const onError = (error) => {
              clearTimeout(timeout);
              socketInstance.off("connect", onConnect);
              socketInstance.off("connect_error", onError);
              reject(error);
            };

            if (socketInstance.connected) {
              clearTimeout(timeout);
              resolve();
            } else {
              socketInstance.once("connect", onConnect);
              socketInstance.once("connect_error", onError);
            }
          });
        }

        // Setup WebSocket streaming
        socketInstance.emit("stop_stream");
        socketInstance.off("live_data");
        socketInstance.emit("start_stream", currentParams);

        socketInstance.on("live_data", (binaryBuffer) => {
          try {
            const arrayBuffer = new Uint8Array(binaryBuffer);
            const decoded = decode(arrayBuffer);
            dispatch(updateLiveData(decoded));
          } catch (e) {
            console.error("Error decoding live data:", e);
          }
        });

        socketInstance.once("stream_started", () => {
          dispatch(setStreamingState(true));
          // console.log(
          //   "✅ DUPLICATE PREVENTION: Live stream started with params:",
          //   currentParams
          // );
        });

        return response.data;
      })();

      // Track the request
      activeRequests.set(requestKey, requestPromise);

      const result = await requestPromise;

      // Clean up tracking
      activeRequests.delete(requestKey);

      return result;
    } catch (err) {
      // Clean up tracking on error
      const freshState = getState();
      const requestKey = createRequestKey("fetchLiveData", {
        sid: freshState.data.sid,
        exp_sid: freshState.data.exp_sid,
      });
      activeRequests.delete(requestKey);
      return rejectWithValue(handleApiError(err));
    }
  }
);

// DUPLICATE PREVENTION: Enhanced direct socket
export const fetchLiveDataDirectSocket = createAsyncThunk(
  "data/fetchLiveDataDirectSocket",
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      const freshState = getState();
      const requestKey = createRequestKey("fetchLiveDataDirectSocket", {
        sid: freshState.data.sid,
        exp_sid: freshState.data.exp_sid,
      });

      // DUPLICATE PREVENTION: Check if same request is in progress
      if (activeRequests.has(requestKey)) {
        // console.log(
        //   "🚫 DUPLICATE PREVENTION: fetchLiveDataDirectSocket already in progress"
        // );
        return activeRequests.get(requestKey);
      }

      const token = getAuthToken();
      if (!token) throw new Error("No auth token");

      const SOCKET_URL = freshState.config.socketURL;

      const currentParams = {
        sid: freshState.data.sid,
        exp_sid: freshState.data.exp_sid,
      };

      // console.log(
      //   `🔧 DUPLICATE PREVENTION: Starting direct socket with params:`,
      //   currentParams
      // );

      // Create request promise
      const requestPromise = (async () => {
        const socketInstance = createSocketConnection(SOCKET_URL);
        if (!socketInstance) {
          throw new Error("Socket connection failed");
        }

        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error("Socket connection timeout"));
          }, 5000);

          if (socketInstance.connected) {
            clearTimeout(timeout);
            resolve();
          } else {
            const onConnect = () => {
              clearTimeout(timeout);
              socketInstance.off("connect", onConnect);
              socketInstance.off("connect_error", onError);
              resolve();
            };

            const onError = (error) => {
              clearTimeout(timeout);
              socketInstance.off("connect", onConnect);
              socketInstance.off("connect_error", onError);
              reject(error);
            };

            socketInstance.once("connect", onConnect);
            socketInstance.once("connect_error", onError);
          }
        });

        socketInstance.emit("stop_stream");
        socketInstance.off("live_data");
        socketInstance.emit("start_stream", currentParams);

        socketInstance.on("live_data", (binaryBuffer) => {
          try {
            const arrayBuffer = new Uint8Array(binaryBuffer);
            const decoded = decode(arrayBuffer);
            dispatch(updateLiveData(decoded));
          } catch (e) {
            console.error("Error decoding live data:", e);
          }
        });

        socketInstance.once("stream_started", () => {
          dispatch(setStreamingState(true));
          // console.log(
          //   "✅ DUPLICATE PREVENTION: Direct socket stream started with params:",
          //   currentParams
          // );
        });

        return { success: true, params: currentParams };
      })();

      // Track the request
      activeRequests.set(requestKey, requestPromise);

      const result = await requestPromise;

      // Clean up tracking
      activeRequests.delete(requestKey);

      return result;
    } catch (err) {
      // Clean up tracking on error
      const freshState = getState();
      const requestKey = createRequestKey("fetchLiveDataDirectSocket", {
        sid: freshState.data.sid,
        exp_sid: freshState.data.exp_sid,
      });
      activeRequests.delete(requestKey);
      return rejectWithValue(handleApiError(err));
    }
  }
);

// DUPLICATE PREVENTION: Enhanced initialization
export const initializeLiveData = createAsyncThunk(
  "data/initializeLiveData",
  async (
    { useDirectSocket = false },
    { dispatch, getState, rejectWithValue }
  ) => {
    try {
      const freshState = getState();
      const requestKey = createRequestKey("initializeLiveData", {
        useDirectSocket,
        sid: freshState.data.sid,
        exp_sid: freshState.data.exp_sid,
      });

      // DUPLICATE PREVENTION: Check if same initialization is in progress
      if (activeRequests.has(requestKey)) {
        // console.log(
        //   "🚫 DUPLICATE PREVENTION: initializeLiveData already in progress"
        // );
        return activeRequests.get(requestKey);
      }

      // console.log(
      //   `🔧 DUPLICATE PREVENTION: Starting initialization with useDirectSocket: ${useDirectSocket}`
      // );

      // Create request promise
      const requestPromise = (async () => {
        if (useDirectSocket) {
          return await dispatch(fetchLiveDataDirectSocket()).unwrap();
        } else {
          return await dispatch(fetchLiveData()).unwrap();
        }
      })();

      // Track the request
      activeRequests.set(requestKey, requestPromise);

      const result = await requestPromise;

      // Clean up tracking
      activeRequests.delete(requestKey);

      return result;
    } catch (error) {
      // Clean up tracking on error
      const freshState = getState();
      const requestKey = createRequestKey("initializeLiveData", {
        useDirectSocket,
        sid: freshState.data.sid,
        exp_sid: freshState.data.exp_sid,
      });
      activeRequests.delete(requestKey);
      return rejectWithValue(error.message || "Failed to initialize live data");
    }
  }
);

// DUPLICATE PREVENTION: Enhanced workflow
export const setSidAndFetchData = createAsyncThunk(
  "data/setSidAndFetchData",
  async ({ newSid, useDirectSocket = false }, { dispatch, getState }) => {
    try {
      const requestKey = createRequestKey("setSidAndFetchData", {
        newSid,
        useDirectSocket,
      });

      // DUPLICATE PREVENTION: Check if same workflow is in progress
      if (activeRequests.has(requestKey)) {
        // console.log(
        //   "🚫 DUPLICATE PREVENTION: setSidAndFetchData already in progress for",
        //   newSid
        // );
        return activeRequests.get(requestKey);
      }

      // console.log(
      //   `🔧 DUPLICATE PREVENTION: Starting workflow for SID: ${newSid}`
      // );

      // Create request promise
      const requestPromise = (async () => {
        // Step 1: Set the new SID
        dispatch(setSid(newSid));

        // Step 2: Fetch expiry dates
        const expiryResponse = await dispatch(
          fetchExpiryDate({ sid: newSid })
        ).unwrap();

        if (expiryResponse?.length > 0) {
          // Step 3: Calculate and set latest expiry
          const latestExpiry = getLatestExpiry(expiryResponse);

          if (latestExpiry) {
            // console.log(
            //   `🔧 DUPLICATE PREVENTION: Setting latest expiry: ${latestExpiry}`
            // );

            // Step 4: Set expiry in state
            await dispatch(setExp_sid(latestExpiry));

            // Step 5: Wait for state update
            await new Promise((resolve) => setTimeout(resolve, 50));

            // Step 6: Initialize with fresh state
            await dispatch(initializeLiveData({ useDirectSocket })).unwrap();

            // console.log(
            //   `✅ DUPLICATE PREVENTION: Workflow completed successfully`
            // );
            return { success: true, sid: newSid, exp_sid: latestExpiry };
          } else {
            throw new Error("No valid expiry date found");
          }
        } else {
          throw new Error("No expiry dates available");
        }
      })();

      // Track the request
      activeRequests.set(requestKey, requestPromise);

      const result = await requestPromise;

      // Clean up tracking
      activeRequests.delete(requestKey);

      return result;
    } catch (err) {
      // Clean up tracking on error
      const requestKey = createRequestKey("setSidAndFetchData", {
        newSid,
        useDirectSocket,
      });
      activeRequests.delete(requestKey);
      console.error("Set SID and fetch data error:", err);
      throw err;
    }
  }
);

export const startLiveStream = createAsyncThunk(
  "data/startLiveStream",
  async (_, { getState, rejectWithValue }) => {
    try {
      const freshState = getState();
      const requestKey = createRequestKey("startLiveStream", {
        sid: freshState.data.sid,
        exp_sid: freshState.data.exp_sid,
      });

      // DUPLICATE PREVENTION: Check if same stream is starting
      if (activeRequests.has(requestKey)) {
        // console.log(
        //   "🚫 DUPLICATE PREVENTION: startLiveStream already in progress"
        // );
        return activeRequests.get(requestKey);
      }

      const token = getAuthToken();
      if (!token) throw new Error("No auth token");

      const SOCKET_URL = freshState.config.socketURL;

      const streamParams = {
        sid: freshState.data.sid,
        exp_sid: freshState.data.exp_sid,
      };

      // console.log(
      //   `🔧 DUPLICATE PREVENTION: Start stream with params:`,
      //   streamParams
      // );

      // Create request promise
      const requestPromise = (async () => {
        if (!socket) socket = createSocketConnection(SOCKET_URL);
        if (!socket) throw new Error("Failed to create socket connection");

        if (!socket.connected) socket.connect();

        socket.emit("stop_stream");
        socket.emit("start_stream", streamParams);

        // console.log(
        //   "✅ DUPLICATE PREVENTION: Live stream started with params:",
        //   streamParams
        // );
        return streamParams;
      })();

      // Track the request
      activeRequests.set(requestKey, requestPromise);

      const result = await requestPromise;

      // Clean up tracking
      activeRequests.delete(requestKey);

      return result;
    } catch (error) {
      // Clean up tracking on error
      const freshState = getState();
      const requestKey = createRequestKey("startLiveStream", {
        sid: freshState.data.sid,
        exp_sid: freshState.data.exp_sid,
      });
      activeRequests.delete(requestKey);
      console.error("Start live stream error:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Rest of the slice remains the same...
export const dataSlice = createSlice({
  name: "data",
  initialState: {
    data: {},
    expDate: [],
    exp_sid: 1419013800,
    sid: "NIFTY",
    isOc: true,
    error: null,
    isStreaming: false,
    loading: false,
    popupData: null,
    connectionMethod: "api",
  },
  reducers: {
    setExp_sid: (state, action) => {
      const newExpiry = action.payload;
      state.exp_sid = newExpiry;
      // console.log(
      //   `🔧 DUPLICATE PREVENTION: State exp_sid updated to: ${newExpiry}`
      // );

      if (socket?.connected && state.isOc) {
        const streamParams = {
          sid: state.sid,
          exp_sid: newExpiry,
        };
        socket.emit("stop_stream");
        socket.emit("start_stream", streamParams);
        // console.log(
        //   "✅ DUPLICATE PREVENTION: Socket restarted with new expiry:",
        //   streamParams
        // );
      }
    },
    setSid: (state, action) => {
      const newSid = action.payload;
      state.sid = newSid;
      // console.log(`🔧 DUPLICATE PREVENTION: State sid updated to: ${newSid}`);

      if (socket?.connected && state.isOc) {
        const streamParams = {
          sid: newSid,
          exp_sid: state.exp_sid,
        };
        socket.emit("stop_stream");
        socket.emit("start_stream", streamParams);
        // console.log(
        //   "✅ DUPLICATE PREVENTION: Socket restarted with new sid:",
        //   streamParams
        // );
      }
    },
    setIsOc: (state, action) => {
      state.isOc = action.payload;
    },
    updateLiveData: (state, action) => {
      state.data = action.payload;
    },
    setStreamingState: (state, action) => {
      state.isStreaming = action.payload;
    },
    setConnectionMethod: (state, action) => {
      state.connectionMethod = action.payload;
    },
    resetError: (state) => {
      state.error = null;
    },
    setPopupData: (state, action) => {
      state.popupData = action.payload;
    },
    clearData: (state) => {
      state.data = {};
      state.error = null;
      state.isStreaming = false;
    },
    setLatestExpiry: (state) => {
      if (state.expDate.length > 0) {
        const latestExpiry = getLatestExpiry(state.expDate);
        if (latestExpiry && latestExpiry !== state.exp_sid) {
          state.exp_sid = latestExpiry;
          // console.log(
          //   `🔧 DUPLICATE PREVENTION: Manually set latest expiry: ${latestExpiry}`
          // );

          if (socket?.connected && state.isOc) {
            const streamParams = {
              sid: state.sid,
              exp_sid: latestExpiry,
            };
            socket.emit("stop_stream");
            socket.emit("start_stream", streamParams);
            // console.log(
            //   "✅ DUPLICATE PREVENTION: Socket restarted with latest expiry:",
            //   streamParams
            // );
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiveData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.connectionMethod = "api";
      })
      .addCase(fetchLiveData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchLiveData.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch live data";
        state.loading = false;
        state.isStreaming = false;
      })
      .addCase(fetchLiveDataDirectSocket.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.connectionMethod = "socket";
      })
      .addCase(fetchLiveDataDirectSocket.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(fetchLiveDataDirectSocket.rejected, (state, action) => {
        state.error = action.payload || "Failed to connect via socket";
        state.loading = false;
        state.isStreaming = false;
      })
      .addCase(initializeLiveData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeLiveData.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(initializeLiveData.rejected, (state, action) => {
        state.error = action.payload || "Failed to initialize live data";
        state.loading = false;
        state.isStreaming = false;
      })
      .addCase(fetchExpiryDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpiryDate.fulfilled, (state, action) => {
        const expiryDates = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.expiry_dates || [];

        state.expDate = expiryDates;

        if (expiryDates.length > 0) {
          const latestExpiry = getLatestExpiry(expiryDates);
          if (latestExpiry) {
            state.exp_sid = latestExpiry;
            // console.log(
            //   `✅ DUPLICATE PREVENTION: Auto-selected latest expiry: ${latestExpiry}`
            // );
          }
        }

        state.loading = false;
      })
      .addCase(fetchExpiryDate.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch expiry dates";
        state.loading = false;
      })
      .addCase(startLiveStream.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startLiveStream.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(startLiveStream.rejected, (state, action) => {
        state.error = action.payload || "Failed to start stream";
        state.loading = false;
      });
  },
});

export const {
  setExp_sid,
  setSid,
  setIsOc,
  updateLiveData,
  setStreamingState,
  setConnectionMethod,
  resetError,
  setPopupData,
  clearData,
  setLatestExpiry,
} = dataSlice.actions;

export const stopLiveStream = () => (dispatch) => {
  if (socket) {
    socket.emit("stop_stream");
    socket.off("live_data");
    socket.disconnect();
    socket = null;
    dispatch(setStreamingState(false));
    console.log("✅ Live stream stopped and socket disconnected");
  }
};

// DUPLICATE PREVENTION: Clear all active requests on app cleanup
export const clearActiveRequests = () => {
  activeRequests.clear();
  // console.log("🔧 DUPLICATE PREVENTION: Cleared all active requests");
};

export default dataSlice.reducer;
