import React from "react";
import CalendarUI from "./Calendar.ui";
import { useCalendarData } from "./useCalendarData";
import SkeletonLoader from "../../common/skeleton/SkeletonLoader";

const CalendarContainer = () => {
  const data = useCalendarData();

  // Show skeleton when loading (during initial load/refresh)
  if (!data || data.loading) {
    console.log("Showing skeleton loader, loading state:", data?.loading);
    return (
      <div className="p-8 md:p-0 min-h-screen bg-gray-100 font-sans">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full">
          <div className="flex-grow">
            <SkeletonLoader type="calendar" />
          </div>
        </div>
      </div>
    );
  }

  const {
    selectedStudents,
    attendance,
    currentWeekStart,
    daysOfWeek,
    formattedStudents,
    handleCellClick,
    handlePreviousWeek,
    handleNextWeek,
    handleToday,
    handleOpenCalendarModal,
    attendanceStatuses,
    isNextWeekDisabled,
} = data;


  // Ensure we have valid data before rendering the UI
  const safeSelectedStudents = selectedStudents || {};
  const safeAttendance = attendance || {};
  const safeDaysOfWeek = Array.isArray(daysOfWeek) ? daysOfWeek : [];
  const safeFormattedStudents = Array.isArray(formattedStudents) ? formattedStudents : [];
  const safeAttendanceStatuses = attendanceStatuses || {
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
  };

  // Show loader if we don't have employee data yet
  if (safeFormattedStudents.length === 0) {
    console.log("Showing employee data loading message");
    return (
      <div className="p-8 md:p-0 min-h-screen bg-gray-100 font-sans">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full">
          <div className="flex-grow">
            <SkeletonLoader type="calendar" />
          </div>
        </div>
      </div>
    );
  }

  // Show loader if we don't have days data yet
  if (safeDaysOfWeek.length === 0) {
    console.log("Showing week data loading message");
    return (
      <div className="p-8 md:p-0 min-h-screen bg-gray-100 font-sans">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full">
          <div className="flex-grow">
            <SkeletonLoader type="calendar" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <CalendarUI
      selectedStudents={safeSelectedStudents}
      attendance={safeAttendance}
      currentWeekStart={currentWeekStart}
      daysOfWeek={safeDaysOfWeek}
      formattedStudents={safeFormattedStudents}
      handleToggleSelect={() => {}} // Add missing prop
      handleCellClick={handleCellClick}
      handlePreviousWeek={handlePreviousWeek}
      handleNextWeek={handleNextWeek}
      handleToday={handleToday}
      handleOpenCalendarModal={handleOpenCalendarModal}
      attendanceStatuses={attendanceStatuses}
      isNextWeekDisabled={isNextWeekDisabled}
    />
  );
};

export default CalendarContainer;