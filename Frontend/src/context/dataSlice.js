import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.withCredentials = true;

const activeRequests = new Map();

// Helpers
const getAuthToken = () => localStorage.getItem("authToken");

const handleApiError = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem("authToken");
    // Only reload if we have a token that was rejected
    if (getAuthToken()) {
      window.location.reload();
    }
    return "Session expired. Please login again.";
  }
  if (error.response) return error.response.data?.message || "Server error";
  if (error.request) return "No response from server";
  return error.message || "An error occurred";
};

const getLatestExpiry = (expiryArray) => {
  if (!Array.isArray(expiryArray) || expiryArray.length === 0) return null;

  return Math.min(
    ...expiryArray.map((exp) => {
      if (typeof exp === "object") {
        return exp.exp_sid || exp.value || exp.timestamp || 0;
      }
      return typeof exp === "number" ? exp : parseInt(exp) || 0;
    })
  );
};

const createRequestKey = (action, params = {}) => {
  return `${action}_${JSON.stringify(params)}`;
};

// Thunks
export const fetchExpiryDate = createAsyncThunk(
  "data/fetchExpiryDate",
  async (params, { getState, rejectWithValue }) => {
    const requestKey = createRequestKey("fetchExpiryDate", params);
    if (activeRequests.has(requestKey)) return activeRequests.get(requestKey);

    try {
      const token = getAuthToken();
      if (!token) throw new Error("No auth token");

      const {
        config: { baseURL },
      } = getState();

      const symbol = params.sid || params.symbol || "NIFTY";
      const requestPromise = axios
        .get(`${baseURL}/options/expiry/${symbol}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => response.data);

      activeRequests.set(requestKey, requestPromise);
      const result = await requestPromise;
      activeRequests.delete(requestKey);

      return result;
    } catch (err) {
      activeRequests.delete(requestKey);
      return rejectWithValue(handleApiError(err));
    }
  }
);

export const fetchLiveData = createAsyncThunk(
  "data/fetchLiveData",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const requestKey = createRequestKey("fetchLiveData", {
      sid: state.data.sid,
      exp_sid: state.data.exp_sid,
    });

    if (activeRequests.has(requestKey)) return activeRequests.get(requestKey);

    try {
      const token = getAuthToken();
      if (!token) throw new Error("No auth token");

      const {
        config: { baseURL },
        data: { sid, exp_sid },
      } = state;
      const params = { sid, exp_sid };

      const requestPromise = axios
        .get(`${baseURL}/options/live`, {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => response.data);

      activeRequests.set(requestKey, requestPromise);
      const result = await requestPromise;
      activeRequests.delete(requestKey);

      return result;
    } catch (err) {
      activeRequests.delete(requestKey);
      return rejectWithValue(handleApiError(err));
    }
  }
);

// Deprecated: Use fetchLiveData instead
export const fetchLiveDataDirectSocket = createAsyncThunk(
  "data/fetchLiveDataDirectSocket",
  async (_, { dispatch }) => {
    // Redirect to fetchLiveData for compatibility
    return dispatch(fetchLiveData()).unwrap();
  }
);

export const initializeLiveData = createAsyncThunk(
  "data/initializeLiveData",
  async (
    { useDirectSocket = false },
    { dispatch, getState, rejectWithValue }
  ) => {
    const state = getState();
    const requestKey = createRequestKey("initializeLiveData", {
      useDirectSocket,
      sid: state.data.sid,
      exp_sid: state.data.exp_sid,
    });

    if (activeRequests.has(requestKey)) return activeRequests.get(requestKey);

    try {
      const requestPromise = useDirectSocket
        ? dispatch(fetchLiveDataDirectSocket()).unwrap()
        : dispatch(fetchLiveData()).unwrap();

      activeRequests.set(requestKey, requestPromise);
      const result = await requestPromise;
      activeRequests.delete(requestKey);

      return result;
    } catch (err) {
      activeRequests.delete(requestKey);
      return rejectWithValue(err.message || "Failed to initialize live data");
    }
  }
);

export const setSidAndFetchData = createAsyncThunk(
  "data/setSidAndFetchData",
  async ({ newSid, useDirectSocket = false }, { dispatch }) => {
    const requestKey = createRequestKey("setSidAndFetchData", {
      newSid,
      useDirectSocket,
    });
    if (activeRequests.has(requestKey)) return activeRequests.get(requestKey);

    try {
      const requestPromise = (async () => {
        dispatch(setSid(newSid));
        const expiryResponse = await dispatch(
          fetchExpiryDate({ sid: newSid })
        ).unwrap();

        if (!expiryResponse?.length)
          throw new Error("No expiry dates available");

        const latestExpiry = getLatestExpiry(expiryResponse);
        if (!latestExpiry) throw new Error("No valid expiry date found");

        dispatch(setExp_sid(latestExpiry));
        await new Promise((resolve) => setTimeout(resolve, 50));
        await dispatch(initializeLiveData({ useDirectSocket })).unwrap();

        return { success: true, sid: newSid, exp_sid: latestExpiry };
      })();

      activeRequests.set(requestKey, requestPromise);
      const result = await requestPromise;
      activeRequests.delete(requestKey);

      return result;
    } catch (err) {
      activeRequests.delete(requestKey);
      throw err;
    }
  }
);



// Slice
export const dataSlice = createSlice({
  name: "data",
  initialState: {
    data: {},
    expDate: [],
    exp_sid: 1419013800,
    sid: "NIFTY", // Ensure sid has an initial value
    isOc: true,
    error: null,
    isStreaming: false,
    loading: false,
    popupData: null,
    connectionMethod: "api",
  },
  reducers: {
    setExp_sid: (state, action) => {
      state.exp_sid = action.payload;
    },
    setSid: (state, action) => {
      state.sid = action.payload;
    },
    setIsOc: (state, action) => {
      state.isOc = action.payload;
    },
    updateLiveData: (state, action) => {
      // Transform WebSocket data into same structure as REST API response
      // WebSocket sends: { oc: {...}, spot: {...}, fut: {...}, atm_strike: ..., pcr: ..., etc }
      // Selectors expect: state.data.options.data.oc, state.data.spot.data, etc
      const raw = action.payload;

      if (!raw || !raw.oc) {
        console.warn('updateLiveData: Invalid data received', raw);
        return;
      }

      state.data = {
        options: {
          data: {
            oc: raw.oc,
            sltp: raw.spot?.ltp || raw.sltp || 0,
            schng: raw.spot?.change || raw.schng || 0,
            sperchng: raw.spot?.change_percent || raw.sperchng || 0,
            u_id: raw.u_id || 0,
            fl: raw.future || raw.fl || {},
            atmiv: raw.atmiv || 0,
            atmiv_change: raw.atmiv_change || 0,
            atm_strike: raw.atm_strike || 0,
            symbol: raw.symbol,
            expiry: raw.expiry,
            max_pain_strike: raw.max_pain_strike || 0,
            dte: raw.dte || raw.days_to_expiry || 0,
            lot_size: raw.lot_size || 75,
            total_ce_oi: raw.total_ce_oi || 0,
            total_pe_oi: raw.total_pe_oi || 0,
            pcr: raw.pcr || 0,
            expiry_list: raw.expiry_list || state.data?.options?.data?.expiry_list || [],
          }
        },
        spot: {
          data: {
            Ltp: raw.spot?.ltp || 0,
            Change: raw.spot?.change || 0,
            ChangePercent: raw.spot?.change_percent || 0,
            ltp: raw.spot?.ltp || 0,
            change: raw.spot?.change || 0,
            change_percent: raw.spot?.change_percent || 0,
          }
        },
        fut: {
          data: raw.future || raw.fut?.data || {}
        }
      };

      state.connectionMethod = 'websocket';
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
        // Normalize backend response to match expected frontend structure
        // Backend now returns corrected field names from Dhan API
        const raw = action.payload;

        // Transform oc data to match frontend expected field names
        const transformedOc = {};
        if (raw.oc) {
          Object.entries(raw.oc).forEach(([strikeKey, strikeData]) => {
            // Normalize strike key to number for consistent access
            const numericKey = parseFloat(strikeKey);

            // Transform CE data - backend now provides correct field names
            const ce = strikeData?.ce || {};
            const transformedCe = {
              ltp: ce.ltp || 0,
              atp: ce.atp || 0,  // Average traded price
              pc: ce.pc || 0,   // Previous close
              volume: ce.volume || ce.vol || 0,
              vol: ce.vol || ce.volume || 0,
              pVol: ce.pVol || 0,  // Previous volume
              // OI fields - backend now provides uppercase OI
              OI: ce.OI || ce.oi || 0,
              oi: ce.OI || ce.oi || 0,
              oichng: ce.oichng || ce.oi_change || 0,
              oi_change: ce.oichng || ce.oi_change || 0,
              p_oi: ce.p_oi || 0,  // Previous OI
              oiperchnge: ce.oiperchnge || 0,
              // IV & Greeks
              iv: ce.iv || 0,
              optgeeks: ce.optgeeks || {},
              delta: ce.optgeeks?.delta || 0,
              gamma: ce.optgeeks?.gamma || 0,
              theta: ce.optgeeks?.theta || 0,
              vega: ce.optgeeks?.vega || 0,
              // Price change - backend now provides p_chng
              p_chng: ce.p_chng || ce.change || 0,
              p_pchng: ce.p_pchng || 0,
              // Bid/Ask
              bid: ce.bid || 0,
              ask: ce.ask || 0,
              bid_qty: ce.bid_qty || 0,
              ask_qty: ce.ask_qty || 0,
              // Build-up signals - NEW from Dhan
              btyp: ce.btyp || "NT",  // LB, SB, SC, LC, NT
              BuiltupName: ce.BuiltupName || "NEUTRAL",
              mness: ce.mness || "",  // I = ITM, O = OTM
              // Symbol info
              sym: ce.sym || "",
              sid: ce.sid || 0,
              disp_sym: ce.disp_sym || "",
              otype: ce.otype || "CE",
            };

            // Transform PE data - same structure as CE
            const pe = strikeData?.pe || {};
            const transformedPe = {
              ltp: pe.ltp || 0,
              atp: pe.atp || 0,
              pc: pe.pc || 0,
              volume: pe.volume || pe.vol || 0,
              vol: pe.vol || pe.volume || 0,
              pVol: pe.pVol || 0,
              // OI fields
              OI: pe.OI || pe.oi || 0,
              oi: pe.OI || pe.oi || 0,
              oichng: pe.oichng || pe.oi_change || 0,
              oi_change: pe.oichng || pe.oi_change || 0,
              p_oi: pe.p_oi || 0,
              oiperchnge: pe.oiperchnge || 0,
              // IV & Greeks
              iv: pe.iv || 0,
              optgeeks: pe.optgeeks || {},
              delta: pe.optgeeks?.delta || 0,
              gamma: pe.optgeeks?.gamma || 0,
              theta: pe.optgeeks?.theta || 0,
              vega: pe.optgeeks?.vega || 0,
              // Price change
              p_chng: pe.p_chng || pe.change || 0,
              p_pchng: pe.p_pchng || 0,
              // Bid/Ask
              bid: pe.bid || 0,
              ask: pe.ask || 0,
              bid_qty: pe.bid_qty || 0,
              ask_qty: pe.ask_qty || 0,
              // Build-up signals
              btyp: pe.btyp || "NT",
              BuiltupName: pe.BuiltupName || "NEUTRAL",
              mness: pe.mness || "",
              // Symbol info
              sym: pe.sym || "",
              sid: pe.sid || 0,
              disp_sym: pe.disp_sym || "",
              otype: pe.otype || "PE",
            };

            transformedOc[numericKey] = {
              strike: strikeData.strike || numericKey,
              strike_price: strikeData.strike_price || numericKey,
              ce: transformedCe,
              pe: transformedPe,
              // Reversal data
              reversal: strikeData.reversal || 0,
              wkly_reversal: strikeData.wkly_reversal || 0,
              fut_reversal: strikeData.fut_reversal || 0,
              // Support/Resistance
              rs: strikeData.rs || 0,
              rr: strikeData.rr || 0,
              ss: strikeData.ss || 0,
              sr_diff: strikeData.sr_diff || 0,
              // Time value
              ce_tv: strikeData.ce_tv || 0,
              pe_tv: strikeData.pe_tv || 0,
              // Signals
              pcr: strikeData.pcr || 0,
              trading_signals: strikeData.trading_signals || {},
              market_regimes: strikeData.market_regimes || {},
              price_range: strikeData.price_range || {},
            };
          });
        }

        state.data = {
          options: {
            data: {
              oc: transformedOc,
              sltp: raw.spot?.ltp || 0,
              schng: raw.spot?.change || 0,
              sperchng: raw.spot?.change_percent || 0,
              u_id: raw.u_id || 0,
              fl: raw.future || {},
              atmiv: raw.atmiv || 0,
              atmiv_change: raw.atmiv_change || 0,
              atm_strike: raw.atm_strike || 0,
              symbol: raw.symbol,
              expiry: raw.expiry,
              // New fields from backend
              max_pain_strike: raw.max_pain_strike || 0,
              dte: raw.dte || raw.days_to_expiry || 0,
              lot_size: raw.lot_size || 75,
              total_ce_oi: raw.total_ce_oi || 0,
              total_pe_oi: raw.total_pe_oi || 0,
              pcr: raw.pcr || 0,
              expiry_list: raw.expiry_list || [],
            }
          },
          spot: {
            data: {
              Ltp: raw.spot?.ltp || 0,
              Change: raw.spot?.change || 0,
              ChangePercent: raw.spot?.change_percent || 0,
              ltp: raw.spot?.ltp || 0,
              change: raw.spot?.change || 0,
              change_percent: raw.spot?.change_percent || 0,
            }
          },
          fut: {
            data: {
              flst: raw.future || {},
              explist: raw.expiry_list || (raw.expiry ? [raw.expiry] : [])
            }
          }
        };
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
      .addCase(fetchLiveDataDirectSocket.fulfilled, (state) => {
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
        // Backend returns: {success, data: {symbol, expiry_dates: [...]}}
        const payload = action.payload;
        const expiryDates = Array.isArray(payload)
          ? payload
          : payload?.data?.expiry_dates || payload?.expiry_dates || [];
        state.expDate = expiryDates;
        if (expiryDates.length > 0) {
          const latestExpiry = getLatestExpiry(expiryDates);
          if (latestExpiry) state.exp_sid = latestExpiry;
        }
        state.loading = false;
      })
      .addCase(fetchExpiryDate.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch expiry dates";
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
  // Socket cleanup now handled by useSocket hook
  dispatch(setStreamingState(false));
};

export const clearActiveRequests = () => {
  activeRequests.clear();
};

export default dataSlice.reducer;
