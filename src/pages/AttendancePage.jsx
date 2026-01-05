// src/pages/AttendancePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOutUser } from "../redux/slices/authSlice";

import Sidebar from "../components/common/Sidebar.jsx";
import Navbar from "../components/common/navbar/Navbar.jsx";
import MainContent from "../components/dashboard/main/MainContent.jsx";

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Note: ProtectedRoute handles the main redirect. 
  // We keep the local check just for safety but without the useEffect trigger 
  // to avoid conflicting with the Router's own logic.

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleSignOut = () => {
    dispatch(signOutUser());
    navigate("/signin");
  };

  if (!isAuthenticated || !user) {
    console.log("DashboardPage: Not authenticated, showing loader...");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <div className="text-gray-600">Checking authorization...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        handleSignOut={handleSignOut}
      />

      <div className="flex-1 lg:ml-64">
        <Navbar toggleSidebar={toggleSidebar} handleSignOut={handleSignOut} />

        <main className="pt-20 px-0 sm:px-0 pb-0">
          <MainContent />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;