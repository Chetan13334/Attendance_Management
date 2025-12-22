import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { listenToAttendance, subscribeToAttendanceUpdates } from "../../../redux/slices/attendanceSlice";

const getLocalDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const useAttendanceData = () => {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employees.list || []);
  const attendanceList = useSelector((state) => state.attendance.list || []);
  const attendanceLoading = useSelector((state) => state.attendance.loading || false);

  const [currentDate, setCurrentDate] = useState(new Date());

  // Refresh interval logic
  useEffect(() => {
    const checkDateChange = () => {
      const now = new Date();
      if (now.toDateString() !== currentDate.toDateString()) {
        setCurrentDate(now);
      }
    };
    window.addEventListener('focus', checkDateChange);
    const interval = setInterval(checkDateChange, 60000); // Check every minute
    return () => {
      window.removeEventListener('focus', checkDateChange);
      clearInterval(interval);
    };
  }, [currentDate]);

  // Setup data listener
  useEffect(() => {
    const dateKey = getLocalDateKey(currentDate);

    // 1. Fetch initial data
    const promise = dispatch(listenToAttendance(currentDate));

    // 2. Subscribe to real-time updates via Socket.io
    const unsubscribe = dispatch(subscribeToAttendanceUpdates(dateKey));

    return () => {
      // Cleanup on unmount or date change
      promise.then(cleanup => {
        if (typeof cleanup === 'function') cleanup();
      }).catch(e => console.warn("Cleanup error", e));

      if (promise.abort) {
        promise.abort();
      }

      // Unsubscribe from socket updates
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [dispatch, currentDate]);

  // Merge logic
  const mergedRecords = useMemo(() => {
    const dateKey = getLocalDateKey(currentDate);

    if (!employees || employees.length === 0) return [];

    return employees.map((emp) => {
      // Find attendance record for this employee and date
      const att = attendanceList.find(a => {
        // Id match
        const matchId = (a.employeeId === emp.empId) || (a.employeeId === emp.id) || (a.id === emp.id);
        // Date match (optional if list is already filtered by date, but good for safety)
        const matchDate = a.date === dateKey;
        return matchId && matchDate;
      });

      let status = "Absent";
      let time = "-";
      let remarks = "Not marked";
      let checkOutTime = "-";

      // --- CHECK IN PROCESSING ---
      if (att?.CheckIn) {
        // Backend sends ISO string "2024-12-09T09:30:00.000Z"
        const checkInDate = new Date(att.CheckIn);

        if (!isNaN(checkInDate.getTime())) {
          time = checkInDate.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          });

          // Late Logic (10:00 AM cutoff)
          const mins = checkInDate.getHours() * 60 + checkInDate.getMinutes();
          const cutoff = 10 * 60; // 10:00 AM

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
          // Fallback for unexpected data
          time = "Invalid Time";
        }
      }

      // --- CHECK OUT PROCESSING ---
      if (att?.CheckOut) {
        const checkOutDate = new Date(att.CheckOut);
        if (!isNaN(checkOutDate.getTime())) {
          checkOutTime = checkOutDate.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          });
        }
      }

      // If backend explicitly sends 'status', use it (optional override)
      if (att?.status) {
        // Map backend status to frontend display if needed, or use directly
        // status = att.status; 
      }

      const formattedDate = currentDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      return {
        id: emp.id,
        employeeId: emp.EmployeeID || emp.employeeId || emp.empId || emp.id,
        name: emp.Name || emp.name || 'Unknown',
        photo: emp.Photo || emp.photo || null,
        designation: emp.Designation || emp.designation || '-',
        department: emp.Department || emp.department || '-',
        date: formattedDate,
        checkIn: time,
        checkOut: checkOutTime,
        status,
        remarks,
        dateOfJoining: emp.DateOfJoining || null,
      };
    });
  }, [employees, attendanceList, currentDate]);

  return { mergedRecords, loading: attendanceLoading };
};

export const getStatusClasses = (status) => {
  if (status === "On time") return "bg-green-100 text-green-800";
  if (status === "Late") return "bg-yellow-100 text-yellow-800";
  if (status === "Absent") return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
};