import React from "react";
import CalendarUI from "./Calendar.ui";
import { useCalendarData } from "./useCalendarData";

const CalendarContainer = () => {
  const data = useCalendarData();

  if (!data || data.loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-gray-500 text-sm">
        Loading calendar data...
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
  } = data;

  const formattedStudentsWithInitials = formattedStudents; // Already formatted in the hook

  if (!formattedStudentsWithInitials?.length) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-gray-500 text-sm">
        No employee data found.
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
    />
  );
};

export default CalendarContainer;