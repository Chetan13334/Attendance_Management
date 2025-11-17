import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";
import {
  listenToEvents,
  createEvent,
  deleteEvent,
} from "../../../redux/slices/eventSlice";
import { listenToEmployees } from "../../../redux/slices/employeeSlice";

// Helper: YYYY-MM-DD string (local timezone)
const getLocalDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const useCalendarData = (employeeId) => {
  const dispatch = useDispatch();

  const { list: events } = useSelector((state) => state.events);
  const { list: employees } = useSelector((state) => state.employees);

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventForm, setEventForm] = useState({ title: "", theme: "blue" });
  const [loading, setLoading] = useState(false);
  const [employeeAttendance, setEmployeeAttendance] = useState({});
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [unsubscribeFunctions, setUnsubscribeFunctions] = useState({});

  const monthNames = useMemo(() => [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ], []);

  const daysOfWeek = useMemo(() => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], []);

  // --- Start real-time listeners ---
  useEffect(() => {
    dispatch(listenToEvents());
    dispatch(listenToEmployees());
  }, [dispatch]);

  // --- Find selected employee ---
  useEffect(() => {
    if (employeeId && employees.length > 0) {
      // Find employee by document ID (this is what's passed from the calendar)
      const employee = employees.find(emp => emp.id === employeeId);
      setSelectedEmployee(employee);
    }
  }, [employeeId, employees]);

  // --- Set up real-time listeners for all days in the current month ---
  useEffect(() => {
    // Clean up previous listeners
    Object.values(unsubscribeFunctions).forEach(unsubscribe => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    });
    
    // Set loading state when changing months
    setLoading(true);
    
    // Get all days in the current month
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Create listeners for each day in the current month
    const newUnsubscribeFunctions = {};
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateKey = getLocalDateKey(date);
      
      // Create date document reference
      const dateDocRef = doc(db, "Employee_CheckIn_CheckOut", dateKey);
      const empRecColRef = collection(dateDocRef, "employee_records");
      
      // Set up real-time listener for this date
      const unsubscribe = onSnapshot(empRecColRef, (empSnapshot) => {
        // Process the snapshot data
        let employeeRecord = null;
        
        // Try to find the record for our specific employee
        if (employeeId && selectedEmployee) {
          // Try different ways to match the employee:
          // 1. Try to find by the employee's empId field
          if (selectedEmployee.empId) {
            empSnapshot.forEach((empDoc) => {
              if (empDoc.id === selectedEmployee.empId) {
                employeeRecord = empDoc.data();
              }
            });
          }
          
          // 2. Try by document ID
          if (!employeeRecord) {
            empSnapshot.forEach((empDoc) => {
              if (empDoc.id === employeeId) {
                employeeRecord = empDoc.data();
              }
            });
          }
          
          // 3. Try by EmployeeID field in the employee data
          if (!employeeRecord && selectedEmployee.EmployeeID) {
            empSnapshot.forEach((empDoc) => {
              if (empDoc.id === selectedEmployee.EmployeeID) {
                employeeRecord = empDoc.data();
              }
            });
          }
          
          // 4. Try by employeeId field in the employee data
          if (!employeeRecord && selectedEmployee.employeeId) {
            empSnapshot.forEach((empDoc) => {
              if (empDoc.id === selectedEmployee.employeeId) {
                employeeRecord = empDoc.data();
              }
            });
          }
        }
        
        // Update the attendance state for this specific date
        setEmployeeAttendance(prev => {
          const newAttendance = { ...prev };
          
          if (employeeRecord && employeeId && selectedEmployee) {
            // Convert check-in time
            let checkIn = null;
            if (employeeRecord.CheckIn) {
              if (typeof employeeRecord.CheckIn.toDate === "function") {
                checkIn = employeeRecord.CheckIn.toDate();
              } else if (employeeRecord.CheckIn.seconds) {
                checkIn = new Date(employeeRecord.CheckIn.seconds * 1000);
              } else {
                checkIn = new Date(employeeRecord.CheckIn);
              }
            }
            
            // Determine status
            let status = "absent";
            if (checkIn && !isNaN(checkIn.getTime())) {
              const totalMins = checkIn.getHours() * 60 + checkIn.getMinutes();
              
              // Define thresholds
              const onTimeThreshold = 10 * 60; // 10:00 AM
              const lateThreshold = 10 * 60 + 15; // 10:15 AM
              
              if (totalMins >= onTimeThreshold && totalMins <= lateThreshold) {
                status = "on-time";
              } else if (totalMins > lateThreshold) {
                status = "late";
              } else if (totalMins < onTimeThreshold) {
                status = "on-time";
              }
            }
            
            newAttendance[dateKey] = status;
          } else {
            // No record found, set to absent
            newAttendance[dateKey] = "absent";
          }
          
          return newAttendance;
        });
      }, (error) => {
        console.error(`Error in attendance listener for ${dateKey}:`, error);
        // Set this date to absent on error
        setEmployeeAttendance(prev => ({
          ...prev,
          [dateKey]: "absent"
        }));
      });
      
      // Store the unsubscribe function
      newUnsubscribeFunctions[dateKey] = unsubscribe;
    }
    
    // Update the unsubscribe functions
    setUnsubscribeFunctions(newUnsubscribeFunctions);
    
    // Set loading to false after setting up all listeners
    setLoading(false);
    
    // Cleanup function for this effect
    return () => {
      Object.values(newUnsubscribeFunctions).forEach(unsubscribe => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      });
    };
  }, [currentMonth, currentYear, employeeId, selectedEmployee]);

  // --- Helper: convert Firestore Timestamp → Date (handles both Timestamp & plain object) ---
  const toDate = useCallback((ts) => {
    if (!ts) return null;
    if (typeof ts.toDate === "function") return ts.toDate();
    return new Date(ts);
  }, []);

  // --- Calendar days ---
  const getCalendarDays = useCallback(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const days = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++)
      days.push(new Date(currentYear, currentMonth, d));
    return days;
  }, [currentMonth, currentYear]);

  const calendarDays = useMemo(() => getCalendarDays(), [getCalendarDays]);
  
  const weeks = useMemo(() => {
    const weeksArray = [];
    for (let i = 0; i < calendarDays.length; i += 7)
      weeksArray.push(calendarDays.slice(i, i + 7));
    return weeksArray;
  }, [calendarDays]);

  // --- Get attendance status for a specific date ---
  const getAttendanceStatusForDate = useCallback((date) => {
    if (!date || !employeeId) return "absent";
    
    // Format date as YYYY-MM-DD
    const dateKey = getLocalDateKey(date);
    return employeeAttendance[dateKey] || "absent";
  }, [employeeId, employeeAttendance]);

  // --- Navigation ---
  const handlePrevMonth = useCallback(() => {
    console.log("Previous month clicked, setting loading state");
    setLoading(true); // Set loading immediately when navigating
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }, [currentMonth]);

  const handleNextMonth = useCallback(() => {
    console.log("Next month clicked, setting loading state");
    setLoading(true); // Set loading immediately when navigating
    const today = new Date();

    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth(); // 0-based

    // Prevent navigating to future months
    if (
      currentYear > thisYear ||
      (currentYear === thisYear && currentMonth >= thisMonth)
    ) {
      setLoading(false); // Reset loading if navigation is blocked
      return; // Stop navigation
    }

    // Otherwise allow month change
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }, [currentMonth, currentYear]);


// Disable next-month button if trying to move into the future
const isNextDisabled = (() => {
  const today = new Date();
  const thisYear = today.getFullYear();
  const thisMonth = today.getMonth(); // 0-based index

  // If current page month is ahead of today's month → disable next
  return (
    currentYear > thisYear ||
    (currentYear === thisYear && currentMonth >= thisMonth)
  );
})();

  // --- Modal ---
  const handleDayClick = useCallback((date) => {
    if (!date) return;
    setSelectedDate(date);
    setEventForm({ title: "", theme: "blue" });
    setIsModalOpen(true);
  }, []);

  // --- Add Event ---
  const handleAddEvent = useCallback(async () => {
    if (!eventForm.title.trim() || !selectedDate) {
      alert("Please add an event title");
      return;
    }
    setLoading(true);
    try {
      await dispatch(
        createEvent({
          event_title: eventForm.title,
          event_theme: eventForm.theme,
          event_date: selectedDate, // ← Date object
        })
      ).unwrap();

      setIsModalOpen(false);
      setEventForm({ title: "", theme: "blue" });
    } catch (err) {
      console.error("Error adding event:", err);
      alert("Failed to add event");
    } finally {
      setLoading(false);
    }
  }, [eventForm, selectedDate, dispatch]);

  // --- Delete Event ---
  const handleDeleteEvent = useCallback(async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await dispatch(deleteEvent(id)).unwrap();
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event");
    }
  }, [dispatch]);

  // --- Parse events safely (Handles ISO string OR Firebase Timestamp) ---
  const getParsedEvents = useCallback(() => {
    return events
      .map((ev) => {
        let eventDate = null;

        if (ev.event_date) {
          if (typeof ev.event_date === "string") {
            eventDate = new Date(ev.event_date);
          } else if (ev.event_date.toDate) {
            // Firebase Timestamp
            eventDate = ev.event_date.toDate();
          } else if (ev.event_date instanceof Date) {
            eventDate = ev.event_date;
          }

          if (!eventDate || isNaN(eventDate.getTime())) {
            console.warn("Invalid event_date:", ev.event_date, ev);
            return null;
          }
        }

        return { ...ev, event_date: eventDate };
      })
      .filter(Boolean); // Remove nulls
  }, [events]);

  const parsedEvents = useMemo(() => getParsedEvents(), [getParsedEvents]);

  // --- Parse employees ---
  const getParsedEmployees = useCallback(() => {
    return employees.map((emp) => ({
      ...emp,
      DateOfBirth: emp.DateOfBirth
        ? typeof emp.DateOfBirth === "string"
          ? new Date(emp.DateOfBirth)
          : emp.DateOfBirth.toDate
          ? emp.DateOfBirth.toDate()
          : emp.DateOfBirth
        : null,
    }));
  }, [employees]);

  const parsedEmployees = useMemo(() => getParsedEmployees(), [getParsedEmployees]);

  return {
    // State
    currentMonth,
    currentYear,
    isModalOpen,
    selectedDate,
    eventForm,
    loading,
    weeks,
    daysOfWeek,
    monthNames,
    parsedEvents,
    parsedEmployees,
    employeeAttendance,
    selectedEmployee,
    getAttendanceStatusForDate,

    // ADD THIS ↓↓↓
    isNextDisabled,
    
    // Functions
    setCurrentMonth,
    setCurrentYear,
    setIsModalOpen,
    setSelectedDate,
    setEventForm,
    setLoading,
    handlePrevMonth,
    handleNextMonth,
    handleDayClick,
    handleAddEvent,
    handleDeleteEvent,
};
};