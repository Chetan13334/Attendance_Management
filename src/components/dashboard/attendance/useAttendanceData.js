// src/components/dashboard/attendance/useAttendanceData.js

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo } from "react";
import { listenToAttendance } from "../../../redux/slices/attendanceSlice";

export const useAttendanceData = () => {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employees.list || []);
  const attendanceList = useSelector((state) => state.attendance.list || []);
  const attendanceLoading = useSelector((state) => state.attendance.loading || false);
  
  useEffect(() => {
    // Always set up the listener regardless of employee count
    const today = new Date();
    const result = dispatch(listenToAttendance(today));
    
    // Handle the cleanup function properly
    let cleanup;
    result.then((unsubscribe) => {
      cleanup = unsubscribe;
    }).catch((error) => {
      console.error("Failed to set up attendance listener:", error);
    });
    
    // Cleanup function to unsubscribe from the listener
    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [dispatch]); // Removed employees.length dependency to ensure the listener is always active

  // Merge employee data with attendance data using useMemo for performance
  const mergedRecords = useMemo(() => {
    return employees.map((emp) => {
      // Match employee with attendance record using the same logic as calendar component
      // Check if either emp.empId or emp.id matches the attendance document ID
      const att = attendanceList.find(a => a.employeeId === emp.empId || a.employeeId === emp.id);

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

      return {
        id: emp.id || '',
        employeeId: emp.EmployeeID || emp.employeeId || emp.empId || emp.id || '',
        name: emp.Name || emp.name || 'Unknown',
        photo: emp.Photo || emp.photo || null,
        date: new Date().toLocaleDateString(),
        time,
        status,
        remarks,
      };
    });
  }, [employees, attendanceList]); // Recalculate when employees or attendanceList changes

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