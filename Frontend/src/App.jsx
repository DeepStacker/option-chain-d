import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { initializeAuth, setupAuthListener } from "./context/authSlice";
import { HelmetProvider } from "react-helmet-async";
import AuthRedirect from "./components/AuthRedirect";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './context/store';

// Components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./components/auth/Profile";
import PrivateRoute from "./components/auth/PrivateRoute";
import ErrorBoundary from "./ErrorBoundary";
import Home from "./pages/Home";
import About from "./pages/About";
import Blog from "./pages/Blog";
import ContactUs from "./pages/Contact";
import Tca from "./pages/Tca";
import PositionSizing from "./pages/PositionSizing";
import OptionChain from "./pages/OptionChain";
import NotFound from "./pages/NotFound";
import MainLayout from "./layouts/MainLayout";
import URLToggle from "./components/admin/URLToggle";
import { activateServices } from "./services/healthCheck";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, authLoading } = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    dispatch(initializeAuth());
    dispatch(setupAuthListener());
    activateServices();
  }, [dispatch]);

  // Show loading spinner while authentication is being initialized
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <AuthRedirect />
            <div className={theme === "dark" ? "dark" : "light"}>
              <ToastContainer position="top-right" />
              <Routes>
                {/* Main Layout Routes */}
                <Route element={<MainLayout />}>
                  {/* Auth Routes */}
                  <Route
                    path="/login"
                    element={
                      !isAuthenticated ? (
                        <Login />
                      ) : (
                        <Navigate to="/dashboard" replace />
                      )
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      !isAuthenticated ? (
                        <Register />
                      ) : (
                        <Navigate to="/dashboard" replace />
                      )
                    }
                  />

                  {/* Public Routes */}
                  <Route
                    path="/"
                    element={
                      isAuthenticated ? (
                        <Navigate to="/dashboard" replace />
                      ) : (
                        <Home />
                      )
                    }
                  />
                  <Route path="/about" element={<About />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/contact" element={<ContactUs />} />

                  {/* Protected Routes */}
                  <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/option-chain" element={<OptionChain />} />
                    <Route path="/position-sizing" element={<PositionSizing />} />
                    <Route path="/tca" element={<Tca />} />
                    <Route path="/admin" element={<URLToggle />} />
                  </Route>
                </Route>
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Router>
        </PersistGate>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
