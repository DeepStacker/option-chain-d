// src/components/PricingCalculator.jsx
import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  XMarkIcon,
  CalculatorIcon,
  InformationCircleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

// Professional Options Pricing Calculator[2][3][7]
const PricingCalculator = memo(({ onClose, theme }) => {
  const [inputs, setInputs] = useState({
    spotPrice: 18500,
    strikePrice: 18500,
    timeToExpiry: 7,
    volatility: 20,
    riskFreeRate: 6.5,
    optionType: "call",
  });

  const [results, setResults] = useState({});
  const [isCalculating, setIsCalculating] = useState(false);

  // Black-Scholes Options Pricing Model[2][7]
  const calculateBlackScholes = useCallback((params) => {
    const {
      spotPrice,
      strikePrice,
      timeToExpiry,
      volatility,
      riskFreeRate,
      optionType,
    } = params;

    const S = parseFloat(spotPrice);
    const K = parseFloat(strikePrice);
    const T = parseFloat(timeToExpiry) / 365;
    const r = parseFloat(riskFreeRate) / 100;
    const sigma = parseFloat(volatility) / 100;

    // Standard normal cumulative distribution function
    const normCDF = (x) => {
      return 0.5 * (1 + erf(x / Math.sqrt(2)));
    };

    // Error function approximation
    const erf = (x) => {
      const a1 = 0.254829592;
      const a2 = -0.284496736;
      const a3 = 1.421413741;
      const a4 = -1.453152027;
      const a5 = 1.061405429;
      const p = 0.3275911;

      const sign = x >= 0 ? 1 : -1;
      x = Math.abs(x);

      const t = 1.0 / (1.0 + p * x);
      const y =
        1.0 -
        ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

      return sign * y;
    };

    // Calculate d1 and d2
    const d1 =
      (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) /
      (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);

    // Calculate option price and Greeks
    let optionPrice, delta, gamma, theta, vega, rho;

    if (optionType === "call") {
      optionPrice = S * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d2);
      delta = normCDF(d1);
      rho = (K * T * Math.exp(-r * T) * normCDF(d2)) / 100;
    } else {
      optionPrice = K * Math.exp(-r * T) * normCDF(-d2) - S * normCDF(-d1);
      delta = normCDF(d1) - 1;
      rho = (-K * T * Math.exp(-r * T) * normCDF(-d2)) / 100;
    }

    // Common Greeks calculations
    const phi_d1 = Math.exp(-0.5 * d1 * d1) / Math.sqrt(2 * Math.PI);
    gamma = phi_d1 / (S * sigma * Math.sqrt(T));
    theta =
      ((-S * phi_d1 * sigma) / (2 * Math.sqrt(T)) -
        r * K * Math.exp(-r * T) * normCDF(optionType === "call" ? d2 : -d2)) /
      365;
    vega = (S * phi_d1 * Math.sqrt(T)) / 100;

    return {
      optionPrice: Math.max(0, optionPrice),
      delta: delta,
      gamma: gamma,
      theta: theta,
      vega: vega,
      rho: rho,
      intrinsicValue: Math.max(0, optionType === "call" ? S - K : K - S),
      timeValue: Math.max(
        0,
        optionPrice - Math.max(0, optionType === "call" ? S - K : K - S)
      ),
    };
  }, []);

  // Calculate results when inputs change[7]
  useEffect(() => {
    setIsCalculating(true);
    const timer = setTimeout(() => {
      try {
        const calculatedResults = calculateBlackScholes(inputs);
        setResults(calculatedResults);
      } catch (error) {
        toast.error("Error in calculation: " + error.message);
      }
      setIsCalculating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputs, calculateBlackScholes]);

  // Handle input changes
  const handleInputChange = useCallback((field, value) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Input validation
  const validateInputs = useMemo(() => {
    const errors = {};
    if (inputs.spotPrice <= 0) errors.spotPrice = "Must be positive";
    if (inputs.strikePrice <= 0) errors.strikePrice = "Must be positive";
    if (inputs.timeToExpiry <= 0) errors.timeToExpiry = "Must be positive";
    if (inputs.volatility <= 0) errors.volatility = "Must be positive";
    if (inputs.riskFreeRate < 0) errors.riskFreeRate = "Cannot be negative";
    return errors;
  }, [inputs]);

  // Format number for display
  const formatNumber = useCallback((num, decimals = 2) => {
    if (typeof num !== "number" || isNaN(num)) return "0.00";
    return num.toFixed(decimals);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-3">
            <CalculatorIcon className="w-8 h-8 text-blue-500" />
            <div>
              <h2
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Options Pricing Calculator
              </h2>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Black-Scholes model with Greeks calculation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === "dark"
                ? "text-gray-400 hover:text-white hover:bg-gray-700"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Parameters */}
            <div
              className={`p-6 rounded-xl border ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-6 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Input Parameters
              </h3>

              <div className="space-y-6">
                {/* Option Type */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Option Type
                  </label>
                  <div className="flex space-x-4">
                    {["call", "put"].map((type) => (
                      <button
                        key={type}
                        onClick={() => handleInputChange("optionType", type)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          inputs.optionType === type
                            ? theme === "dark"
                              ? "bg-blue-600 text-white"
                              : "bg-blue-500 text-white"
                            : theme === "dark"
                            ? "bg-gray-600 text-gray-300 hover:bg-gray-500"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {type.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spot Price */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Spot Price (₹)
                  </label>
                  <input
                    type="number"
                    value={inputs.spotPrice}
                    onChange={(e) =>
                      handleInputChange(
                        "spotPrice",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      theme === "dark"
                        ? "bg-gray-600 border-gray-500 text-white focus:border-blue-400"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                  {validateInputs.spotPrice && (
                    <p className="text-red-500 text-sm mt-1">
                      {validateInputs.spotPrice}
                    </p>
                  )}
                </div>

                {/* Strike Price */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Strike Price (₹)
                  </label>
                  <input
                    type="number"
                    value={inputs.strikePrice}
                    onChange={(e) =>
                      handleInputChange(
                        "strikePrice",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      theme === "dark"
                        ? "bg-gray-600 border-gray-500 text-white focus:border-blue-400"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>

                {/* Time to Expiry */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Time to Expiry (Days)
                  </label>
                  <input
                    type="number"
                    value={inputs.timeToExpiry}
                    onChange={(e) =>
                      handleInputChange(
                        "timeToExpiry",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      theme === "dark"
                        ? "bg-gray-600 border-gray-500 text-white focus:border-blue-400"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>

                {/* Volatility */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Implied Volatility (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.volatility}
                    onChange={(e) =>
                      handleInputChange(
                        "volatility",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      theme === "dark"
                        ? "bg-gray-600 border-gray-500 text-white focus:border-blue-400"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>

                {/* Risk-Free Rate */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Risk-Free Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.riskFreeRate}
                    onChange={(e) =>
                      handleInputChange(
                        "riskFreeRate",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      theme === "dark"
                        ? "bg-gray-600 border-gray-500 text-white focus:border-blue-400"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>
              </div>
            </div>

            {/* Results */}
            <div
              className={`p-6 rounded-xl border ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-6 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Calculation Results
              </h3>

              {isCalculating ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Option Price */}
                  <div
                    className={`p-4 rounded-lg ${
                      theme === "dark" ? "bg-gray-600" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Option Price
                      </span>
                      <span
                        className={`text-2xl font-bold ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        ₹{formatNumber(results.optionPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Greeks */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Delta", value: results.delta, format: 4 },
                      { label: "Gamma", value: results.gamma, format: 6 },
                      { label: "Theta", value: results.theta, format: 2 },
                      { label: "Vega", value: results.vega, format: 2 },
                      { label: "Rho", value: results.rho, format: 2 },
                    ].map((greek, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg text-center ${
                          theme === "dark" ? "bg-gray-600" : "bg-white"
                        }`}
                      >
                        <div
                          className={`text-sm font-medium ${
                            theme === "dark" ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {greek.label}
                        </div>
                        <div
                          className={`text-lg font-bold ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {formatNumber(greek.value, greek.format)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Additional Metrics */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span
                        className={`${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Intrinsic Value
                      </span>
                      <span
                        className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        ₹{formatNumber(results.intrinsicValue)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        className={`${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Time Value
                      </span>
                      <span
                        className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        ₹{formatNumber(results.timeValue)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Information Panel */}
          <div
            className={`mt-8 p-4 rounded-lg border-l-4 border-blue-500 ${
              theme === "dark" ? "bg-blue-900/20" : "bg-blue-50"
            }`}
          >
            <div className="flex items-start space-x-3">
              <InformationCircleIcon className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4
                  className={`font-medium ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  About Black-Scholes Model
                </h4>
                <p
                  className={`text-sm mt-1 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  This calculator uses the Black-Scholes model to estimate
                  option prices and Greeks. Results are theoretical and actual
                  market prices may vary due to factors not included in the
                  model.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

PricingCalculator.displayName = "PricingCalculator";

export default PricingCalculator;
