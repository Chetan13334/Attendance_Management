// src/pages/AttendancePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOutUser } from "../redux/slices/authSlice"; // ✅ Redux logout

import Sidebar from "../components/common/Sidebar.jsx";
import Navbar from "../components/common/navbar/Navbar.jsx";
import MainContent from "../components/dashboard/main/MainContent.jsx";

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // 🚫 Redirect to signin if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/signin", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleSignOut = () => {
    dispatch(signOutUser());
    navigate("/signin");
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        handleSignOut={handleSignOut}
      />

      {/* Main content wrapper */}
      <div className="flex-1 lg:ml-64">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} handleSignOut={handleSignOut} />

        {/* Dashboard Content */}
        <main className="pt-20 px-4 sm:px-6 pb-8">
          <MainContent />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;