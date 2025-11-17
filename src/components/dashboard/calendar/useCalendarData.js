import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  collection,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { listenToEmployees } from "../../../redux/slices/employeeSlice";

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
  
  useEffect(() => {
    // Only dispatch the listener once
    if (!hasDispatchedListener) {
      dispatch(listenToEmployees());
      setHasDispatchedListener(true);
    }
    
    // Use employee data from Redux
    if (employeeState.list && employeeState.list.length > 0) {
      console.log("Loaded Employees from Redux:", employeeState.list);
    }
    setLoading(false);
  }, [dispatch, employeeState.list, hasDispatchedListener]);

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

  // Helper: convert Firestore Timestamp → Date
  const toDate = useCallback((ts) => {
    if (!ts) return null;
    if (typeof ts.toDate === "function") return ts.toDate();
    return new Date(ts);
  }, []);

  // Helper function to determine status based on check-in time
  const determineStatus = useCallback((checkIn) => {
    let status = "absent";
    
    if (checkIn && !isNaN(checkIn.getTime())) {
      const totalMins = checkIn.getHours() * 60 + checkIn.getMinutes();
      
      // Define thresholds
      const onTimeThreshold = 10 * 60; // 10:00 AM
      const lateThreshold = 10 * 60 + 15; // 10:15 AM
      
      // On time if check-in is between 10:00 AM and 10:15 AM (inclusive)
      // Also on time if check-in is before 10:00 AM
      if (totalMins >= onTimeThreshold && totalMins <= lateThreshold) {
        status = "on-time";
      } 
      // Late if check-in is after 10:15 AM
      else if (totalMins > lateThreshold) {
        status = "late";
      }
      // On time if check-in is before 10:00 AM
      else if (totalMins < onTimeThreshold) {
        status = "on-time";
      }
    }
    
    return status;
  }, []);

  const fetchAttendanceForWeek = useCallback(async () => {
    if (!employeeState.list || !employeeState.list.length || !daysOfWeek.length) return;

    // Create a unique key for the current week that includes the date range
    const weekKey = daysOfWeek.map(day => day.fullDate).join('-');
    if (lastLoadedWeek === weekKey) {
      return;
    }

    setLoading(true);
    const newAttendance = {};

    try {
      // Filter out future dates - only process dates up to today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const pastAndCurrentDays = daysOfWeek.filter(day => {
        const dayDate = new Date(day.fullDate);
        dayDate.setHours(0, 0, 0, 0);
        return dayDate <= today;
      });

      console.log("Processing attendance for days up to today:", pastAndCurrentDays.map(d => d.fullDate));
      
      // Initialize attendance data for all employees - this ensures every employee has an entry
      employeeState.list.forEach(employee => {
        newAttendance[employee.id] = {};
        // Initialize all past and current days as "absent" for each employee
        pastAndCurrentDays.forEach(day => {
          newAttendance[employee.id][day.fullDate] = "absent";
        });
      });
      
      // Process each date to fetch attendance data
      const fetchPromises = pastAndCurrentDays.map(async (day) => {
        const dateKey = day.fullDate;
        console.log("Checking attendance for date:", dateKey);
        
        try {
          // Create date document reference
          const dateDocRef = doc(db, "Employee_CheckIn_CheckOut", dateKey);
          const empRecColRef = collection(dateDocRef, "employee_records");

          // Get all employee records for this date
          const empSnap = await getDocs(empRecColRef);
          console.log(`Found ${empSnap.size} employee records for ${dateKey}`);

          // Process each employee record for this date
          empSnap.forEach((empDoc) => {
            const empIdFromDoc = empDoc.id;
            const data = empDoc.data();
            console.log("Processing employee record:", empIdFromDoc, data);

            const checkIn = toDate(data?.CheckIn);
            console.log("CheckIn time:", checkIn);

            // Try to find the employee in our employee list using multiple matching strategies
            let employee = null;
            
            // Try to match by empId field
            if (!employee) {
              employee = employeeState.list.find((e) => e.empId === empIdFromDoc);
            }
            
            // Try to match by document ID
            if (!employee) {
              employee = employeeState.list.find((e) => e.id === empIdFromDoc);
            }
            
            // Try to match by EmployeeID field
            if (!employee && data.EmployeeID) {
              employee = employeeState.list.find((e) => String(e.EmployeeID) === String(data.EmployeeID));
            }
            
            if (employee) {
              const status = determineStatus(checkIn);
              console.log("Determined status:", status, "for employee:", employee.name);
              
              // Update the status for this date
              newAttendance[employee.id][dateKey] = status;
            } else {
              console.log("Could not find employee for ID:", empIdFromDoc);
            }
          });
        } catch (dateError) {
          console.warn(`Error fetching attendance for ${dateKey}:`, dateError);
        }
      });

      // Wait for all fetches to complete
      await Promise.all(fetchPromises);

      console.log("Final attendance data:", newAttendance);
      setAttendance(newAttendance);
      setLastLoadedWeek(weekKey);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  }, [employeeState.list, daysOfWeek, lastLoadedWeek, toDate, determineStatus]);

  // Run once employees + week are ready
  useEffect(() => {
    if (employeeState.list && employeeState.list.length && daysOfWeek.length) {
      fetchAttendanceForWeek();
    } else {
      setLoading(false);
    }
  }, [employeeState.list, daysOfWeek, fetchAttendanceForWeek]);

  /* ----------------------------------------------------------
     Navigation helpers
     ---------------------------------------------------------- */
  const handlePreviousWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekStart(prev);
  };
  
  const handleNextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(next);
  };
  
  const handleToday = () => {
    const today = new Date();
    const dow = today.getDay();
    const mondayOffset = dow === 0 ? -6 : 1 - dow;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    setCurrentWeekStart(monday);
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
  const formattedStudents = (employeeState.list || []).map((emp) => ({
    ...emp,
    initials: getInitials(emp.name),
  }));

  // Only show loading state when we're actively fetching data
  const showLoading = loading && (!employeeState.list || employeeState.list.length === 0);

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