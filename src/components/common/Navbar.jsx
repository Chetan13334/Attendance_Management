import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react'; 
import logomain from '../assets/pfizer.png';
import UserProfileCard from './UserProfile'; // Import the UserProfile component
import { auth } from '../../firebase'; // Import auth from firebase
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged

const Navbar = ({ toggleSidebar, handleSignOut, setIsProfileOpenState }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [user, setUser] = useState(null); // State to hold user data

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
    
    // Function to handle profile open/close
    const toggleProfile = () => {
        const newState = !isProfileOpen;
        setIsProfileOpen(newState);
        // Pass the state to parent if callback is provided
        if (setIsProfileOpenState) {
            setIsProfileOpenState(newState);
        }
    };
    
    // Function to close profile
    const closeProfile = () => {
        setIsProfileOpen(false);
        if (setIsProfileOpenState) {
            setIsProfileOpenState(false);
        }
    };
    
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
                    
                
                    
                   
                    <div className="relative">
                        <button
                            className="flex items-center space-x-1 sm:space-x-3 p-1 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-250 transition focus:outline-none"
                            onClick={toggleProfile}
                        >
                            <div className="w-8 h-8 sm:w-9 sm:h-9">
                                
                                <img 
                                    src={user?.photoUrl }
                                    alt="User Avatar" 
                                    className="w-full h-full rounded-full object-cover" 
                                    onError={(e) => { 
                                        e.target.onerror = null; 
                                        e.target.src = "https://i.pravatar.cc/150?img=68"; 
                                    }}
                                />
                            </div>
                            
                            <div className="hidden sm:block pr-1 text-right">
                                {/* Show user's name or default */}
                                <div className="text-sm font-semibold text-gray-800">
                                    {user?.name || "Guest User"}
                                </div>
                                <div className="text-xs text-gray-500">Employee</div>
                            </div>
                            
                            
                        </button>
                        
                        {/* Profile Popup */}
                        {isProfileOpen && (
                            <div className="fixed inset-0 z-50 flex">
                                {/* Backdrop with blur */}
                                <div 
                                    className="fixed inset-0  bg-opacity-50 backdrop-blur-[1px]"
                                    onClick={closeProfile}
                                ></div>
                                
                                {/* Profile Card on the left side */}
                                <div className="relative z-50 ml-0 mt-16 lg:mt-0 lg:ml-64 transition-all duration-300 ease-in-out">
                                    <UserProfileCard 
                                        onClose={closeProfile} 
                                        handleSignOut={handleSignOut} 
                                    />
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