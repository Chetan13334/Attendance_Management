import React from "react";
import CalendarUI from "./Calendar.ui";
import { useCalendarData } from "./useCalendarData";
import SkeletonLoader from "../../common/skeleton/SkeletonLoader";

const CalendarContainer = () => {
  const data = useCalendarData();

  // Show skeleton when loading (during initial load/refresh)
  if (!data || data.loading) {
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
    isNextWeekDisabled,   // <-- ADD THIS LINE
} = data;


  const formattedStudentsWithInitials = formattedStudents; // Already formatted in the hook

  if (formattedStudentsWithInitials && !formattedStudentsWithInitials.length) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-gray-500 text-sm">
        Oops ! No employee data found.
      </div>
    );
  }

  if (!daysOfWeek?.length) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-gray-500 text-sm">
        Loading week view...
      </div>
    );
  }

  return (
    <CalendarUI
      selectedStudents={selectedStudents || {}}
      attendance={attendance || {}}
      currentWeekStart={currentWeekStart}
      daysOfWeek={daysOfWeek}
      formattedStudents={formattedStudentsWithInitials}
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