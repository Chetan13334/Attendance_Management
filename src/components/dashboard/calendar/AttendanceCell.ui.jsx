import React from "react";

const AttendanceCellUI = ({
  statusKey = "absent",
  date,
  studentId,
  isHoliday,
  isFuture,
  holidayDetail,
  onClick,
  attendanceStatuses = {
    "on-time": {
      label: "On time",
      classes: "bg-green-50 text-green-800 border-l-4 border-l-green-500", 
    },
    late: {
      label: "Late",
      classes: "bg-yellow-50 text-yellow-800 border-l-4 border-l-yellow-400",
    },
    absent: {
      label: "Absent",
      classes: "bg-red-50 text-red-800 border-l-4 border-l-red-500",
    },
  }
}) => {
  // Handle loading state
  if (statusKey === "loading") {
    return (
      <div className="flex flex-col justify-center items-center p-0 text-xs font-medium h-full border-r border-gray-100 bg-gray-50">
        <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse"></div>
      </div>
    );
  }

  // Handle undefined attendanceStatuses - fallback to absent
  const status = (attendanceStatuses && attendanceStatuses[statusKey]) || 
                (attendanceStatuses && attendanceStatuses["absent"]) || 
                { label: "Absent", classes: "bg-red-50 text-red-800 border-l-4 border-l-red-500" };

  if (isFuture) {
    return (
      <div className="flex flex-col justify-center items-center p-0 text-xs font-medium h-full border-r border-gray-100 bg-gray-50">
        <span className="text-gray-400 text-lg">----</span>
      </div>
    );
  }

  if (isHoliday) {
    return (
      <div className="flex flex-col justify-center items-center p-0 text-xs font-medium h-full border-r border-gray-100 bg-gray-100 text-gray-500">
        <span className="leading-tight font-semibold">Holiday</span>
        {holidayDetail && (
          <span className="text-[10px] font-normal mt-0.5">({holidayDetail})</span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`
        flex flex-col justify-center items-center p-0 text-xs font-medium h-full
        border-r border-gray-100 transition duration-100 ease-in-out
        ${status.classes || "bg-red-50 text-red-800 border-l-4 border-l-red-500"}
      `}
      
    >
      <span className="leading-tight">{status.label || "Absent"}</span>
      {status.detail && (
        <span className="text-[10px] font-normal mt-0.5 text-gray-500">{status.detail}</span>
      )}
    </div>
  );
};

export default AttendanceCellUI;