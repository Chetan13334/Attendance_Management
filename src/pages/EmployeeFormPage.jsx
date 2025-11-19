import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOutUser } from "../redux/slices/authSlice"; // ✅ Redux logout

import Sidebar from "../components/common/Sidebar.jsx";
import Navbar from "../components/common/navbar/Navbar.jsx";
import EmployeeForm from "../components/dashboard/employee/EmployeeForm.jsx";

const EmployeeFormPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleSignOut = () => {
    dispatch(signOutUser());
    navigate("/signin");
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-gray-600">Loading Employee Form...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  flex">
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

        {/* Employee Form Content */}
        <main className="pt-20 px-0 sm:px-0 pb-0">
          <EmployeeForm />
        </main>
      </div>
    </div>
  );
};

export default EmployeeFormPage;