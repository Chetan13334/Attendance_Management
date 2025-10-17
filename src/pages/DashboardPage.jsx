import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase.js";
import { signOut } from "firebase/auth";

import Sidebar from "../components/common/Sidebar.jsx";
import Navbar from "../components/common/Navbar.jsx";

import AttendanceTable from "../components/dashboard/AttendanceTable.jsx";
import Statsoverview from "../components/dashboard/Statsoverview.jsx";


const MOCK_USER = { uid: "mock-user-123", email: "test@user.com" };

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
   
    setTimeout(() => {
      setUser(MOCK_USER);
    }, 500);
  }, []);

  const handleSignOut = () => {
    console.log("Mock sign out successful.");
    signOut(auth);
    navigate("/signin");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600">Loading Attendance...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} handleSignOut={handleSignOut} />

      {/* Main content wrapper */}
      <div className="flex-1 lg:ml-64">
       
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} handleSignOut={handleSignOut} />

        
        <main className="pt-20 px-4 sm:px-6 pb-8">

          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <Statsoverview />
          </div>
          <div className="mt-4 bg-white p-6 rounded-lg shadow">
            <AttendanceTable />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
