// src/components/OptionsTable.jsx
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
  useRef,
  lazy,
  Suspense,
} from "react";
import { debounce, throttle } from "lodash";
import { unstable_batchedUpdates } from "react-dom";
import axios from "axios";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "react-toastify";
import { FixedSizeList as List } from "react-window";
import {
  findStrikes,
  renderStrikeRow,
  VirtualizedOptionChainTable,
} from "../utils/optionChainTable/OptionTableUtils";
import { useDispatch, useSelector } from "react-redux";
import { setIsOc, setPopupData } from "../context/dataSlice";
import { setStrike } from "../context/optionData";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import LabelSight from "./LabelSight";
import Ticker from "./Ticker";
import TickerChange from "./TickerChange";
import Line from "./Line";
import "./tableStyle.css";

// Lazy load popup components for better performance
const Popup = lazy(() => import("./charts/ChartPopup"));
const DeltaPopup = lazy(() => import("./charts/DeltaChartPopup"));
const IVPopup = lazy(() => import("./charts/Popup"));
const FuturePopup = lazy(() => import("./charts/FuturePopup"));
const ReversalPopup = lazy(() => import("./charts/ReversalPopup"));

// Optimized API Service Class with enhanced caching and retry logic
class OptionsAPIService {
  constructor() {
    this.abortController = null;
    this.cache = new Map();
    this.CACHE_DURATION = 5000; // 5 seconds
    this.MAX_RETRIES = 3;
    this.RETRY_DELAY = 1000;
    this.requestQueue = new Map();

    this.axiosInstance = axios.create({
      baseURL: "http://localhost:10001",
      timeout: 10000,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    });

    // Request interceptor with request deduplication
    this.axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      // Add request ID for deduplication
      config.requestId = this.generateRequestId(config);
      return config;
    });

    // Response interceptor with enhanced error handling
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Clean up request queue on success
        if (response.config.requestId) {
          this.requestQueue.delete(response.config.requestId);
        }
        return response;
      },
      (error) => {
        // Clean up request queue on error
        if (error.config?.requestId) {
          this.requestQueue.delete(error.config.requestId);
        }
        console.error("API Error:", error);
        return Promise.reject(error);
      }
    );
  }

  generateRequestId(config) {
    return `${config.method}_${config.url}_${JSON.stringify(config.data)}`;
  }

  getCacheKey(endpoint, params) {
    return `${endpoint}_${JSON.stringify(params)}`;
  }

  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  setCachedData(key, data) {
    // Implement LRU cache with size limit
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async fetchData(endpoint, params, retryCount = 0) {
    const cacheKey = this.getCacheKey(endpoint, params);
    const cachedData = this.getCachedData(cacheKey);

    if (cachedData) return cachedData;

    // Request deduplication
    const requestId = this.generateRequestId({ url: endpoint, data: params });
    if (this.requestQueue.has(requestId)) {
      return this.requestQueue.get(requestId);
    }

    if (this.abortController) this.abortController.abort();
    this.abortController = new AbortController();

    const requestPromise = (async () => {
      try {
        const response = await this.axiosInstance.post(endpoint, params, {
          signal: this.abortController.signal,
          requestId,
        });
        this.setCachedData(cacheKey, response.data);
        return response.data;
      } catch (error) {
        if (error.name === "AbortError") return;
        if (retryCount < this.MAX_RETRIES) {
          await new Promise((resolve) =>
            setTimeout(resolve, this.RETRY_DELAY * Math.pow(2, retryCount))
          );
          return this.fetchData(endpoint, params, retryCount + 1);
        }
        throw error;
      } finally {
        this.requestQueue.delete(requestId);
      }
    })();

    this.requestQueue.set(requestId, requestPromise);
    return requestPromise;
  }

  async fetchPercentageData(params) {
    return this.fetchData("/api/percentage-data/", {
      ...params,
      option_type: params.option_type || "CE",
    });
  }

  async fetchIVData(params) {
    return this.fetchData("/api/iv-data/", {
      ...params,
      option_type: params.option_type || "CE",
    });
  }

  async fetchDeltaData(params) {
    return this.fetchData("/api/delta-data/", {
      ...params,
      option_type: params.option_type || "CE",
    });
  }

  async fetchFuturePriceData(params) {
    return this.fetchData("/api/fut-data/", {
      ...params,
      option_type: params.option_type || "CE",
    });
  }

  cleanup() {
    if (this.abortController) this.abortController.abort();
    this.cache.clear();
    this.requestQueue.clear();
  }
}

// Enhanced Custom Hook for API Operations
const useOptionsAPI = () => {
  const apiService = useRef(new OptionsAPIService()).current;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeAPICall = useCallback(
    async (apiMethod, params, onSuccess) => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiMethod(params);
        if (data) {
          dispatch(setPopupData(data));
          onSuccess();
        } else {
          throw new Error("No data received from API.");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch data. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    return () => apiService.cleanup();
  }, [apiService]);

  return { apiService, executeAPICall, loading, error };
};

// Enhanced Error Boundary Fallback
const ErrorFallback = memo(({ error, resetErrorBoundary, theme }) => (
  <div
    className={`fixed inset-0 flex items-center justify-center ${
      theme === "dark" ? "bg-gray-900" : "bg-gray-100"
    } z-50`}
    role="alert"
  >
    <div
      className={`p-6 rounded-lg shadow-lg max-w-md text-center ${
        theme === "dark"
          ? "bg-gray-800 text-gray-300"
          : "bg-white text-gray-700"
      }`}
    >
      <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
      <p className="mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          theme === "dark"
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        Try Again
      </button>
    </div>
  </div>
));

ErrorFallback.displayName = "ErrorFallback";

// Optimized Spot Component
const Spot = memo(({ spotPrice, isPriceUp, theme }) => (
  <div className="flex items-center space-x-2">
    <span
      className={`font-semibold text-sm ${
        isPriceUp ? "text-green-500" : "text-red-500"
      }`}
    >
      {spotPrice}
    </span>
    {isPriceUp ? (
      <ArrowUpIcon className="h-4 w-4 text-green-500" aria-hidden="true" />
    ) : (
      <ArrowDownIcon className="h-4 w-4 text-red-500" aria-hidden="true" />
    )}
  </div>
));

Spot.displayName = "Spot";

// Enhanced Loading Component
const LoadingSpinner = memo(({ theme }) => (
  <div
    className={`flex flex-col items-center justify-center h-screen ${
      theme === "dark" ? "text-gray-300" : "text-gray-700"
    }`}
  >
    <div
      className="animate-spin rounded-full border-4 border-t-blue-500 h-12 w-12"
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
    <p className="mt-4 text-lg font-medium">Loading Options Data...</p>
  </div>
));

LoadingSpinner.displayName = "LoadingSpinner";

// Virtualized Table Row Component for performance
const VirtualizedTableRow = memo(({ index, style, data }) => {
  const {
    strikes,
    options,
    isHighlighting,
    isItmHighlighting,
    optionData,
    eventHandlers,
    theme,
    sltp,
  } = data;

  const strike = strikes[index];

  if (!options[strike]) {
    return <div style={style} />;
  }

  return (
    <div style={style} className="flex">
      <table className="w-full table-fixed">
        <tbody>
          <tr
            className={`text-center text-sm transition-all duration-200 ${
              theme === "dark"
                ? "divide-gray-800 hover:bg-gray-700"
                : "divide-gray-300 hover:bg-gray-50"
            } divide-x`}
            role="row"
          >
            {renderStrikeRow(
              options[strike],
              strike,
              isHighlighting,
              isItmHighlighting,
              optionData,
              eventHandlers.handlePercentageClick,
              eventHandlers.handleDeltaClick,
              eventHandlers.handleIVClick,
              eventHandlers.handleReversalClick,
              theme,
              sltp
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
});

VirtualizedTableRow.displayName = "VirtualizedTableRow";

// Enhanced Table Header Component
const TableHeader = memo(({ ceHeaders, peHeaders, theme }) => (
  <div
    className={`sticky top-0 z-10 ${
      theme === "dark" ? "bg-gray-800" : "bg-white"
    } font-semibold text-xs uppercase shadow-sm`}
  >
    <table className="w-full table-fixed">
      <thead role="rowgroup">
        <tr
          className={`divide-x ${
            theme === "dark" ? "divide-gray-600" : "divide-gray-200"
          }`}
          role="row"
        >
          {ceHeaders.map((header, index) => (
            <th
              key={`ce-${index}`}
              className="p-3 bg-red-800 text-white text-center"
              scope="col"
            >
              <span>{header.label}</span>
              {header.subtitle && (
                <>
                  <br />
                  <small className="text-red-100">{header.subtitle}</small>
                </>
              )}
            </th>
          ))}
          <th
            className="p-3 bg-yellow-300 text-yellow-800 font-bold text-center"
            scope="col"
          >
            Strike Price
            <br />
            <small className="text-xs text-yellow-600">PCR</small>
          </th>
          {peHeaders.map((header, index) => (
            <th
              key={`pe-${index}`}
              className="p-3 bg-green-700 text-white text-center"
              scope="col"
            >
              <span>{header.label}</span>
              {header.subtitle && (
                <>
                  <br />
                  <small className="text-green-100">{header.subtitle}</small>
                </>
              )}
            </th>
          ))}
        </tr>
      </thead>
    </table>
  </div>
));

TableHeader.displayName = "TableHeader";

// ATM Row Component for the middle section
const ATMRow = memo(({ eventHandlers, theme }) => (
  <div className="sticky z-20 bg-opacity-95 backdrop-blur-sm">
    <table className="w-full table-fixed">
      <tbody>
        <tr role="row">
          <td colSpan={1} className="p-2">
            <Line />
          </td>
          <td colSpan={2} className="p-2">
            <Ticker />
          </td>
          <td colSpan={1}>
            <Line />
          </td>
          <td
            colSpan={5}
            onClick={() => eventHandlers.handleFuturePriceClick()}
            className={`p-2 cursor-pointer text-center transition-colors ${
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            <LabelSight />
          </td>
          <td colSpan={1}>
            <Line />
          </td>
          <td colSpan={2} className="p-2">
            <TickerChange />
          </td>
          <td colSpan={1}>
            <Line />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
));

ATMRow.displayName = "ATMRow";

// Main OptionsTable Component with Virtualization
function OptionsTable() {
  const dispatch = useDispatch();
  const {
    apiService,
    executeAPICall,
    loading,
    error: apiError,
  } = useOptionsAPI();

  // Redux state
  const theme = useSelector((state) => state.theme.theme);
  const isReversed = useSelector((state) => state.theme.isReversed);
  const isHighlighting = useSelector((state) => state.theme.isHighlighting);
  const isItmHighlighting = useSelector(
    (state) => state.theme.isItmHighlighting
  );
  const data = useSelector((state) => state.data.data);
  const sltp = useSelector((state) => state.data.data?.options?.data?.sltp);
  const exp = useSelector((state) => state.data.exp_sid);
  const sid = useSelector((state) => state.data.sid);
  const error = useSelector((state) => state.data.error);
  const strike = useSelector((state) => state.optionChain.strike);
  const popupData = useSelector((state) => state.optionChain.popupData);

  // Local state
  const [popupStates, setPopupStates] = useState({
    isPopupVisible: false,
    isDeltaPopupVisible: false,
    isFuturePricePopupVisible: false,
    isReversalPopupVisible: false,
    isIVPopupVisible: false,
    isExpiryPopupVisible: false,
  });
  const [sortOrder, setSortOrder] = useState("desc");
  const [useVirtualization, setUseVirtualization] = useState(true);

  // Memoized calculations
  const options = useMemo(
    () => data?.options?.data?.oc || {},
    [data?.options?.data?.oc]
  );

  const atmPrice = useMemo(
    () => (data?.spot?.data?.Ltp ? Math.round(data.spot.data.Ltp) : null),
    [data?.spot?.data?.Ltp]
  );

  const spotPrice = useMemo(
    () =>
      data?.spot?.data?.Ltp !== undefined
        ? parseFloat(data.spot.data.Ltp).toFixed(2)
        : null,
    [data?.spot?.data?.Ltp]
  );

  // Price tracking with throttling
  const lastSpotPriceRef = useRef(spotPrice);
  const [isPriceUp, setIsPriceUp] = useState(false);

  const updatePriceDirection = useCallback(
    throttle((newPrice, lastPrice) => {
      if (newPrice !== null && lastPrice !== null && newPrice !== lastPrice) {
        setIsPriceUp(newPrice > lastPrice);
        lastSpotPriceRef.current = newPrice;
      }
    }, 100),
    []
  );

  useEffect(() => {
    if (spotPrice !== null) {
      updatePriceDirection(parseFloat(spotPrice), lastSpotPriceRef.current);
    }
  }, [spotPrice, updatePriceDirection]);

  // Memoized strikes with performance optimization
  const { nearestStrike, otmStrikes, itmStrikes } = useMemo(() => {
    return findStrikes(options, atmPrice);
  }, [options, atmPrice]);

  // Optimized strike data processing
  const processedStrikes = useMemo(() => {
    const itmStrikes_copy = [...itmStrikes].sort((a, b) =>
      sortOrder === "asc"
        ? parseFloat(a) - parseFloat(b)
        : parseFloat(b) - parseFloat(a)
    );
    const otmStrikes_copy = [...otmStrikes].sort((a, b) =>
      sortOrder === "asc"
        ? parseFloat(a) - parseFloat(b)
        : parseFloat(b) - parseFloat(a)
    );

    const itmActiveStrikes = isReversed
      ? otmStrikes_copy
      : itmStrikes_copy.reverse();
    const otmActiveStrikes = isReversed
      ? itmStrikes_copy
      : otmStrikes_copy.reverse();

    // Combine strikes for virtualization
    const allStrikes = [...itmActiveStrikes, ...otmActiveStrikes];

    return {
      itmActiveStrikes,
      otmActiveStrikes,
      allStrikes,
      atmIndex: itmActiveStrikes.length, // Index where ATM row should be inserted
    };
  }, [itmStrikes, otmStrikes, isReversed, sortOrder]);

  // Event handlers with memoization
  const eventHandlers = useMemo(
    () => ({
      handlePercentageClick: (isCe, strike) => {
        executeAPICall(
          (params) => apiService.fetchPercentageData(params),
          { sid, exp_sid: exp, strike, option_type: isCe ? "CE" : "PE" },
          () => setPopupStates((prev) => ({ ...prev, isPopupVisible: true }))
        );
      },
      handleIVClick: (isCe, strike) => {
        executeAPICall(
          (params) => apiService.fetchIVData(params),
          { sid, exp_sid: exp, strike, option_type: isCe ? "CE" : "PE" },
          () => setPopupStates((prev) => ({ ...prev, isIVPopupVisible: true }))
        );
      },
      handleDeltaClick: (strike) => {
        executeAPICall(
          (params) => apiService.fetchDeltaData(params),
          { sid, exp_sid: exp, strike },
          () =>
            setPopupStates((prev) => ({ ...prev, isDeltaPopupVisible: true }))
        );
      },
      handleFuturePriceClick: (strike) => {
        executeAPICall(
          (params) => apiService.fetchFuturePriceData(params),
          { sid, exp_sid: exp, strike },
          () =>
            setPopupStates((prev) => ({
              ...prev,
              isFuturePricePopupVisible: true,
            }))
        );
      },
      handleReversalClick: (strike) => {
        try {
          if (data) {
            dispatch(setStrike(strike));
            setPopupStates((prev) => ({
              ...prev,
              isReversalPopupVisible: true,
            }));
          }
        } catch (error) {
          toast.error("Error in reversal click: " + error.message);
        }
      },
    }),
    [sid, exp, data, dispatch, executeAPICall, apiService]
  );

  // Virtualization data
  const virtualizationData = useMemo(
    () => ({
      strikes: processedStrikes.allStrikes,
      options,
      isHighlighting,
      isItmHighlighting,
      optionData: data?.options?.data,
      eventHandlers,
      theme,
      sltp,
    }),
    [
      processedStrikes.allStrikes,
      options,
      isHighlighting,
      isItmHighlighting,
      data?.options?.data,
      eventHandlers,
      theme,
      sltp,
    ]
  );

  // Close popup handler
  const closePopup = useCallback(() => {
    dispatch(setPopupData(null));
    setPopupStates({
      isPopupVisible: false,
      isDeltaPopupVisible: false,
      isFuturePricePopupVisible: false,
      isReversalPopupVisible: false,
      isIVPopupVisible: false,
      isExpiryPopupVisible: false,
    });
  }, [dispatch]);

  // Toggle expiry popup
  const toggleExpiryPopup = useCallback(() => {
    setPopupStates((prev) => ({
      ...prev,
      isExpiryPopupVisible: !prev.isExpiryPopupVisible,
    }));
  }, []);

  // Refresh data handler
  const handleRefresh = useCallback(() => {
    apiService.cache.clear();
    toast.info("Refreshing data...");
  }, [apiService]);

  // Toggle sort order
  const toggleSortOrder = useCallback(() => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  // Toggle virtualization
  const toggleVirtualization = useCallback(() => {
    setUseVirtualization((prev) => !prev);
  }, []);

  // Effects
  useEffect(() => {
    if (sid) {
      const timer = setTimeout(() => {
        setPopupStates((prev) => ({ ...prev, isExpiryPopupVisible: false }));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [sid]);

  useEffect(() => {
    dispatch(setIsOc(true));
    return () => dispatch(setIsOc(false));
  }, [dispatch]);

  // Table headers
  const ceHeaders = [
    { label: "IV", subtitle: "Delta" },
    { label: "OI CHNG" },
    { label: "OI" },
    { label: "VOLUME" },
    { label: "LTP", subtitle: "Ltp_chng (TV)" },
    { label: "R_REV" },
  ];

  const peHeaders = [
    { label: "S_REV" },
    { label: "LTP", subtitle: "Ltp_chng (TV)" },
    { label: "VOLUME" },
    { label: "OI" },
    { label: "OI CHNG" },
    { label: "IV", subtitle: "Delta" },
  ];

  // Early return for loading state
  if (!data?.options?.data) {
    return <LoadingSpinner theme={theme} />;
  }

  // Determine if we should use virtualization based on data size
  const shouldUseVirtualization =
    useVirtualization && processedStrikes.allStrikes.length > 50;

  return (
    <ErrorBoundary
      FallbackComponent={(props) => <ErrorFallback {...props} theme={theme} />}
      onReset={handleRefresh}
    >
      <div
        className={`relative h-screen overflow-y-hidden ${
          theme === "dark"
            ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"
            : "bg-gradient-to-b from-white via-gray-100 to-gray-200"
        }`}
      >
        {/* Controls */}
        {/* <div className="flex justify-between items-center p-4 bg-opacity-80 sticky top-0 z-20">
          <div className="flex items-center space-x-2">
            <Spot spotPrice={spotPrice} isPriceUp={isPriceUp} theme={theme} />
            <LabelSight />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={toggleVirtualization}
              className={`p-2 rounded-lg text-xs ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
              aria-label="Toggle virtualization"
            >
              {useVirtualization ? "Virtual: ON" : "Virtual: OFF"}
            </button>
            <button
              onClick={toggleSortOrder}
              className={`p-2 rounded-lg ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
              aria-label={`Sort strikes ${
                sortOrder === "asc" ? "descending" : "ascending"
              }`}
            >
              Sort {sortOrder === "asc" ? "↓" : "↑"}
            </button>
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-lg ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
              aria-label="Refresh data"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
          </div>
        </div> */}

        {/* Expiry Selection Popup */}
        {!popupStates.isExpiryPopupVisible &&
          !processedStrikes.itmActiveStrikes.length &&
          !processedStrikes.otmActiveStrikes.length && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
              <div
                className={`p-6 rounded-lg shadow-xl max-w-sm ${
                  theme === "dark"
                    ? "bg-gray-800 text-gray-300"
                    : "bg-white text-gray-700"
                }`}
              >
                <p className="text-lg font-semibold">
                  Please Select an Expiry Date
                </p>
                <button
                  onClick={toggleExpiryPopup}
                  className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  Select Expiry
                </button>
              </div>
            </div>
          )}

        {/* Options Table */}
        <div className="flex flex-col h-full">
          <TableHeader
            ceHeaders={ceHeaders}
            peHeaders={peHeaders}
            theme={theme}
          />

          {shouldUseVirtualization ? (
            // Virtualized Table for large datasets
            <div className="flex-1 scrollbar-hide">
              <VirtualizedOptionChainTable
                strikes={processedStrikes.allStrikes}
                strikeDataMap={options}
                sltp={sltp}
                isHighlighting={isHighlighting}
                isItmHighlighting={isItmHighlighting}
                optionChain={data?.options?.data}
                handlePercentageClick={eventHandlers.handlePercentageClick}
                handleDeltaClick={eventHandlers.handleDeltaClick}
                handleIVClick={eventHandlers.handleIVClick}
                handleReversalClick={eventHandlers.handleReversalClick}
                theme={theme}
                height={window.innerHeight - 200}
                rowHeight={60}
              />
            </div>
          ) : (
            // Traditional table for smaller datasets
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <table
                id="options-table"
                className={`w-full text-sm border-collapse ${
                  theme === "dark"
                    ? "bg-gray-800 text-gray-300"
                    : "bg-white text-gray-700"
                } shadow-lg`}
                role="grid"
                aria-label="Options Chain Table"
              >
                <tbody
                  className={`divide-y ${
                    theme === "dark" ? "divide-gray-700" : "divide-gray-200"
                  }`}
                  role="rowgroup"
                >
                  {/* ITM Strikes */}
                  {processedStrikes.itmActiveStrikes.map((strike) => {
                    const strikeData = options[strike];
                    const { ce: ceData = {}, pe: peData = {} } = strikeData || {};
                    const oc = data?.options?.data || {};
                    const reversal = oc?.oc || {};

                    const strikeKeys = Object.keys(reversal);
                    const strikeDiff =
                      strikeKeys.length >= 2
                        ? parseFloat(strikeKeys[1]) - parseFloat(strikeKeys[0])
                        : 0;

                    const oiRatio =
                      peData?.OI && ceData?.OI && ceData.OI !== 0 ? peData.OI / ceData.OI : 0;

                    const oiChngRatio =
                      peData?.oichng && ceData?.oichng && ceData.oichng !== 0
                        ? peData.oichng / ceData.oichng
                        : 0;

                    const ceReversalValue = (strikeData?.reversal || 0) + strikeDiff;
                    const peReversalValue = strikeData?.reversal || 0;

                    return (
                      <tr
                        key={`itm-${strike}`}
                        className={`text-center text-sm transition-all duration-200 ${
                          theme === "dark"
                            ? "divide-gray-800 hover:bg-gray-700"
                            : "divide-gray-300 hover:bg-gray-50"
                        } divide-x`}
                        role="row"
                      >
                        {renderStrikeRow(
                          strikeData,
                          strike,
                          isHighlighting,
                          isItmHighlighting,
                          data.options.data,
                          eventHandlers.handlePercentageClick,
                          eventHandlers.handleDeltaClick,
                          eventHandlers.handleIVClick,
                          eventHandlers.handleReversalClick,
                          theme,
                          sltp,
                          oiRatio, // Pass calculated values
                          oiChngRatio, // Pass calculated values
                          ceReversalValue, // Pass calculated values
                          peReversalValue // Pass calculated values
                        )}
                      </tr>
                    );
                  })}

                  {/* ATM Row */}
                  <tr role="row">
                    <td colSpan={1} className="p-2">
                      <Line />
                    </td>
                    <td colSpan={2} className="p-2">
                      <Ticker />
                    </td>
                    <td colSpan={1}>
                      <Line />
                    </td>
                    <td
                      colSpan={5}
                      onClick={() => eventHandlers.handleFuturePriceClick()}
                      className={`p-2 cursor-pointer text-center transition-colors ${
                        theme === "dark"
                          ? "hover:bg-gray-700"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <LabelSight />
                    </td>
                    <td colSpan={1}>
                      <Line />
                    </td>
                    <td colSpan={2} className="p-2">
                      <TickerChange />
                    </td>
                    <td colSpan={1}>
                      <Line />
                    </td>
                  </tr>

                  {/* OTM Strikes */}
                  {processedStrikes.otmActiveStrikes.map((strike) => {
                    const strikeData = options[strike];
                    const { ce: ceData = {}, pe: peData = {} } = strikeData || {};
                    const oc = data?.options?.data || {};
                    const reversal = oc?.oc || {};

                    const strikeKeys = Object.keys(reversal);
                    const strikeDiff =
                      strikeKeys.length >= 2
                        ? parseFloat(strikeKeys[1]) - parseFloat(strikeKeys[0])
                        : 0;

                    const oiRatio =
                      peData?.OI && ceData?.OI && ceData.OI !== 0 ? peData.OI / ceData.OI : 0;

                    const oiChngRatio =
                      peData?.oichng && ceData?.oichng && ceData.oichng !== 0
                        ? peData.oichng / ceData.oichng
                        : 0;

                    const ceReversalValue = (strikeData?.reversal || 0) + strikeDiff;
                    const peReversalValue = strikeData?.reversal || 0;

                    return (
                      <tr
                        key={`otm-${strike}`}
                        className={`text-center text-sm transition-all duration-200 ${
                          theme === "dark"
                            ? "divide-gray-800 hover:bg-gray-700"
                            : "divide-gray-300 hover:bg-gray-50"
                        } divide-x`}
                        role="row"
                      >
                        {renderStrikeRow(
                          strikeData,
                          strike,
                          isHighlighting,
                          isItmHighlighting,
                          data.options.data,
                          eventHandlers.handlePercentageClick,
                          eventHandlers.handleDeltaClick,
                          eventHandlers.handleIVClick,
                          eventHandlers.handleReversalClick,
                          theme,
                          sltp,
                          oiRatio, // Pass calculated values
                          oiChngRatio, // Pass calculated values
                          ceReversalValue, // Pass calculated values
                          peReversalValue // Pass calculated values
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Popups */}
        <Suspense fallback={<div className="text-center p-4">Loading...</div>}>
          {popupStates.isPopupVisible && (
            <Popup data={popupData} onClose={closePopup} />
          )}
          {popupStates.isDeltaPopupVisible && (
            <DeltaPopup data={popupData} onClose={closePopup} />
          )}
          {popupStates?.isIVPopupVisible && (
            <IVPopup data={popupData} onClose={closePopup} />
          )}
          {popupStates?.isFuturePricePopupVisible && (
            <FuturePopup data={popupData} onClose={closePopup} />
          )}
          {popupStates?.isReversalPopupVisible && (
            <ReversalPopup strike={strike} onClose={closePopup} />
          )}
        </Suspense>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
              className={`p-4 rounded-lg ${
                theme === "dark"
                  ? "bg-gray-800 text-gray-300"
                  : "bg-white text-gray-700"
              }`}
            >
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm">Loading...</p>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default memo(OptionsTable);
