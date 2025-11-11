import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOutUser } from "../redux/slices/authSlice"; // ✅ Redux logout

import Sidebar from "../components/common/Sidebar.jsx";
import Navbar from "../components/common/Navbar.jsx";
import Employee_Details from "../components/dashboard/Employee_Details.jsx";

const EmployeeDetailsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // 🚫 Redirect to SignIn if user not authenticated
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

        <main className="pt-20 px-4 sm:px-6 pb-8">
          <div>
            <Employee_Details />
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeDetailsPage;
