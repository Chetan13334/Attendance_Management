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
    const result = dispatch(listenToEmployees());
    
    // Handle cleanup
    let cleanup;
    result.then((unsubscribe) => {
      cleanup = unsubscribe;
    }).catch((error) => {
      console.error("Failed to set up employee listener:", error);
    });
    
    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [dispatch]);

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