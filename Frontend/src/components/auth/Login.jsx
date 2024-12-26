import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle, listenToAuthChanges } from '../../firebase/config';
import { setUser } from '../../context/authSlice';
import { toast } from 'react-toastify';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = listenToAuthChanges((firebaseUser) => {
      if (firebaseUser) {
        // Get the token when auth state changes
        firebaseUser.getIdToken().then(token => {
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            token: token // Include token in user data
          };
          dispatch(setUser(userData));
        }).catch(error => {
          console.error('Error getting token:', error);
          setError('Failed to get authentication token');
        });
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const user = await signInWithGoogle();
      if (user) {
        // Get fresh token
        const token = await user.getIdToken(true);
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          token: token // Include token in user data
        };
        dispatch(setUser(userData));
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login Error:', error);
      setError(error.message || 'Failed to sign in with Google');
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-8">
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
          >
            <img
              className="h-5 w-5 mr-2"
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
            />
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>

          {error && (
            <div className="mt-2 text-center text-sm text-red-600">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
