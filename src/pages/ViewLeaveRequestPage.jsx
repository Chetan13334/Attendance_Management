import React, { useState } from "react";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/navbar/Navbar";
import ViewLeaveRequestContainer from "../components/dashboard/Leave_Request/View_Request/ViewLeaveRequest.container";

const ViewLeaveRequestPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 lg:ml-64">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="pt-20 px-4 pb-10">
          <ViewLeaveRequestContainer />
        </main>
      </div>
    </div>
  );
};

export default ViewLeaveRequestPage;
