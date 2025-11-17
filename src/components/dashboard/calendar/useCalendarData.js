import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listenToEmployees } from "../../../redux/slices/employeeSlice";
import { listenToAttendance, fetchCalendarAttendance } from "../../../redux/slices/attendanceSlice";

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
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastLoadedWeek, setLastLoadedWeek] = useState(null);
  const [hasDispatchedListener, setHasDispatchedListener] = useState(false);

  // Use Redux data
  const employeeState = useSelector((state) => state.employees);
  const attendanceState = useSelector((state) => state.attendance);
  
  useEffect(() => {
    // Only dispatch the listener once
    if (!hasDispatchedListener) {
      dispatch(listenToEmployees());
      dispatch(listenToAttendance());
      setHasDispatchedListener(true);
    }
    
    // Use employee data from Redux
    if (employeeState.list && employeeState.list.length > 0) {
      console.log("Loaded Employees from Redux:", employeeState.list);
    }
    
    // Use attendance data from Redux
    if (attendanceState.list) {
      console.log("Loaded Attendance from Redux:", attendanceState.list);
    }
    
    setLoading(false);
  }, [dispatch, employeeState.list, attendanceState.list, hasDispatchedListener]);

  const generateWeek = useCallback((start) => {
    const days = [];
    const date = new Date(start);
    const dow = date.getDay();
    const mondayOffset = dow === 0 ? -6 : 1 - dow; 
    date.setDate(date.getDate() + mondayOffset);

    for (let i = 0; i < 5; i++) {
      const d = new Date(date);
      d.setDate(date.getDate() + i);
      days.push({
        fullDate: getLocalDateKey(d),
        date: d.getDate(),
        day: d.toLocaleDateString("en-US", { weekday: "long" }),
        month: d.toLocaleDateString("en-US", { month: "short" }),
        year: d.getFullYear(),
      });
    }
    return days;
  }, []);

  useEffect(() => {
    setDaysOfWeek(generateWeek(currentWeekStart));
  }, [currentWeekStart, generateWeek]);

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

  const processAttendanceData = useCallback(async () => {
    if (!employeeState.list || !employeeState.list.length || !dateKeys.length) return;

    // Create a unique key for the current week that includes the date range
    const weekKey = dateKeys.join('-');
    if (lastLoadedWeek === weekKey) {
      return;
    }

    try {
      // Set all cells to loading state initially
      const loadingAttendance = {};
      employeeState.list.forEach(employee => {
        loadingAttendance[employee.id] = {};
        dateKeys.forEach(dateKey => {
          loadingAttendance[employee.id][dateKey] = "loading";
        });
      });
      setAttendance(loadingAttendance);
      
      // Fetch attendance data for these dates
      await dispatch(fetchCalendarAttendance(dateKeys)).unwrap();
      
      // Set last loaded week to prevent unnecessary refetching
      setLastLoadedWeek(weekKey);
    } catch (error) {
      console.error("Error processing attendance data:", error);
      // Set all cells back to absent on error
      const errorAttendance = {};
      employeeState.list.forEach(employee => {
        errorAttendance[employee.id] = {};
        dateKeys.forEach(dateKey => {
          errorAttendance[employee.id][dateKey] = "absent";
        });
      });
      setAttendance(errorAttendance);
    }
  }, [employeeState.list, dateKeys, lastLoadedWeek, dispatch]);

  // Process attendance data when employees or date keys change
  useEffect(() => {
    if (employeeState.list && employeeState.list.length && dateKeys.length) {
      processAttendanceData();
    }
  }, [employeeState.list, dateKeys, processAttendanceData]);

  // Process the attendance data when it changes in Redux
  useEffect(() => {
    if (!employeeState.list || !employeeState.list.length || !dateKeys.length) {
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
    const calendarAttendance = attendanceState.calendarData || {};
    
    // For each employee in the calendar data
    Object.keys(calendarAttendance).forEach(empId => {
      // Find the employee in our employee list using multiple matching strategies
      const employee = employeeState.list.find(e => 
        e.id === empId || e.empId === empId || e.EmployeeID === empId
      );
      
      if (employee) {
        // For each date in this employee's attendance data
        Object.keys(calendarAttendance[empId]).forEach(dateKey => {
          // Check if this date is within our current week
          if (dateKeys.includes(dateKey)) {
            // Get the raw attendance data for this date
            const rawData = calendarAttendance[empId][dateKey];
            
            // Determine status based on check-in time
            // Convert ISO string back to Date object for processing
            const checkIn = rawData?.CheckIn ? new Date(rawData.CheckIn) : null;
            const status = determineStatus(checkIn);
            
            console.log("Processing attendance record:", employee.name, dateKey, status);
            
            // Update the status for this date
            newAttendance[employee.id][dateKey] = status;
          }
        });
      }
    });

    console.log("Final attendance data:", newAttendance);
    setAttendance(newAttendance);
  }, [employeeState.list, attendanceState.calendarData, dateKeys, determineStatus]);

  /* ----------------------------------------------------------
     Navigation helpers
     ---------------------------------------------------------- */
  const handlePreviousWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekStart(prev);
    // Reset last loaded week to force refetch
    setLastLoadedWeek(null);
  };
  
  const handleNextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(next);
    // Reset last loaded week to force refetch
    setLastLoadedWeek(null);
  };
  
  const handleToday = () => {
    const today = new Date();
    const dow = today.getDay();
    const mondayOffset = dow === 0 ? -6 : 1 - dow;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    setCurrentWeekStart(monday);
    // Reset last loaded week to force refetch
    setLastLoadedWeek(null);
  };

  const handleCellClick = useCallback(
    (studentId, date, currentStatus) => {
      const keys = Object.keys(attendanceStatuses);
      const curIdx = keys.indexOf(currentStatus);
      const nextIdx = (curIdx + 1) % keys.length;
      const nextStatus = keys[nextIdx];

      setAttendance((prev) => ({
        ...prev,
        [studentId]: { ...prev[studentId], [date]: nextStatus },
      }));
    },
    []
  );

  const handleOpenCalendarModal = () => navigate("/calendarcom");

  /* ----------------------------------------------------------
     Return everything the UI needs
     ---------------------------------------------------------- */
  // Format employees with avatar initials
  const formattedStudents = useMemo(() => {
    return (employeeState.list || []).map((emp) => ({
      ...emp,
      initials: getInitials(emp.name),
    }));
  }, [employeeState.list]);

  // Show loading state when we're actively fetching data
  const showLoading = loading || attendanceState.calendarLoading;

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
  };
};