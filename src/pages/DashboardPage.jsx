import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

import Sidebar from "../components/common/Sidebar.jsx";
import Navbar from "../components/common/Navbar.jsx";

import AttendanceTable from "../components/dashboard/AttendanceTable.jsx";
import Statsoverview from "../components/dashboard/Statsoverview.jsx";


const MOCK_USER = { uid: "mock-user-123", email: "test@user.com" };

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
        <div className="text-gray-600">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      
      <aside className="bg-gray-800 text-white w-64 fixed top-0 left-0 h-screen z-30 hidden lg:block">
        <Sidebar />
      </aside>

      
      <div className="flex-1 flex flex-col lg:ml-64">
       
        <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 z-20 bg-indigo-600 text-white shadow-lg flex items-center px-4">
          <Navbar />
        </header>

        
        <main className="pt-20 px-4 sm:px-6">

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
