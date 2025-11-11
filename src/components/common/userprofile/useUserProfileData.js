import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../redux/slices/authSlice";

export const useUserProfileData = ({ onClose, handleSignOut }) => {
  const [localPhotoUrl, setLocalPhotoUrl] = useState(null);
  const fileInputRef = useRef(null);

  // Get user from Redux
  const user = useSelector((state) => state.auth.user) || {
    name: "Guest",
    email: "Not logged in",
    photoUrl: "https://placehold.co/120x120/4F46E5/ffffff?text=G",
  };

  const dispatch = useDispatch();

  const displayPhoto = localPhotoUrl || user.photoUrl || "https://placehold.co/120x120/4F46E5/ffffff?text=U";
  const displayName = user.name || user.email?.split("@")[0] || "Guest";
  const displayEmail = user.email || "No email provided";

  const handleLogout = () => {
    dispatch(logout());           // Redux logout
    handleSignOut?.();            // Keep parent callback
    onClose?.();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (localPhotoUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(localPhotoUrl);
      }
      const newPhotoUrl = URL.createObjectURL(file);
      setLocalPhotoUrl(newPhotoUrl);
    }
  };

  return {
    // State
    localPhotoUrl,
    fileInputRef,
    user,
    displayPhoto,
    displayName,
    displayEmail,
    
    // Functions
    setLocalPhotoUrl,
    handleLogout,
    handleFileChange,
  };
};