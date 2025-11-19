import React from "react";
import CalendarUI from "./CalendarCom.ui";
import { useCalendarData } from "./useCalendarComData";

const CalendarContainer = () => {
  const calendarData = useCalendarData();

  return <CalendarUI {...calendarData} />;
};

export default CalendarContainer;