// src/components/dashboard/attendance/useAttendanceData.js

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { listenToAttendance } from "../../../redux/slices/attendanceSlice";

export const useAttendanceData = () => {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employees.list || []);
  const attendanceList = useSelector((state) => state.attendance.list || []);
  const attendanceLoading = useSelector((state) => state.attendance.loading || false);
  
  // State to track current date
  const [currentDate, setCurrentDate] = useState(new Date());
  const [forceRefresh, setForceRefresh] = useState(0); // Add force refresh mechanism
  
  // Update current date when component mounts to ensure we have the latest date
  useEffect(() => {
    const now = new Date();
    console.log("Component mounted, setting current date to:", now.toDateString());
    setCurrentDate(now);
    // Force a refresh when component mounts
    setForceRefresh(prev => prev + 1);
  }, []);
  
  // Update current date when window regains focus and periodically
  useEffect(() => {
    const checkDateChange = () => {
      const now = new Date();
      // Check if the date has changed (day, month, or year)
      if (now.toDateString() !== currentDate.toDateString()) {
        console.log("Date changed from", currentDate.toDateString(), "to", now.toDateString(), "- updating current date");
        setCurrentDate(now);
      }
    };
    
    // Check on window focus
    window.addEventListener('focus', checkDateChange);
    
    // Also check periodically
    const interval = setInterval(checkDateChange, 60000); // Check every minute
    
    return () => {
      window.removeEventListener('focus', checkDateChange);
      clearInterval(interval);
    };
  }, [currentDate]);
  
  useEffect(() => {
    console.log("Setting up attendance listener for date:", currentDate, "forceRefresh:", forceRefresh);
    // Always set up the listener regardless of employee count
    const result = dispatch(listenToAttendance(currentDate));
    
    // Handle the cleanup function properly
    let cleanup;
    result.then((unsubscribe) => {
      console.log("Attendance listener set up successfully");
      cleanup = unsubscribe;
    }).catch((error) => {
      console.error("Failed to set up attendance listener:", error);
    });
    
    // Cleanup function to unsubscribe from the listener
    return () => {
      console.log("Cleaning up attendance listener");
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [dispatch, currentDate, forceRefresh]); // Depend on forceRefresh to refresh when component mounts

  // Debug logging
  useEffect(() => {
    console.log("Employees updated:", employees.length);
    console.log("Attendance list updated:", attendanceList.length);
    if (attendanceList.length > 0) {
      console.log("First attendance record:", attendanceList[0]);
    }
  }, [employees, attendanceList]);

  // Merge employee data with attendance data using useMemo for performance
  const mergedRecords = useMemo(() => {
    console.log("Recalculating merged records with", employees.length, "employees and", attendanceList.length, "attendance records");
    return employees.map((emp) => {
      // Match employee with attendance record using the same logic as calendar component
      // Check if either emp.empId or emp.id matches the attendance document ID
      const att = attendanceList.find(a => {
        const match = a.employeeId === emp.empId || a.employeeId === emp.id;
        console.log(`Matching employee ${emp.id} (${emp.empId}) with attendance ${a.employeeId}: ${match}`);
        return match;
      });
      
      console.log(`Matching employee ${emp.id} with attendance:`, att);

      let status = "Absent";
      let time = "-";
      let remarks = "Not marked";

      if (att?.CheckIn) {
        // Convert Firebase timestamp
        let checkIn;
        if (typeof att.CheckIn.toDate === "function") {
          checkIn = att.CheckIn.toDate();
        } else if (att.CheckIn.seconds) {
          checkIn = new Date(att.CheckIn.seconds * 1000);
        } else {
          checkIn = new Date(att.CheckIn);
        }

        // Validate date
        if (checkIn instanceof Date && !isNaN(checkIn.getTime())) {
          time = checkIn.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          });

          const mins = checkIn.getHours() * 60 + checkIn.getMinutes();
          const cutoff = 10 * 60 + 15; // 10:15 AM

          if (mins <= cutoff) {
            status = "On time";
            remarks = "On time";
          } else {
            status = "Late";
            const diff = mins - cutoff;

            if (diff < 60) {
              remarks = `${diff} min late`;
            } else {
              remarks = `${Math.floor(diff / 60)} hr ${diff % 60} min late`;
            }
          }
        } else {
          // Invalid date
          status = "Absent";
          time = "-";
          remarks = "Invalid data";
        }
      }

      // Format the current date for display
      const formattedDate = currentDate.toLocaleDateString();

      return {
        id: emp.id || '',
        employeeId: emp.EmployeeID || emp.employeeId || emp.empId || emp.id || '',
        name: emp.Name || emp.name || 'Unknown',
        photo: emp.Photo || emp.photo || null,
        date: formattedDate,
        time,
        status,
        remarks,
      };
    });
  }, [employees, attendanceList, currentDate]); // Recalculate when employees, attendanceList, or currentDate changes

  return { mergedRecords, loading: attendanceLoading };
};

// ------------------------------------------------------------
// STATUS COLORS — On time, Late, Absent
// ------------------------------------------------------------
export const getStatusClasses = (status) => {
  if (status === "On time") return "bg-green-100 text-green-800";
  if (status === "Late") return "bg-yellow-100 text-yellow-800";
  if (status === "Absent") return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
};