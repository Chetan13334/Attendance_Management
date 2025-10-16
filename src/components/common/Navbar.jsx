import React, { useState } from 'react';
import { X } from 'lucide-react'; 

const Navbar = ({ toggleSidebar, handleSignOut }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    const [searchValue, setSearchValue] = useState('');

    
    const handleClear = () => {
        setSearchValue('');
    };

    
    const handleChange = (e) => {
        setSearchValue(e.target.value);
    };
    
    
    return (
        <nav className="w-full bg-white border-b shadow-sm fixed top-0 left-0 right-0 z-40 lg:pl-64">
           
            <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
                
                {/* Mobile menu button */}
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 mr-2"
                    aria-label="Toggle sidebar"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                
                <div className="flex-shrink-0 mr-4 sm:mr-8">
                    
                    <h2 className="text-sm lg:text-lg font-bold text-gray-800">Attendance</h2>
                    
                    <p className="text-[0.6rem] lg:text-xs text-gray-500">Manage and review records</p>
                </div>

                
                <div className="flex-1 max-w-xs sm:max-w-md lg:mx-auto"> 
                    <div className="relative">
                       
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                            🔍
                        </span>
                        <input
                            type="search"
                            placeholder="Search here..."
                            value={searchValue} 
                            onChange={handleChange}
                            
                            style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                            className="w-full pl-12 pr-4 sm:pr-16 py-3 text-sm bg-gray-100 rounded-full border border-gray-100 focus:outline-none focus:ring-indigo-300 focus:border-indigo-300 transition duration-150 text-gray-800"
                        />
                        
                        
                        {searchValue && (
                            <button 
                                onClick={handleClear}
                               
                                className="flex absolute inset-y-0 right-0 items-center pr-4 text-gray-500 hover:text-gray-700 transition duration-150"
                                title="Clear search"
                            >
                                
                            </button>
                        )}
                    </div>
                </div>

                
                <div className="flex items-center space-x-2 sm:space-x-4 ml-2 flex-shrink-0">
                    
                    
                    <button className="p-2 sm:p-3 rounded-full bg-gray-100 hover:bg-gray-200">
                        🔔
                    </button>
                    
                   
                    <div className="relative">
                        <button
                            className="flex items-center space-x-1 sm:space-x-3 p-1 bg-gray-50 rounded-full cursor-pointer hover:bg-gray-100 transition focus:outline-none"
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                        >
                            <div className="w-8 h-8 sm:w-9 sm:h-9">
                                
                                <img src="https://i.pravatar.cc/150?img=68" alt="User Avatar" className="w-full h-full rounded-full object-cover" />
                            </div>
                            
                            <div className="hidden sm:block pr-1 text-right">
                                <div className="text-sm font-semibold text-gray-800">Mithun Ray</div>
                                <div className="text-xs text-gray-500">Student</div>
                            </div>
                            
                            <svg 
                                className={`w-4 h-4 text-gray-500 mr-2 transform transition-transform ${isProfileOpen ? 'rotate-180' : 'rotate-0'}`} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                       
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100">
                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">View Profile</a>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Switch Account</a>
                                <hr className="my-0" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
