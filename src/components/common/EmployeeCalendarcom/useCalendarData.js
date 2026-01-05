import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  listenToEvents,
  createEvent,
  deleteEvent,
} from "../../../redux/slices/eventSlice";
import { listenToEmployees } from "../../../redux/slices/employeeSlice";
import { fetchCalendarAttendance } from "../../../redux/slices/attendanceSlice";
import { usePopup } from "../../../components/common/popups/usePopup";

// Helper: YYYY-MM-DD string (local timezone)
const getLocalDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const useCalendarData = (employeeId) => {
  const dispatch = useDispatch();
  const { showToast, showConfirm } = usePopup();

  // Redux Selectors
  const { list: events } = useSelector((state) => state.events);
  const { list: employees } = useSelector((state) => state.employees);
  // calendarData is { "YYYY-MM-DD": [ { id, EmployeeID, CheckIn, ... }, ... ] }
  const { calendarData } = useSelector((state) => state.attendance);

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventForm, setEventForm] = useState({ title: "", theme: "blue" });
  const [loading, setLoading] = useState(false);
  const [employeeAttendance, setEmployeeAttendance] = useState({});
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const monthNames = useMemo(() => [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ], []);

  const daysOfWeek = useMemo(() => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], []);

  // --- 1. Initial Fetching ---
  useEffect(() => {
    dispatch(listenToEvents());
    dispatch(listenToEmployees());
    // Fetch attendance data for calendar
    dispatch(fetchCalendarAttendance());
  }, [dispatch]);

  // --- 2. Identify Selected Employee ---
  useEffect(() => {
    if (employeeId && employees.length > 0) {
      const employee = employees.find(emp => emp.id === employeeId);
      setSelectedEmployee(employee);
    }
  }, [employeeId, employees]);

  // --- 3. Calculate Attendance Status for Current Month ---
  useEffect(() => {
    setLoading(true);

    const newAttendance = {};
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Iterate through all days of the viewed month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateKey = getLocalDateKey(date);

      // Get records for this date from Redux
      const dailyRecords = calendarData[dateKey] || [];

      // Find the record corresponding to the current employee
      let employeeRecord = null;
      if (employeeId) {
        employeeRecord = dailyRecords.find(r =>
          r.id === employeeId ||
          r.employeeId === employeeId ||
          (selectedEmployee && r.employeeId === selectedEmployee.EmployeeID) // Check custom ID field
        );
      }

      if (employeeRecord) {
        // Determine status based on CheckIn time
        let checkIn = null;
        if (employeeRecord.CheckIn) {
          checkIn = new Date(employeeRecord.CheckIn);
        }

        let status = "absent";
        if (checkIn && !isNaN(checkIn.getTime())) {
          const totalMins = checkIn.getHours() * 60 + checkIn.getMinutes();
          const onTimeThreshold = 10 * 60; // 10:00 AM
          const lateThreshold = 10 * 60 + 15; // 10:15 AM

          if (totalMins >= onTimeThreshold && totalMins <= lateThreshold) {
            status = "on-time";
          } else if (totalMins > lateThreshold) {
            status = "late";
          } else if (totalMins < onTimeThreshold) {
            // Early check-in is also considered on-time effectively
            status = "on-time";
          }
        }
        newAttendance[dateKey] = status;
      } else {
        // No record logic
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const currentDate = new Date(dateKey);
        currentDate.setHours(0, 0, 0, 0); // Normalize

        if (currentDate <= today) {
          // Past dates without record are absent
          newAttendance[dateKey] = "absent";
        } else {
          // Future dates: no status
        }
      }
    }

    setEmployeeAttendance(newAttendance);

    // Simulate short loading effect or just done
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);

  }, [calendarData, currentMonth, currentYear, employeeId, selectedEmployee]);


  // --- Helper: Parsing Dates ---
  // No longer need Firestore timestamp conversion hooks, usage of standard Date is fine.

  // --- Calendar Layout ---
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

  // --- Get Status Helper ---
  const getAttendanceStatusForDate = useCallback((date) => {
    if (!date || !employeeId) return "absent";
    const dateKey = getLocalDateKey(date);
    return employeeAttendance[dateKey] || "absent";
  }, [employeeId, employeeAttendance]);

  // --- Navigation Handlers ---
  const handlePrevMonth = useCallback(() => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }, [currentMonth]);

  const handleNextMonth = useCallback(() => {
    const today = new Date();
    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth();

    if (currentYear > thisYear || (currentYear === thisYear && currentMonth >= thisMonth)) {
      return;
    }

    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }, [currentMonth, currentYear]);

  const isNextDisabled = (() => {
    const today = new Date();
    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth();
    return (currentYear > thisYear || (currentYear === thisYear && currentMonth >= thisMonth));
  })();

  // --- Event Handling ---
  const handleDayClick = useCallback((date) => {
    if (!date) return;
    setSelectedDate(date);
    setEventForm({ title: "", theme: "blue" });
    setIsModalOpen(true);
  }, []);

  const handleAddEvent = useCallback(async () => {
    if (!eventForm.title.trim() || !selectedDate) {
      showToast("error", "Please add an event title");
      return;
    }
    setLoading(true);
    try {
      await dispatch(
        createEvent({
          event_title: eventForm.title,
          event_theme: eventForm.theme,
          event_date: selectedDate,
        })
      ).unwrap();

      setIsModalOpen(false);
      setEventForm({ title: "", theme: "blue" });
    } catch (err) {
      console.error("Error adding event:", err);
      showToast("error", "Failed to add event");
    } finally {
      setLoading(false);
    }
  }, [eventForm, selectedDate, dispatch, showToast]);

  const handleDeleteEvent = useCallback(async (id) => {
    showConfirm("Delete this event?", async () => {
      try {
        await dispatch(deleteEvent(id)).unwrap();
        showToast("success", "Event deleted successfully");
      } catch (err) {
        console.error("Error deleting event:", err);
        showToast("error", "Failed to delete event");
      }
    });
  }, [dispatch, showConfirm, showToast]);

  // --- Parsed Events (Normalization) ---
  const parsedEvents = useMemo(() => {
    return events
      .map((ev) => {
        let eventDate = null;
        if (ev.event_date) {
          // Handle various string/object formats safely
          eventDate = new Date(ev.event_date);
        }
        if (!eventDate || isNaN(eventDate.getTime())) return null;
        return { ...ev, event_date: eventDate };
      })
      .filter(Boolean);
  }, [events]);

  const parsedEmployees = useMemo(() => {
    return employees.map((emp) => ({
      ...emp,
      DateOfBirth: emp.DateOfBirth ? new Date(emp.DateOfBirth) : null,
    }));
  }, [employees]);

  return {
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
    isNextDisabled,

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