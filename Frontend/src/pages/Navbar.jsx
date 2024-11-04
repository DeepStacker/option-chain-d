import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../context/themeSlice"; // Import theme actions
import { FaSun, FaMoon } from "react-icons/fa"; // Import theme icons
import { BsGraphUp } from "react-icons/bs"; // Optional: example icon for the logo

const Navbar = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  return (
    <nav
      className={`transition ${
        theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-white"
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

        {/* Navigation Links */}
        <ul className="flex space-x-6">
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
        </ul>

        {/* Theme Toggle Button with Icons */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className={`p-2 transition rounded-full ${
            theme === "light"
              ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>

        {/* Call-to-Action Button */}
        {/* <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
          Get Started
        </button> */}
      </div>
    </nav>
  );
};

export default Navbar;
