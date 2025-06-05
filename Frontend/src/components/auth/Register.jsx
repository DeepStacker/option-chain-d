import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { signInWithGoogle } from "../../firebase/init";
import { setUser } from "../../context/authSlice";
import { toast } from "react-toastify";
import {
  UserPlusIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { isAuthenticated, user, authLoading } = useSelector(
    (state) => state.auth
  );
  const theme = useSelector((state) => state.theme?.theme || "light");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      const redirectPath =
        localStorage.getItem("redirectAfterLogin") || "/dashboard";
      localStorage.removeItem("redirectAfterLogin");
      navigate(redirectPath);
    }
  }, [isAuthenticated, user, navigate, authLoading]);

  const handleGoogleRegister = async () => {
    try {
      setLoading(true);
      setError("");
      const user = await signInWithGoogle();
      if (user) {
        const token = await user.getIdToken(true);
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          token,
        };
        dispatch(setUser(userData));
        toast.success("Welcome to TradePro! Registration successful.");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      setError(error.message || "Failed to sign up with Google");
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`max-w-md w-full space-y-8 p-8 xl:p-10 rounded-2xl shadow-2xl border backdrop-blur-sm ${
          theme === "dark"
            ? "bg-gray-800/90 border-gray-700"
            : "bg-white/90 border-gray-200"
        }`}
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-8 ${
              theme === "dark"
                ? "bg-gradient-to-r from-blue-600 to-blue-700"
                : "bg-gradient-to-r from-blue-500 to-blue-600"
            } shadow-xl`}
          >
            <UserPlusIcon className="w-10 h-10 text-white" />
          </motion.div>

          <h2
            className={`text-3xl xl:text-4xl font-bold mb-3 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Create Your Account
          </h2>
          <p
            className={`text-lg ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Join TradePro for intelligent trading solutions
          </p>
        </div>

        {/* Google Register Button */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleRegister}
          disabled={loading}
          className={`group relative w-full flex justify-center items-center py-4 xl:py-5 px-6 border border-transparent rounded-xl text-lg font-semibold transition-all duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : theme === "dark"
              ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl hover:shadow-2xl"
              : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl"
          } focus:outline-none focus:ring-4 focus:ring-blue-500/50`}
        >
          <motion.img
            animate={{ rotate: loading ? 360 : 0 }}
            transition={{
              duration: 1,
              repeat: loading ? Infinity : 0,
              ease: "linear",
            }}
            className="h-6 w-6 mr-4"
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
          />
          {loading ? (
            <span className="flex items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
              />
              Authenticating...
            </span>
          ) : (
            "Continue with Google"
          )}
        </motion.button>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start p-4 rounded-xl border ${
                theme === "dark"
                  ? "bg-red-900/30 border-red-500/50 text-red-300"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              <ExclamationTriangleIcon className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Registration Error</p>
                <p className="text-sm mt-1 opacity-90">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Security Notice */}
        <div
          className={`text-center space-y-3 pt-4 border-t ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div
            className={`flex items-center justify-center space-x-2 text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <ShieldCheckIcon className="w-5 h-5 text-green-500" />
            <span>Secure Google OAuth integration</span>
          </div>
          <p
            className={`text-xs leading-relaxed ${
              theme === "dark" ? "text-gray-500" : "text-gray-500"
            }`}
          >
            By signing up, you agree to our{" "}
            <a
              href="/terms"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
