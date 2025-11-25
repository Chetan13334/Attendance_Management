import React from "react";
import { X, LogOut } from 'lucide-react';
import logomain from '../../assets/pfizer.png';

const NavbarUI = ({
  // State
  isProfileOpen,
  searchValue,
  user,
  
  // Functions
  handleClear,
  handleChange,
  toggleProfile,
  closeProfile,
  handleReduxSignOut,
  toggleSidebar,
}) => {
  return (
    <nav className="w-full bg-white shadow-sm fixed top-0 left-0 right-0 z-40 lg:pl-64">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        
        {/* Mobile Menu */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 mr-2"
          aria-label="Toggle sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Logo */}
        <div className="flex-shrink-0 mr-4 sm:mr-8">
          <h2 className="text-sm lg:text-lg font-bold text-gray-800">
            <img src={logomain} alt="Pfizer" className="w-8 h-8 inline-block" />
          </h2>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xs sm:max-w-md lg:mx-auto">
          <div className="relative">
            
            <input
              type="search"
              placeholder="Search here..."
              value={searchValue}
              onChange={handleChange}
              className="w-full pl-12 pr-4 sm:pr-16 py-3 text-sm bg-gray-100 rounded-full border border-gray-100 focus:outline-none focus:ring-indigo-300 focus:border-indigo-300 transition duration-150 text-gray-800"
            />
            {searchValue && (
              <button
                onClick={handleClear}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700"
              >
                {/* <X className="w-4 h-4" /> */}
              </button>
            )}
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-4 ml-2">
          <div className="relative profile-dropdown">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleProfile();
              }}
              className="flex items-center space-x-3 p-1 bg-gray-100 rounded-full hover:bg-gray-200 transition"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9">
                <img
                  src={user?.photoUrl || user?.photo || 'https://i.pravatar.cc/150?img=68'}
                  alt="User"
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://i.pravatar.cc/150?img=68';
                  }}
                />
              </div>
              <div className="hidden sm:block text-center">
                <div className="text-sm font-semibold text-gray-800">
                  { user?.email?.split('@')[0] || 'Guest User'}
                </div>
                <div className="text-xs text-gray-500">HR</div>
              </div>
            </button>

            {/* Profile Popup - Small dropdown below profile icon */}
            {isProfileOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                <a 
                  href="#" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={(e) => {
                    e.preventDefault();
                    // Dummy view profile action
                    console.log("View Profile clicked");
                    closeProfile();
                  }}
                >
                  View Profile
                </a>
                <button
                  onClick={handleReduxSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarUI;