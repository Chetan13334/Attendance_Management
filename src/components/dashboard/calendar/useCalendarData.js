import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listenToEmployees } from "../../../redux/slices/employeeSlice";
import { listenToAttendance } from "../../../redux/slices/attendanceSlice";

// Helper function to get Monday of the week
const getMonday = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Sunday fix
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getLocalDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("");

export const attendanceStatuses = {
  "on-time": {
    label: "On time",
    classes: "bg-green-50 text-green-800 border-l-4 border-l-green-500",
  },
  late: {
    label: "Late",
    classes: "bg-yellow-50 text-yellow-800 border-l-4 border-l-yellow-400",
  },
  absent: {
    label: "Absent",
    classes: "bg-red-50 text-red-800 border-l-4 border-l-red-500",
  },
};

export const useCalendarData = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedStudents, setSelectedStudents] = useState({});
  const [attendance, setAttendance] = useState({});
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getMonday(new Date()));
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasDispatchedListener, setHasDispatchedListener] = useState(false);

  // Use Redux data
  const employeeState = useSelector((state) => state.employees);
  const attendanceState = useSelector((state) => state.attendance);
  
  // Generate days of the week
  useEffect(() => {
    const generateWeek = () => {
      const days = [];
      const monday = getMonday(currentWeekStart);

      for (let i = 0; i < 5; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        days.push({
          fullDate: getLocalDateKey(d),
          date: d.getDate(),
          day: d.toLocaleDateString("en-US", { weekday: "long" }),
          month: d.toLocaleDateString("en-US", { month: "short" }),
          year: d.getFullYear(),
        });
      }
      return days;
    };

    setDaysOfWeek(generateWeek());
  }, [currentWeekStart]);

  // Set up employee listener
  useEffect(() => {
    let cleanup;
    
    if (!hasDispatchedListener) {
      console.log("Setting up employee listener");
      dispatch(listenToEmployees()).then((unsubscribe) => {
        if (typeof unsubscribe === 'function') {
          cleanup = unsubscribe;
        }
      }).catch((error) => {
        console.error("Failed to set up employee listener:", error);
      });
      
      setHasDispatchedListener(true);
    }
    
    // Cleanup function
    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [dispatch, hasDispatchedListener]);

  // Set up attendance listeners for all days in the current week
  useEffect(() => {
    // Log the current week days
    console.log("Setting up attendance listeners for week days:", daysOfWeek);
    
    // Set loading state when changing weeks
    setLoading(true);
    
    // Create listeners for each day in the current week
    const dateListeners = [];
    
    // Create a listener for each day in the week
    daysOfWeek.forEach((day) => {
      const dateStr = day.fullDate;
      console.log("Setting up attendance listener for date:", dateStr);
      
      const result = dispatch(listenToAttendance(new Date(dateStr)));
      dateListeners.push(result);
    });
    
    // Handle cleanup functions
    Promise.all(dateListeners).then((unsubscribes) => {
      console.log("All attendance listeners set up successfully");
      // Set loading to false after setting up all listeners
      setLoading(false);
    }).catch((error) => {
      console.error("Error setting up attendance listeners:", error);
      setLoading(false);
    });
    
    // Cleanup function for this effect - clean up all listeners when week changes
    return () => {
      console.log("Cleaning up attendance listeners for week");
      dateListeners.forEach((result) => {
        // Each result is a promise that resolves to an unsubscribe function
        result.then((unsubscribe) => {
          if (typeof unsubscribe === 'function') {
            unsubscribe();
          }
        }).catch((error) => {
          console.error("Error cleaning up attendance listener:", error);
        });
      });
    };
  }, [dispatch, daysOfWeek]);

  // Helper function to determine status based on check-in time
  const determineStatus = useCallback((checkIn) => {
    let status = "absent";
    
    if (checkIn && !isNaN(checkIn.getTime())) {
      const totalMins = checkIn.getHours() * 60 + checkIn.getMinutes();
      
      // Define thresholds
      const onTimeThreshold = 10 * 60; // 10:00 AM
      const lateThreshold = 10 * 60 + 15; // 10:15 AM
      
      // On time if check-in is before or at 10:15 AM
      if (totalMins <= lateThreshold) {
        status = "on-time";
      } 
      // Late if check-in is after 10:15 AM
      else if (totalMins > lateThreshold) {
        status = "late";
      }
    }
    
    return status;
  }, []);

  // Memoize the date keys to avoid unnecessary recalculations
  const dateKeys = useMemo(() => {
    if (!daysOfWeek.length) return [];
    
    // Filter out future dates - only process dates up to today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const pastAndCurrentDays = daysOfWeek.filter(day => {
      const dayDate = new Date(day.fullDate);
      dayDate.setHours(0, 0, 0, 0);
      return dayDate <= today;
    });
    
    return pastAndCurrentDays.map(day => day.fullDate);
  }, [daysOfWeek]);

  // Process the attendance data when it changes in Redux
  useEffect(() => {
    console.log("Processing attendance data:", {
      employees: employeeState.list?.length,
      attendanceRecords: attendanceState.list?.length,
      dateKeys: dateKeys.length
    });
    
    if (!employeeState.list || !employeeState.list.length || !dateKeys.length) {
      console.log("Not processing attendance - missing data");
      return;
    }

    const newAttendance = {};
    
    // Initialize attendance data for all employees - this ensures every employee has an entry
    employeeState.list.forEach(employee => {
      newAttendance[employee.id] = {};
      // Initialize all past and current days as "absent" for each employee
      dateKeys.forEach(dateKey => {
        newAttendance[employee.id][dateKey] = "absent";
      });
    });
    
    // Process attendance data from Redux
    // Assuming attendanceState.list contains the attendance records
    if (attendanceState.list && Array.isArray(attendanceState.list)) {
      console.log("Processing", attendanceState.list.length, "attendance records");
      attendanceState.list.forEach(record => {
        // Find the employee that matches this attendance record
        const employee = employeeState.list.find(e => 
          e.id === record.employeeId || e.empId === record.employeeId
        );
        
        if (employee && dateKeys.includes(record.date)) {
          console.log("Matching record for employee", employee.id, "on date", record.date);
          // Convert check-in time
          let checkIn = null;
          if (record.CheckIn) {
            if (typeof record.CheckIn.toDate === "function") {
              checkIn = record.CheckIn.toDate();
            } else if (record.CheckIn.seconds) {
              checkIn = new Date(record.CheckIn.seconds * 1000);
            } else {
              checkIn = new Date(record.CheckIn);
            }
          }
          
          const status = determineStatus(checkIn);
          newAttendance[employee.id][record.date] = status;
          console.log("Set status for employee", employee.id, "on date", record.date, "to", status);
        }
      });
    }

    console.log("Final attendance data:", newAttendance);
    setAttendance(newAttendance);
  }, [employeeState.list, attendanceState.list, dateKeys, determineStatus]);

  /* ----------------------------------------------------------
     Navigation: Block Future Weeks
  ---------------------------------------------------------- */
  const isNextWeekDisabled = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentMonday = getMonday(today);

    const nextMonday = new Date(currentWeekStart);
    nextMonday.setDate(nextMonday.getDate() + 7);
    const nextWeekMonday = getMonday(nextMonday);

    return nextWeekMonday > currentMonday;
  }, [currentWeekStart]);

  const handlePreviousWeek = () => {
    console.log("Previous week clicked, setting loading state");
    setLoading(true); // Set loading immediately when navigating
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekStart(prev);
  };
  
  const handleNextWeek = () => {
    console.log("Next week clicked, setting loading state");
    setLoading(true); // Set loading immediately when navigating
    if (isNextWeekDisabled) {
      setLoading(false); // Reset loading if navigation is blocked
      return;
    }
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(next);
  };
  
  const handleToday = () => {
    console.log("Today clicked, setting loading state");
    setLoading(true); // Set loading immediately when navigating
    const today = new Date();
    const monday = getMonday(today);
    setCurrentWeekStart(monday);
  };

  const handleCellClick = useCallback((studentId, date) => {
    const currentStatus = attendance[studentId]?.[date] || "absent";
    const keys = Object.keys(attendanceStatuses);
    const nextIdx = (keys.indexOf(currentStatus) + 1) % keys.length;
    const nextStatus = keys[nextIdx];

    setAttendance(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], [date]: nextStatus }
    }));
  }, [attendance]);

  const handleOpenCalendarModal = () => navigate("/calendarcom");

  /* ----------------------------------------------------------
     Return everything the UI needs
     ---------------------------------------------------------- */
  // Format employees with avatar initials
  const formattedStudents = useMemo(() => {
    return (employeeState.list || []).map((emp) => ({
      ...emp,
      initials: getInitials(emp.name || emp.Name || "Unknown"),
    }));
  }, [employeeState.list]);

  // Show loading state when we're actively fetching data
  const showLoading = loading || attendanceState.loading;

  return {
    loading: showLoading,
    selectedStudents,
    setSelectedStudents,
    attendance,
    currentWeekStart,
    daysOfWeek,
    formattedStudents,
    handleCellClick,
    handlePreviousWeek,
    handleNextWeek,
    handleToday,
    handleOpenCalendarModal,
    attendanceStatuses,
    isNextWeekDisabled,
  };
};