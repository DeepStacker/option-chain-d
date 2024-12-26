import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  // console.log('PrivateRoute - Auth State:', { isAuthenticated, user }); // Debug log

  if (!isAuthenticated || !user) {
    // console.log('User not authenticated, redirecting to login'); // Debug log
    return <Navigate to="/login" replace />;
  }

  // console.log('User authenticated, rendering protected route'); // Debug log
  return <Outlet />;
};

export default PrivateRoute;
