import React, { useState, useRef, useEffect } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Mail, User, LogOut, Camera } from "lucide-react";

const UserProfileCard = ({ onClose, handleSignOut }) => {
  const [user, setUser] = useState({
    name: "Loading...",
    email: "Loading...",
    photoUrl: "https://placehold.co/120x120/4F46E5/ffffff?text=U",
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          name:
            currentUser.displayName ||
            currentUser.email.split("@")[0] ||
            "User",
          email: currentUser.email || "No email provided",
          photoUrl:
            currentUser.photoURL ||
            "https://placehold.co/120x120/4F46E5/ffffff?text=U",
        });
      } else {
        setUser({
          name: "Guest",
          email: "Not logged in",
          photoUrl: "https://placehold.co/120x120/4F46E5/ffffff?text=G",
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    if (handleSignOut) handleSignOut();
    if (onClose) onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (user.photoUrl.startsWith("blob:")) {
        URL.revokeObjectURL(user.photoUrl);
      }
      const newPhotoUrl = URL.createObjectURL(file);
      setUser((prev) => ({
        ...prev,
        photoUrl: newPhotoUrl,
      }));
    }
  };

  return (
    <div className="w-80 max-w-sm mx-auto p-4 sm:p-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
        {/* Header Section */}
        <div className="h-28 bg-gradient-to-r from-indigo-600 to-blue-500 relative flex items-center justify-center">
          <div className="absolute -bottom-10">
            <div className="relative group">
              <img
                src={user.photoUrl}
                alt="Profile"
                className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md transition-all duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/128x128/4F46E5/ffffff?text=U";
                }}
              />
              {/* Camera Button */}
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-1 right-1 p-2 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition-all opacity-0 group-hover:opacity-100"
                title="Change Profile Picture"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="pt-16 pb-6 px-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
          <p className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-1">
            <Mail className="w-4 h-4 text-indigo-500" />
            {user.email}
          </p>

          {/* Divider */}
          <div className="w-16 h-0.5 bg-indigo-300 mx-auto my-6 rounded-full" />

          {/* Account Info */}
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100 shadow-sm">
            <div className="p-2 bg-indigo-500 text-white rounded-full">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-medium text-indigo-800 uppercase tracking-wide">
                Account Type
              </p>
              <p className="text-sm font-semibold text-indigo-900">
                Member
              </p>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white font-semibold rounded-xl shadow-lg mt-8 hover:bg-red-600 transition-all active:scale-[0.98]"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
