import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaUser, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { logout } from '../context/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.theme.theme);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold">
                Dhan API
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/dashboard"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${theme === 'dark' ? 'hover:text-gray-300' : 'hover:text-gray-700'}`}
              >
                Dashboard
              </Link>
              <Link
                to="/option-chain"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${theme === 'dark' ? 'hover:text-gray-300' : 'hover:text-gray-700'}`}
              >
                Option Chain
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <FaUser className="mr-2" />
                  {user?.username || 'Profile'}
                </Link>
                <button
                  onClick={handleLogout}
                  className={`ml-4 flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    theme === 'dark'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-red-500 hover:bg-red-600'
                  } text-white`}
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium mr-4 ${
                    theme === 'dark'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-green-500 hover:bg-green-600'
                  } text-white`}
                >
                  <FaUser className="mr-2" />
                  Register
                </Link>
                <Link
                  to="/login"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    theme === 'dark'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white`}
                >
                  <FaSignInAlt className="mr-2" />
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
