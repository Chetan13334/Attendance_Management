import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOutUser } from "../redux/slices/authSlice"; // ✅ Redux sign-out

import Sidebar from "../components/common/Sidebar.jsx";
import Navbar from "../components/common/Navbar.jsx";
import CalenderCom from "../components/common/CalenderCom.jsx";

const CalenderComPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Redirect if not logged in
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

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        handleSignOut={handleSignOut}
      />
      <div className="flex-1 lg:ml-64">
        <Navbar toggleSidebar={toggleSidebar} handleSignOut={handleSignOut} />
        <main className="pt-20 px-4">
          <CalenderCom />
        </main>
      </div>
    </div>
  );
};

export default CalenderComPage;
