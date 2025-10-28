import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase.js";
import { signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

import Sidebar from "../components/common/Sidebar.jsx";
import Navbar from "../components/common/Navbar.jsx";

import MainDashbord from "../components/dashboard/AttendanceTable.jsx";
import Statsoverview from "../components/dashboard/Statsoverview.jsx";
import { UserCheck, UserX, Clock, Calendar } from 'lucide-react';
import AttendanceTable from "../components/dashboard/AttendanceTable.jsx";


const MOCK_USER = { uid: "mock-user-123", email: "test@user.com" };

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [eventCount, setEventCount] = useState(0);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // Fetch event count from Firebase
    const fetchEventCount = async () => {
      try {
        const eventsRef = collection(db, 'Events');
        const snapshot = await getDocs(eventsRef);
        setEventCount(snapshot.size);
      } catch (error) {
        console.error('Error fetching event count:', error);
        setEventCount(0);
      }
    };

    fetchEventCount();
    
    setTimeout(() => {
      setUser(MOCK_USER);
    }, 500);
  }, []);

  const handleSignOut = () => {
    console.log("Mock sign out successful.");
    signOut(auth);
    navigate("/signin");
  };

 
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
            <Statsoverview stats={[
              { title: "Active Users", value: 1200, icon: UserCheck, color: "green" },
              { title: "Inactive Users", value: 80, icon: UserX, color: "red" },
              { title: "Clocked Hours", value: 56, icon: Clock, color: "blue" },
              { title: "Events", value: eventCount, icon: Calendar, color: "yellow" },
            ]} />
          </div>
          <div className="mt-4">
            <AttendanceTable />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
