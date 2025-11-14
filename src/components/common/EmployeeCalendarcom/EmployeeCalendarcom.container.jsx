import React from "react";
import EmployeeCalendarCom from "./EmployeeCalendarcom";
import { useCalendarData } from "./useCalendarData";

const EmployeeCalendarComContainer = ({ employeeId }) => {
  const calendarData = useCalendarData(employeeId);

  return <EmployeeCalendarCom 
    {...calendarData} 
    employeeId={employeeId} 
    employeeAttendance={calendarData.employeeAttendance}
    loading={calendarData.loading}
  />;
};

export default EmployeeCalendarComContainer;