import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOutUser } from "../redux/slices/authSlice"; // ✅ Redux logout

import Sidebar from "../components/common/Sidebar.jsx";
import Navbar from "../components/common/navbar/Navbar.jsx";
import EditEmployee from "../components/dashboard/editEmployee/EditEmployee.jsx";

const EditEmployeePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleSignOut = () => {
    dispatch(signOutUser());
    navigate("/signin");
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600">Loading Employee Edit...</div>
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

        {/* Edit Employee Content */}
        <main className="pt-20 px-0 sm:px-0 pb-0">
          <EditEmployee employeeId={id} />
        </main>
      </div>
    </div>
  );
};

export default EditEmployeePage;