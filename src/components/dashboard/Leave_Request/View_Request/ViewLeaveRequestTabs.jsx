import React from "react";

const tabs = ["Leave Details", "Review & Action", "Employee History"];

const ViewLeaveRequestTabs = ({ active, setActive }) => {
  return (
    <div className="border-b border-gray-200 flex gap-10 px-6 mt-6">
      {tabs.map((tab, i) => (
        <button
          key={tab}
          onClick={() => setActive(i)}
          className={`pb-3 text-sm font-medium transition ${
            active === i
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default ViewLeaveRequestTabs;
