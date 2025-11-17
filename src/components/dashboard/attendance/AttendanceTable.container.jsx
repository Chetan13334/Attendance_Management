import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AttendanceTableUI from "./AttendanceTable.ui";
import { useAttendanceData, getStatusClasses } from "./useAttendanceData";
import { listenToEmployees } from "../../../redux/slices/employeeSlice";

// Container component - handles data fetching and passes data to UI
const AttendanceTableContainer = () => {
  const dispatch = useDispatch();
  const { mergedRecords, loading } = useAttendanceData();
  
  // Check if employees data is loading
  const employees = useSelector((state) => state.employees.list);
  const employeesLoading = !employees || employees.length === 0;

  useEffect(() => {
    console.log("Setting up employee listener in container");
    const result = dispatch(listenToEmployees());
    
    // Handle cleanup
    let cleanup;
    result.then((unsubscribe) => {
      console.log("Employee listener set up in container");
      cleanup = unsubscribe;
    }).catch((error) => {
      console.error("Failed to set up employee listener:", error);
    });
    
    return () => {
      console.log("Cleaning up employee listener in container");
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [dispatch]);

  useEffect(() => {
    console.log("Container - merged records updated:", mergedRecords.length);
    console.log("Container - loading state:", loading);
    console.log("Container - employees loading:", employeesLoading);
  }, [mergedRecords, loading, employeesLoading]);

  return (
    <AttendanceTableUI 
      mergedRecords={mergedRecords}
      getStatusClasses={getStatusClasses}
      loading={loading || employeesLoading}
    />
  );
};

export default AttendanceTableContainer;
export { useAttendanceData, getStatusClasses };