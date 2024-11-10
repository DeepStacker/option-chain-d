import { useState } from 'react';
import { FaHome, FaUser, FaCog, FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import OptionChain from '../pages/OptionChain';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div
                className={`fixed ${isOpen ? 'w-64' : 'w-16'} bg-gray-800 text-white transition-all duration-300 hover:w-64 z-50 mt-16 h-full `}
                onMouseEnter={() => setIsOpen(true)}  // On hover, open the sidebar
                onMouseLeave={() => setIsOpen(false)} // On hover out, collapse the sidebar
            >
                <div className="flex flex-col justify-between h-full w-full">
                    <div>
                        {/* Sidebar Header with Toggle (Hamburger Icon) */}
                        <button
                            className="p-4 focus:outline-none"
                            onClick={toggleSidebar}
                            aria-label="Toggle Sidebar"
                        >
                            <FaBars className="text-xl" />
                        </button>

                        {/* Navigation Links */}
                        <nav className="mt-4 flex flex-col gap-4">
                            <Link to='/'>
                                <NavItem icon={<FaHome />} label="Home" isOpen={isOpen} />
                            </Link>
                            <NavItem icon={<FaUser />} label="Profile" isOpen={isOpen} />
                            <NavItem icon={<FaCog />} label="Settings" isOpen={isOpen} />
                        </nav>
                    </div>

                    {/* Footer */}
                    {isOpen && (
                        <div className="p-4 mt-auto">
                            <p className="text-sm">© 2024 Your Company</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className={`flex-1 ${isOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
                {/* Your Main Content */}
                <OptionChain />
            </div>
        </div>
    );
};

const NavItem = ({ icon, label, isOpen }) => (
    <div className="flex items-center gap-4 p-2 hover:bg-gray-700 rounded-md cursor-pointer">
        <span className="text-lg">{icon}</span>
        {isOpen && <span>{label}</span>} {/* Show label when sidebar is open */}
    </div>
);

export default Sidebar;
