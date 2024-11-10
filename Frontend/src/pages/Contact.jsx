import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../context/themeSlice"; // Make sure your themeSlice is set up
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaSun, FaMoon } from "react-icons/fa"; // Icons

const ContactUs = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme); // Get the theme from Redux

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., send data to server or API)
    alert("Your message has been sent!");
  };

  return (
    <div
      className={`min-h-screen flex justify-center items-center py-8 transition-colors duration-300 ${theme === "light" ? "bg-gray-50 text-gray-800" : "bg-gray-800 text-white"
        }`}
    >
      <div
        className={`w-full max-w-4xl p-8 rounded-lg shadow-xl transition-colors duration-300 ${theme === "light" ? "bg-white" : "bg-gray-900"
          }`}
      >
        <h2 className="text-3xl font-semibold text-center mb-8">Contact Us</h2>

        {/* Theme Toggle Button */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className={`absolute top-4 right-4 p-2 rounded-full ${theme === "light" ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Phone */}
          <div className="flex flex-col items-center text-center p-6 bg-white shadow-lg rounded-xl hover:shadow-2xl transition duration-300">
            <FaPhoneAlt className="text-4xl text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Phone</h3>
            <p className="text-lg text-gray-600">+91 9771401026</p>
          </div>

          {/* Email */}
          <div className="flex flex-col items-center text-center p-6 bg-white shadow-lg rounded-xl hover:shadow-2xl transition duration-300">
            <FaEnvelope className="text-4xl text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Email</h3>
            <p className="text-lg text-gray-600">svm.singh.01@gmail.com</p>
          </div>

          {/* Address */}
          <div className="flex flex-col items-center text-center p-6 bg-white shadow-lg rounded-xl hover:shadow-2xl transition duration-300">
            <FaMapMarkerAlt className="text-4xl text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Address</h3>
            <p className="text-lg text-gray-600 text-center">
              Brigade Meadows, Kanakpura Road, Bangalore, India
            </p>
          </div>
        </div>


        {/* Contact Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col">
              <label htmlFor="name" className="mb-2">Your Name</label>
              <input
                type="text"
                name="name"
                id="name"
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-2">Your Email</label>
              <input
                type="email"
                name="email"
                id="email"
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex flex-col mb-6">
            <label htmlFor="message" className="mb-2">Your Message</label>
            <textarea
              name="message"
              id="message"
              rows="6"
              className="border text-black border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Send Message
          </button>
        </form>

        {/* Social Media Links */}
        <div className="mt-8 flex justify-center space-x-6">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
            <FaFacebook size={24} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
            <FaTwitter size={24} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
            <FaInstagram size={24} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
