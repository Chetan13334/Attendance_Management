import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase.js";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { useDispatch } from "react-redux";

import Sidebar from "../components/common/Sidebar.jsx";
import Navbar from "../components/common/Navbar.jsx";

import AttendanceTable from "../components/dashboard/AttendanceTable.jsx";
import Statsoverview from "../components/dashboard/Statsoverview.jsx";
import { setEmployees } from "../redux/slices/employeeSlice.js";
import { UserCheck, UserX, Clock, Calendar } from 'lucide-react';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [eventCount, setEventCount] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const setProfileOpenState = (state) => {
    setIsProfileOpen(state);
  };

  useEffect(() => {
    // Check auth state
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/signin");
      }
    });

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

    // Fetch employee data from Firebase
    const unsubscribeEmployees = onSnapshot(
      collection(db, "Employee_Details"),
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        dispatch(setEmployees(list));
      },
      (error) => {
        console.error("Error fetching employee details:", error);
      }
    );

    // Cleanup subscriptions
    return () => {
      unsubscribeAuth();
      unsubscribeEmployees();
    };
  }, [navigate, dispatch]);

  const handleSignOut = () => {
    signOut(auth);
    navigate("/signin");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} handleSignOut={handleSignOut} isProfileOpen={isProfileOpen} />

      {/* Main content wrapper */}
      <div className="flex-1 lg:ml-64">
       
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} handleSignOut={handleSignOut} setIsProfileOpenState={setProfileOpenState} />

        
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