import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const { isAuthenticated, user, authLoading } = useSelector((state) => state.auth);

  if (authLoading) {
    // Show a loading indicator while authenticating
    return <div>Loading...</div>; // Or any other loading indicator
  }

  if (!isAuthenticated || !user) {
    localStorage.setItem('redirectAfterLogin', window.location.pathname);
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
