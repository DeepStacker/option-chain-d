import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa';

const Footer = () => {
  const theme = useSelector((state) => state.theme.theme);

  return (
    <footer
      className={`py-10 mt-10 text-center transition-all duration-300 ${
        theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              About Us
            </h2>
            <p className="mt-3 text-sm leading-relaxed">
              We are a dedicated team of developers, passionate about creating impactful applications
              for web and mobile platforms. Join our journey and follow us to stay updated with our latest projects!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Quick Links
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/about" className="hover:underline">About Us</Link></li>
              <li><Link to="/advanced-option-chain" className="hover:underline">Services</Link></li>
              <li><Link to="/blog" className="hover:underline">Blog</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Connect with Us
            </h2>
            <div className="flex justify-center mt-4 space-x-5">
              <a href="https://facebook.com" className="hover:text-blue-500" aria-label="Facebook">
                <FaFacebook size={26} />
              </a>
              <a href="https://twitter.com" className="hover:text-blue-400" aria-label="Twitter">
                <FaTwitter size={26} />
              </a>
              <a href="https://instagram.com" className="hover:text-pink-500" aria-label="Instagram">
                <FaInstagram size={26} />
              </a>
              <a href="https://github.com/SHIVAM9771" className="hover:text-gray-500" aria-label="GitHub">
                <FaGithub size={26} />
              </a>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Join Our Newsletter
            </h2>
            <p className="mt-3 text-sm">
              Stay updated with the latest news, articles, and resources, delivered directly to your inbox.
            </p>
            <form className="mt-4 flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className={`px-3 py-2 rounded ${
                  theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'
                } focus:outline-none border border-gray-300`}
              />
              <button className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-500 transition">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider and Footer Bottom */}
        <div className={`mt-10 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} pt-6`}>
          <p>&copy; {new Date().getFullYear()} Stockify. All rights reserved.</p>
          <p className="text-xs mt-1">
            Designed with ♥ by Shivam kumar. Made for professionals and creatives.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
