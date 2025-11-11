import React from "react";
import CalendarUI from "./Calendar.ui";
import { useCalendarData } from "./useCalendarData";

const CalendarContainer = () => {
  const {
    selectedStudents,
    attendance,
    currentWeekStart,
    daysOfWeek,
    formattedStudents,
    handleToggleSelect,
    handleCellClick,
    handlePreviousWeek,
    handleNextWeek,
    handleToday,
    handleOpenCalendarModal,
    attendanceStatuses
  } = useCalendarData();

  return (
    <CalendarUI
      selectedStudents={selectedStudents}
      attendance={attendance}
      currentWeekStart={currentWeekStart}
      daysOfWeek={daysOfWeek}
      formattedStudents={formattedStudents}
      handleToggleSelect={handleToggleSelect}
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