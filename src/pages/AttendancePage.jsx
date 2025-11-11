import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// ✅ Import Redux thunks instead of Firebase directly
import { listenToEmployees } from "../redux/slices/employeeSlice";
import { listenToEvents } from "../redux/slices/eventSlice";
import { signOutUser } from "../redux/slices/authSlice";

import Sidebar from "../components/common/Sidebar.jsx";
import Navbar from "../components/common/Navbar.jsx";
import AttendanceTable from "../components/dashboard/AttendanceTable.jsx";
import Statsoverview from "../components/dashboard/Statsoverview.jsx";
import EventsListContent from "../components/common/EventListContent.jsx";

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showEvents, setShowEvents] = useState(false); // Toggle between Attendance and Events

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const eventCount = useSelector((state) => state.events.list.length); // ✅ pulled from Redux

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const setProfileOpenState = (state) => setIsProfileOpen(state);

  /* ───────────────────────────── */
  /* 🔁 Fetch Data from Redux     */
  /* ───────────────────────────── */
  useEffect(() => {
    if (!user) {
      navigate("/signin", { replace: true });
      return;
    }

    // ✅ Fetch data using Redux thunks
    dispatch(listenToEmployees());
    dispatch(listenToEvents());
  }, [user, navigate, dispatch]);

  /* ───────────────────────────── */
  /* 🚪 Logout (via Redux)        */
  /* ───────────────────────────── */
  const handleSignOut = async () => {
    await dispatch(signOutUser());
    navigate("/signin");
  };

  if (!user) return null;

  /* ───────────────────────────── */
  /* 🧭 Render                     */
  /* ───────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        handleSignOut={handleSignOut}
        isProfileOpen={isProfileOpen}
      />

      {/* Main Layout */}
      <div className="flex-1 lg:ml-64">
        <Navbar
          toggleSidebar={toggleSidebar}
          handleSignOut={handleSignOut}
          setIsProfileOpenState={setProfileOpenState}
        />

        <main className="pt-20 px-4 sm:px-6 pb-8 transition-all duration-300">
          {/* 📊 Stats Overview */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            {/* ✅ Pass eventCount as prop (optional, if Statsoverview uses Redux already then fine) */}
            <Statsoverview
              onEventsClick={() => setShowEvents(true)}
              eventCount={eventCount}
            />
          </div>

          {/* 🗓️ Below Section (Attendance ↔ Events) */}
          <div className="mt-4 transition-all duration-500">
            {!showEvents ? (
              <div className="bg-white p-6 rounded-lg shadow transition-all duration-500">
                <AttendanceTable />
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow transition-all duration-700 ease-in-out">
                <EventsListContent
                  isModal={false}
                  onClose={() => setShowEvents(false)}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
