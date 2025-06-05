import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const NotFound = () => {
    const navigate = useNavigate();
    const theme = useSelector((state) => state.theme.theme);

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${
            theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        }`}>
            <motion.div
                className="text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* 404 Animation */}
                <motion.div
                    className="relative"
                    variants={itemVariants}
                >
                    <div className="relative inline-block">
                        <span className={`text-9xl font-bold ${
                            theme === "dark" ? "text-gray-800" : "text-gray-200"
                        }`}>
                            404
                        </span>
                        <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl font-bold ${
                            theme === "dark" ? "text-blue-500" : "text-blue-600"
                        }`}>
                            404
                        </span>
                    </div>
                </motion.div>

                {/* Error Message */}
                <motion.h1
                    className="mt-8 text-3xl font-bold"
                    variants={itemVariants}
                >
                    Oops! Page Not Found
                </motion.h1>

                <motion.p
                    className={`mt-4 text-lg ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                    variants={itemVariants}
                >
                    The page you're looking for doesn't exist or has been moved.
                </motion.p>

                {/* Navigation Buttons */}
                <motion.div
                    className="mt-8 space-x-4"
                    variants={itemVariants}
                >
                    <button
                        onClick={() => navigate(-1)}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                            theme === "dark"
                                ? "bg-gray-800 text-white hover:bg-gray-700"
                                : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                        }`}
                    >
                        Go Back
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                            theme === "dark"
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                    >
                        Go Home
                    </button>
                </motion.div>

                {/* Decorative Elements */}
                <div className="mt-12 relative">
                    <motion.div
                        className="absolute top-0 left-1/2 transform -translate-x-1/2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <div className={`w-64 h-1 rounded-full ${
                            theme === "dark" ? "bg-gray-800" : "bg-gray-300"
                        }`} />
                    </motion.div>
                </div>

                {/* Additional Info */}
                <motion.p
                    className={`mt-16 text-sm ${
                        theme === "dark" ? "text-gray-500" : "text-gray-600"
                    }`}
                    variants={itemVariants}
                >
                    If you believe this is a mistake, please contact support
                </motion.p>
            </motion.div>

            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none">
                <div className={`absolute top-20 left-20 w-32 h-32 rounded-full ${
                    theme === "dark" ? "bg-blue-900" : "bg-blue-100"
                } opacity-20 blur-xl`} />
                <div className={`absolute bottom-20 right-20 w-32 h-32 rounded-full ${
                    theme === "dark" ? "bg-purple-900" : "bg-purple-100"
                } opacity-20 blur-xl`} />
            </div>
        </div>
    );
};

export default NotFound;
