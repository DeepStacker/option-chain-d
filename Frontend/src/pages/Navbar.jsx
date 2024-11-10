import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../context/themeSlice"; // Import theme actions
import { FaSun, FaMoon } from "react-icons/fa"; // Import theme icons
import { BsGraphUp } from "react-icons/bs"; // Optional: example icon for the logo

const Navbar = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  // State to toggle the mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav
      className={`transition ${theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-white"
        } shadow-md sticky top-0 z-50`}
    >
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo with optional icon */}
        <Link
          to="/"
          className="text-2xl font-bold flex items-center text-blue-600"
        >
          <BsGraphUp className="mr-2" /> Stockify
        </Link>

        {/* Mobile Menu Toggle Button */}
        <button
          className="lg:hidden p-2 text-gray-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Navigation Links */}
        <div
          className={`lg:flex flex-1 justify-end items-center space-x-6 ${isMenuOpen ? "block" : "hidden"
            } bg-gray-800 lg:bg-transparent absolute lg:static w-full lg:w-auto top-16 left-0 lg:top-auto lg:left-auto lg:flex-row lg:space-x-6 space-y-4 lg:space-y-0 px-4 py-4 lg:px-0`}
        >
          <ul className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6 w-full lg:w-auto">
            <li>
              <Link to="/" className="hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>
              <Link to="/advanced-option-chain" className="hover:text-blue-600">
                Option Chain
              </Link>
            </li>
            <li>
              <Link to="/risk-analysis" className="hover:text-blue-600">
                Risk Simulator {/* Fixed typo here */}
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-600">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-600">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-blue-600">
                Blog
              </Link>
            </li>
            <button
              onClick={() => dispatch(toggleTheme())}
              className={`p-2 transition rounded-full ${theme === "light"
                ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
