import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AttendanceTableUI from "./AttendanceTable.ui";
import { useAttendanceData, getStatusClasses } from "./useAttendanceData";
import { listenToEmployees } from "../../../redux/slices/employeeSlice";

// Container component - handles data fetching and passes data to UI
const AttendanceTableContainer = () => {
  const dispatch = useDispatch();
  const { mergedRecords } = useAttendanceData();
  
  // Check if employees data is loading
  const employees = useSelector((state) => state.employees.list);
  const loading = !employees || employees.length === 0;

  useEffect(() => {
    dispatch(listenToEmployees());
  }, [dispatch]);

  return (
    <AttendanceTableUI 
      mergedRecords={mergedRecords}
      getStatusClasses={getStatusClasses}
      loading={loading}
    />
  );
};

export default AttendanceTableContainer;
export { useAttendanceData, getStatusClasses };