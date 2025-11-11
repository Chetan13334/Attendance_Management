import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../redux/slices/authSlice";

export const useNavbarData = ({ toggleSidebar, handleSignOut, setIsProfileOpenState }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Get user from Redux
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleClear = () => setSearchValue('');
  const handleChange = (e) => setSearchValue(e.target.value);

  const toggleProfile = () => {
    const newState = !isProfileOpen;
    setIsProfileOpen(newState);
    setIsProfileOpenState?.(newState);
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
    setIsProfileOpenState?.(false);
  };

  // Use Redux logout (your existing one)
  const handleReduxSignOut = () => {
    dispatch(logout());
    handleSignOut?.(); // Keep parent callback if needed
    closeProfile();
  };

  // Handle clicks outside the profile dropdown
  const handleClickOutside = (e) => {
    if (isProfileOpen && !e.target.closest('.profile-dropdown')) {
      closeProfile();
    }
  };

  // Add event listener for clicks outside
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isProfileOpen]);

  return {
    // State
    isProfileOpen,
    searchValue,
    user,
    
    // Functions
    setIsProfileOpen,
    setSearchValue,
    handleClear,
    handleChange,
    toggleProfile,
    closeProfile,
    handleReduxSignOut,
    toggleSidebar,
  };
};