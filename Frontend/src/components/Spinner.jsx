// src/components/Spinner.js
import React, { useState, useEffect, memo } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

// CSS-only animated spinners for better performance
const SpinnerVariants = {
  pulse: () => (
    <div className="relative">
      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse"></div>
      <div className="absolute top-0 left-0 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-ping opacity-75"></div>
    </div>
  ),

  dots: () => (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.1}s` }}
        ></div>
      ))}
    </div>
  ),

  ring: () => (
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  ),

  bars: () => (
    <div className="flex space-x-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="w-1 bg-gradient-to-t from-blue-500 to-purple-600 animate-pulse"
          style={{
            height: `${20 + Math.sin(i) * 10}px`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: "1s",
          }}
        ></div>
      ))}
    </div>
  ),

  orbit: () => (
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 border-2 border-gray-200 rounded-full"></div>
      <div className="absolute top-0 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 bg-blue-500 rounded-full animate-spin origin-[6px_24px]"></div>
    </div>
  ),

  wave: () => (
    <div className="flex space-x-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="w-2 h-8 bg-gradient-to-t from-blue-500 to-purple-600 rounded-full animate-pulse"
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: "1.2s",
            transform: `scaleY(${0.4 + Math.sin(i * 0.5) * 0.6})`,
          }}
        ></div>
      ))}
    </div>
  ),

  gradient: () => (
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-spin opacity-75"></div>
      <div className="absolute inset-1 bg-white rounded-full"></div>
      <div className="absolute inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse"></div>
    </div>
  ),

  trading: () => (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex space-x-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-1 bg-gradient-to-t from-green-500 to-red-500 animate-pulse"
            style={{
              height: `${15 + Math.random() * 20}px`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: "0.8s",
            }}
          ></div>
        ))}
      </div>
      <div className="text-xs text-gray-500 animate-pulse">
        Analyzing market data...
      </div>
    </div>
  ),
};

// Progress ring component
const ProgressRing = memo(({ progress = 0, size = 48, strokeWidth = 4 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative">
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-blue-500 transition-all duration-300 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium text-gray-700">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
});

ProgressRing.displayName = "ProgressRing";

// Main Spinner Component
const Spinner = memo(
  ({
    variant = "ring",
    size = "md",
    message = "",
    showProgress = false,
    progress = 0,
    overlay = true,
    blur = true,
    className = "",
    onCancel = null,
    timeout = null,
    customColor = null,
  }) => {
    const theme = useSelector((state) => state?.theme?.theme || "light");
    const [currentProgress, setCurrentProgress] = useState(progress);
    const [timeoutReached, setTimeoutReached] = useState(false);

    // Auto-increment progress for demo purposes
    useEffect(() => {
      if (showProgress && !progress) {
        const interval = setInterval(() => {
          setCurrentProgress((prev) => {
            if (prev >= 100) return 0;
            return prev + Math.random() * 10;
          });
        }, 200);
        return () => clearInterval(interval);
      } else {
        setCurrentProgress(progress);
      }
    }, [showProgress, progress]);

    // Handle timeout
    useEffect(() => {
      if (timeout) {
        const timer = setTimeout(() => {
          setTimeoutReached(true);
        }, timeout);
        return () => clearTimeout(timer);
      }
    }, [timeout]);

    const sizeClasses = {
      sm: "w-8 h-8",
      md: "w-12 h-12",
      lg: "w-16 h-16",
      xl: "w-20 h-20",
    };

    const SpinnerComponent = SpinnerVariants[variant] || SpinnerVariants.ring;

    const overlayClasses = overlay
      ? `fixed inset-0 z-50 flex flex-col items-center justify-center ${
          theme === "dark"
            ? "bg-gray-900 bg-opacity-80"
            : "bg-white bg-opacity-80"
        } ${blur ? "backdrop-blur-sm" : ""}`
      : "flex flex-col items-center justify-center";

    const containerClasses = `
    ${overlayClasses}
    ${className}
    transition-all duration-300 ease-in-out
  `.trim();

    if (timeoutReached) {
      return (
        <div className={containerClasses}>
          <div
            className={`text-center p-6 rounded-lg shadow-lg ${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-800"
            }`}
          >
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold mb-2">
              Loading Taking Too Long
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              The request is taking longer than expected.
            </p>
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className={containerClasses}>
        <div className="flex flex-col items-center space-y-4">
          {/* Main Spinner */}
          <div
            className={`${sizeClasses[size]} flex items-center justify-center`}
            style={customColor ? { color: customColor } : {}}
          >
            {showProgress ? (
              <ProgressRing
                progress={currentProgress}
                size={parseInt(sizeClasses[size].split("-")[1]) * 4}
              />
            ) : (
              <SpinnerComponent />
            )}
          </div>

          {/* Loading Message */}
          {message && (
            <div
              className={`text-center max-w-xs ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              <p className="text-sm font-medium animate-pulse">{message}</p>
            </div>
          )}

          {/* Progress Text */}
          {showProgress && !message && (
            <div
              className={`text-center ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              <p className="text-sm font-medium">
                Loading... {Math.round(currentProgress)}%
              </p>
            </div>
          )}

          {/* Cancel Button */}
          {onCancel && (
            <button
              onClick={onCancel}
              className={`mt-4 px-4 py-2 text-sm rounded-lg transition-colors ${
                theme === "dark"
                  ? "text-gray-300 hover:text-white hover:bg-gray-700"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              Cancel
            </button>
          )}
        </div>

        {/* Animated Background Pattern (Optional) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute -top-4 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>
    );
  }
);

Spinner.propTypes = {
  variant: PropTypes.oneOf([
    "pulse",
    "dots",
    "ring",
    "bars",
    "orbit",
    "wave",
    "gradient",
    "trading",
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  message: PropTypes.string,
  showProgress: PropTypes.bool,
  progress: PropTypes.number,
  overlay: PropTypes.bool,
  blur: PropTypes.bool,
  className: PropTypes.string,
  onCancel: PropTypes.func,
  timeout: PropTypes.number,
  customColor: PropTypes.string,
};

Spinner.displayName = "Spinner";

export default Spinner;

// Export individual spinner variants for direct use
export { SpinnerVariants, ProgressRing };
