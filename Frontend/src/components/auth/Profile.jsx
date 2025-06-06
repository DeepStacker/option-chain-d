import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import {
  FaUser,
  FaCog,
  FaBell,
  FaShieldAlt,
  FaHistory,
  FaChartLine,
} from "react-icons/fa";

const Profile = () => {
  const theme = useSelector((state) => state.theme.theme);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  // Get user from localStorage
  const getAuthToken = () => localStorage.getItem("user");
  const user = getAuthToken() ? JSON.parse(getAuthToken()) : null;

  const tabs = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "settings", label: "Settings", icon: <FaCog /> },
    { id: "notifications", label: "Notifications", icon: <FaBell /> },
    { id: "security", label: "Security", icon: <FaShieldAlt /> },
    { id: "history", label: "History", icon: <FaHistory /> },
    { id: "analytics", label: "Analytics", icon: <FaChartLine /> },
  ];

  const profileData = {
    username: user?.username || "Trader",
    email: user?.email || "trader@example.com",
    joinDate: user?.joinDate || new Date().toLocaleDateString(),
    subscription: user?.subscription_type || "Standard",
    trades: "156",
    winRate: "68%",
  };

  const notificationSettings = [
    { id: "trade_alerts", label: "Trade Alerts", enabled: true },
    { id: "price_alerts", label: "Price Alerts", enabled: true },
    { id: "news_updates", label: "News Updates", enabled: false },
    { id: "market_analysis", label: "Market Analysis", enabled: true },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-4">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                {profileData.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {profileData.username}
                </h2>
                <p
                  className={`${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {profileData.email}
                </p>
              </div>

              <span
                className={`text-center py-8 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {profileData.email === "svm.singh.01@gmail.com" ? (
                  <a
                    href="/admin"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Go to Admin Panel
                  </a>
                ) : (
                  <p>Welcome, {profileData.name || "User"}!</p>
                )}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <div className="text-sm text-gray-500">Total Trades</div>
                <div
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {profileData.trades}
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <div className="text-sm text-gray-500">Win Rate</div>
                <div
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {profileData.winRate}
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <div className="text-sm text-gray-500">Member Since</div>
                <div
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {profileData.joinDate}
                </div>
              </motion.div>
            </div>
          </motion.div>
        );

      case "notifications":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h3
              className={`text-xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Notification Settings
            </h3>
            {notificationSettings.map((setting) => (
              <motion.div
                key={setting.id}
                whileHover={{ scale: 1.01 }}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <span
                  className={theme === "dark" ? "text-white" : "text-gray-900"}
                >
                  {setting.label}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={setting.enabled}
                    onChange={() => {}}
                  />
                  <div
                    className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                    peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer 
                    dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white 
                    after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
                    after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                    after:transition-all dark:border-gray-500 peer-checked:bg-blue-600`}
                  ></div>
                </label>
              </motion.div>
            ))}
          </motion.div>
        );

      case "security":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h3
              className={`text-xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Security Settings
            </h3>
            <div
              className={`p-6 rounded-lg ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <h4
                className={`text-lg font-semibold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Change Password
              </h4>
              <form className="space-y-4">
                <div>
                  <label
                    className={`block mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    className={`w-full p-2 rounded-lg border ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>
                <div>
                  <label
                    className={`block mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    className={`w-full p-2 rounded-lg border ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>
                <button
                  className={`px-4 py-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white font-semibold`}
                >
                  Update Password
                </button>
              </form>
            </div>
          </motion.div>
        );

      default:
        return (
          <div
            className={`text-center py-8 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Coming Soon
          </div>
        );
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div
        className={`max-w-6xl mx-auto rounded-lg shadow-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } p-6`}
      >
        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? theme === "dark"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-500 text-white"
                  : theme === "dark"
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">{renderTabContent()}</AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;
