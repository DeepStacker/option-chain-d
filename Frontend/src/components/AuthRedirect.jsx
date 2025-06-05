// import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const AuthRedirect = () => {
  const navigate = useNavigate();
  const { isAuthenticated, authLoading } = useSelector((state) => state.auth);
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated && !hasRedirected) {
      const redirectPath = localStorage.getItem('redirectAfterLogin') || '/dashboard';
      localStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath, { replace: true });
      setHasRedirected(true);
    }
  }, [isAuthenticated, authLoading, navigate, hasRedirected]);

  return null;
};

export default AuthRedirect;