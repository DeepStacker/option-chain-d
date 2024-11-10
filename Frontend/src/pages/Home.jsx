import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const theme = useSelector((state) => state.theme.theme);
  const title = 'Stockify';

  useEffect(() => {
    document.title = `${title} | Home`;
  }, []);

  return (
    <div className={theme === 'dark' ? 'bg-gray-900' : 'bg-white'}>
      {/* Hero Section */}
      <section
        className="bg-cover bg-center h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1705635847741-d38022d08d93?q=80&w=1856&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`
        }}>
        <div className={`text-center transition ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          <h1 className="text-5xl font-bold mb-4">Welcome to {title}</h1>
          <p className="text-xl mb-8">Manage your investments smartly with real-time data.</p>
          <Link to="/advanced-option-chain"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-700 rounded text-white text-lg">
            Explore Option Chain
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className={`py-16 transition ${theme === 'dark' ? 'bg-gray-800 text-white' : "bg-gray-50 text-gray-800"} text-center`}>
        <h2 className="text-4xl font-bold mb-10">Our Services</h2>
        <div id='services' className="flex justify-center cursor-pointer space-x-6">
          <div className={`w-1/4 p-6 rounded shadow hover:shadow-lg transition ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
            <i className="fas fa-chart-line text-5xl text-blue-500 mb-4"></i>
            <h3 className="text-2xl font-semibold mb-2">Option Chain</h3>
            <p>Get real-time option chain data for smart trading decisions.</p>
          </div>
          <div className={`w-1/4 p-6 rounded shadow hover:shadow-lg transition ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
            <i className="fas fa-briefcase text-5xl text-green-500 mb-4"></i>
            <h3 className="text-2xl font-semibold mb-2">Portfolio Management</h3>
            <p>Manage your investments with advanced analytics and insights.</p>
          </div>
          <div className={`w-1/4 p-6 rounded shadow hover:shadow-lg transition ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
            <i className="fas fa-shield-alt text-5xl text-red-500 mb-4"></i>
            <h3 className="text-2xl font-semibold mb-2">Risk Management</h3>
            <p>Monitor risks and safeguard your financial portfolio.</p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className={`py-16 transition ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} text-center`}>
        <h2 className="text-4xl font-bold mb-10">Our Expertise</h2>
        <div className="flex justify-center space-x-8">
          <div className="w-1/5">
            <h3 className="text-xl font-semibold">Python</h3>
            <div className="w-full bg-gray-300 rounded h-6">
              <div className="bg-blue-500 h-6 rounded" style={{ width: '90%' }}></div>
            </div>
          </div>
          <div className="w-1/5">
            <h3 className="text-xl font-semibold">JavaScript</h3>
            <div className="w-full bg-gray-300 rounded h-6">
              <div className="bg-yellow-500 h-6 rounded" style={{ width: '80%' }}></div>
            </div>
          </div>
          <div className="w-1/5">
            <h3 className="text-xl font-semibold">MySQL</h3>
            <div className="w-full bg-gray-300 rounded h-6">
              <div className="bg-green-500 h-6 rounded" style={{ width: '70%' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`py-16 transition ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-800'} text-center`}>
        <h2 className="text-4xl font-bold mb-10">Contact Us</h2>
        <form className="max-w-lg mx-auto">
          <div className="mb-4">
            <input type="text" placeholder="Name"
              className={`w-full p-3 rounded transition ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} placeholder-gray-500`} required />
          </div>
          <div className="mb-4">
            <input type="email" placeholder="Email"
              className={`w-full p-3 rounded transition ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} placeholder-gray-500`} required />
          </div>
          <div className="mb-4">
            <textarea placeholder="Message" rows="4"
              className={`w-full p-3 rounded transition ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} placeholder-gray-500`} required></textarea>
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-700 rounded text-white"
          >
            Send Message
          </button>
        </form>
      </section>
    </div>
  );
};

export default Home;
