import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

import Sidebar from "../components/common/Sidebar.jsx";
import Navbar from "../components/common/Navbar.jsx";
import ReportForm from "../components/common/ReportCom.jsx";

const ReportPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} handleSignOut={handleSignOut} />

      {/* Main content wrapper */}
      <div className="flex-1 lg:ml-64">
       
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} handleSignOut={handleSignOut} />
        
     
        <main className="pt-20">
          <ReportForm />     
        </main>
      </div>
    </div>
  );
};

export default ReportPage;