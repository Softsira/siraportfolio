import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/login"); // Redirect to login page
  };
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-blue-600">PortfolioHub</h1>

        {/* Search Bar */}
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search users..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <a href="/profile" className="text-gray-600 hover:text-blue-600">
            Dashboard
          </a>
          <a href="/explore" className="text-gray-600 hover:text-blue-600">
            Explore
          </a>
          <div className="m-0 w-8 h-8 bg-gray-300 rounded-full" onClick={toggleDropdown}></div>
          {isDropdownOpen && (
            <div className="absolute top-12 right-5 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <a
                href="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-2">👤</span> Profile
              </a>
              <a
                href="/settings"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-2">⚙️</span> Settings
              </a>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-2">↩️</span> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
