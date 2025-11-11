import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import AttendanceTableUI from "./AttendanceTable.ui";
import { useAttendanceData, getStatusClasses } from "./useAttendanceData";
import { listenToEmployees } from "../../../redux/slices/employeeSlice";

// Container component - handles data fetching and passes data to UI
const AttendanceTableContainer = () => {
  const dispatch = useDispatch();
  const { mergedRecords } = useAttendanceData();

  useEffect(() => {
    dispatch(listenToEmployees());
  }, [dispatch]);

  return (
    <AttendanceTableUI 
      mergedRecords={mergedRecords}
      getStatusClasses={getStatusClasses}
    />
  );
};

export default AttendanceTableContainer;
export { useAttendanceData, getStatusClasses };