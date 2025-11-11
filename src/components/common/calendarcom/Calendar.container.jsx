import React from "react";
import CalendarUI from "./Calendar.ui";
import { useCalendarData } from "./useCalendarData";

const CalendarContainer = () => {
  const calendarData = useCalendarData();

  return <CalendarUI {...calendarData} />;
};

export default CalendarContainer;