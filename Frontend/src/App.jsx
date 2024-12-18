import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/auth/Profile';
import OptionChain from './pages/OptionChain';
import Dashboard from './pages/Dashboard';
import ErrorBoundary from './ErrorBoundary';
import Blog from './pages/Blog';
import About from './pages/About';
import ProfitLossCalculator from './pages/Tca';
import ContactUs from './pages/Contact';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const theme = useSelector((state) => state.theme.theme);

  return (
    <Router>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <ErrorBoundary>
          <Navbar />
          <div className="pt-16"> {/* Add padding top to account for fixed navbar */}
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<ContactUs />} />
              
              {/* Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/option-chain"
                element={
                  <ProtectedRoute>
                    <OptionChain />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/risk-analysis"
                element={
                  <ProtectedRoute>
                    <ProfitLossCalculator />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/blog"
                element={
                  <ProtectedRoute>
                    <Blog />
                  </ProtectedRoute>
                }
              />
              
              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;
