import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../context/themeSlice"; // Import theme actions
import { FaSun, FaMoon } from "react-icons/fa"; // Theme toggle icons
import { BsGraphUp } from "react-icons/bs"; // Logo icon
import { BiHome, BiChart, BiClipboard, BiPhone } from "react-icons/bi"; // BoxIcons

const Navbar = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  // State to toggle the mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  return (
    <nav
      className={`transition-all duration-300 ${theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-white"} shadow-lg sticky top-0 z-50`}
    >
      <div className="container mx-auto px-6 py-2 flex justify-between items-center">
        {/* Logo with optional icon */}
        <Link
          to="/"
          className="text-2xl font-extrabold flex items-center text-blue-600 hover:text-blue-500 transition duration-300 ease-in-out"
        >
          <BsGraphUp className="mr-2 text-3xl" /> Stockify
        </Link>

        {/* Mobile Menu Toggle Button */}
        <button
          className={`lg:hidden p-2 ${theme === "light" ? "text-gray-800" : "text-white"} transition-transform duration-300`}
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
          className={`lg:flex flex-1 justify-end items-center space-x-6 ${isMenuOpen
            ? "transform translate-y-0 opacity-100 ease-in-out"
            : "transform -translate-y-96 opacity-0"
            } lg:opacity-100 lg:translate-x-0 absolute lg:static w-full lg:w-auto top-16 left-0 lg:top-auto lg:left-auto lg:flex-row lg:space-x-6 space-y-0 lg:space-y-0 px-1 py-1 lg:px-0 transition-all duration-300 ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
        >
          <ul className="flex flex-col lg:flex-row space-y-0 lg:space-y-0 lg:space-x-6 w-full lg:w-auto">
            <li className="transition-all duration-300 hover:scale-105">
              <Link to="/" className="flex items-center space-x-2 hover:text-blue-600">
                <BiHome size={20} />
                <span>Home</span>
              </Link>
            </li>
            <li className="transition-all duration-300 hover:scale-105">
              <Link to="/advanced-option-chain" className="flex items-center space-x-2 hover:text-blue-600">
                <BiChart size={20} />
                <span>Option Chain</span>
              </Link>
            </li>
            <li className="transition-all duration-300 hover:scale-105">
              <Link to="/risk-analysis" className="flex items-center space-x-2 hover:text-blue-600">
                <BiClipboard size={20} />
                <span>Risk Simulator</span>
              </Link>
            </li>
            <li className="transition-all duration-300 hover:scale-105">
              <Link to="/about" className="flex items-center space-x-2 hover:text-blue-600">
                <BiClipboard size={20} />
                <span>About Us</span>
              </Link>
            </li>
            <li className="transition-all duration-300 hover:scale-105">
              <Link to="/contact" className="flex items-center space-x-2 hover:text-blue-600">
                <BiPhone size={20} />
                <span>Contact</span>
              </Link>
            </li>
            {/* Theme Toggle Button */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className={`p-0 rounded-full transition-colors duration-300 ease-in-out ${theme === "light"
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
