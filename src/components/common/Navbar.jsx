import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react'; 
import logomain from '../assets/pfizer.png';
import { auth } from '../../firebase'; // Import auth from firebase
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged

const Navbar = ({ toggleSidebar, handleSignOut }) => {
    const [searchValue, setSearchValue] = useState('');
    const [user, setUser] = useState(null); // State to hold user data
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser({
                    name: currentUser.displayName || currentUser.email?.split('@')[0] || "User",
                    email: currentUser.email || "No email",
                    photoUrl: currentUser.photoURL || "https://i.pravatar.cc/150?img=68"
                });
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleClear = () => {
        setSearchValue('');
    };

    const handleChange = (e) => {
        setSearchValue(e.target.value);
    };
    
    // Toggle dropdown
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDropdownOpen && !event.target.closest('.hs-dropdown')) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isDropdownOpen]);
    
    return (
        <nav className="w-full bg-white shadow-sm fixed top-0 left-0 right-0 z-40 lg:pl-64">
           
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
                    
                    <h2 className="text-sm lg:text-lg font-bold text-gray-800"><img src={logomain} alt=",mainlogo" className='w-8 h-8' />
                    </h2>
                    
                    {/* <p className="text-[0.6rem] lg:text-xs text-gray-500">Manage and review records</p> */ }
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
                    
                    {/* Dropdown menu */}
                    <div className="hs-dropdown relative inline-flex">
                        <button 
                            id="hs-dropdown-custom-trigger" 
                            type="button" 
                            className="hs-dropdown-toggle py-1 ps-1 pe-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                            aria-haspopup="menu" 
                            aria-expanded={isDropdownOpen} 
                            aria-label="Dropdown"
                            onClick={toggleDropdown}
                        >
                            <img 
                                className="w-8 h-auto rounded-full" 
                                src={user?.photoUrl || "https://i.pravatar.cc/150?img=68"} 
                                alt="Avatar"
                                onError={(e) => { 
                                    e.target.onerror = null; 
                                    e.target.src = "https://i.pravatar.cc/150?img=68"; 
                                }}
                            />
                            <span className="text-gray-600 font-medium truncate max-w-30">
                                {user?.name || "Guest User"}
                            </span>
                            <svg className={`hs-dropdown-open:rotate-180 size-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m6 9 6 6 6-6"/>
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <div 
                                className="hs-dropdown-menu transition-[opacity,margin] duration-300 hs-dropdown-open:opacity-100 opacity-100 min-w-30 bg-white shadow-lg rounded-lg mt-2 absolute right-0 z-50 border border-gray-200"
                                role="menu" 
                                aria-orientation="vertical" 
                                aria-labelledby="hs-dropdown-custom-trigger"
                                style={{ top: '100%', marginTop: '0.5rem' }}
                            >
                                <div className="p-1 space-y-0.5">
                                    <button
                                        className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 w-full text-left transition-colors duration-200"
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            handleSignOut();
                                        }}
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;