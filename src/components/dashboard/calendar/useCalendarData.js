import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { listenToEmployees } from "../../../redux/slices/employeeSlice";

// Helper function to get initials for the avatar background
const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("");

// Status mapping for styling and labels
const attendanceStatuses = {
  "on-time": {
    label: "On time",
    detail: null,
    classes: "text-gray-700 hover:bg-gray-50",
  },
  "absent-health": {
    label: "Absent",
    detail: "(Health Problem)",
    classes: "bg-red-50 text-red-800 border-l-red-500",
  },
  "late-traffic": {
    label: "Late",
    detail: "(Traffic Jam)",
    classes: "bg-yellow-50 text-yellow-800 border-l-yellow-400",
  },
  "absent-family": {
    label: "Absent",
    detail: "(Family Problem)",
    classes: "bg-red-50 text-red-800 border-l-red-500",
  },
  "late-family": {
    label: "Late",
    detail: "(Family Problem)",
    classes: "bg-yellow-50 text-yellow-800 border-l-yellow-400",
  },
};

export const useCalendarData = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedStudents, setSelectedStudents] = useState({});
  const [attendance, setAttendance] = useState({});
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date(2024, 9, 23));
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const employees = useSelector((state) => state.employees.list);

  const formattedStudents = employees.map((emp, index) => ({
    id: emp.id,
    name: emp.Name || emp.name || "Unknown Employee",
    avatarColor: "bg-purple-300",
  }));

  // Replace local Firestore listener with redux listener
  useEffect(() => {
    // subscribeToEmployees will setup the onSnapshot inside the slice
    const promise = dispatch(listenToEmployees());
    // If your thunk returns an unsubscribe function as payload, you can handle cleanup.
    // Here we guard for that possibility:
    let unsubscribe;
    promise.unwrap?.().then((payload) => {
      if (typeof payload === "function") unsubscribe = payload;
    }).catch(() => { /* ignore */ });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [dispatch]);

  // Generate week data (Monday to Friday only)
  useEffect(() => {
    const generateWeekData = (startDate) => {
      const days = [];
      const date = new Date(startDate);

      const dayOfWeek = date.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      date.setDate(date.getDate() + mondayOffset);

      for (let i = 0; i < 5; i++) {
        const currentDate = new Date(date);
        currentDate.setDate(date.getDate() + i);

        const dow = currentDate.getDay();
        const isWeekend = dow === 0 || dow === 6;

        const dayData = {
          date: currentDate.getDate(),
          day: currentDate.toLocaleDateString("en-US", { weekday: "long" }),
          fullDate: currentDate.toISOString().split("T")[0],
          month: currentDate.toLocaleDateString("en-US", { month: "short" }),
          year: currentDate.getFullYear(),
          index: i + 1,
          special: isWeekend ? "Holiday" : null,
          detail: isWeekend ? (dow === 0 ? "Sunday" : "Saturday") : null,
        };

        days.push(dayData);
      }

      return days;
    };

    setDaysOfWeek(generateWeekData(currentWeekStart));
  }, [currentWeekStart]);

  const handleToggleSelect = (studentId) => {
    setSelectedStudents((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleCellClick = useCallback((studentId, date, currentStatus) => {
    console.log(`Cell Clicked: Student ${studentId}, Date ${date}, Status ${currentStatus}`);

    const statusKeys = Object.keys(attendanceStatuses);
    const currentIndex = statusKeys.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusKeys.length;
    const nextStatus = statusKeys[nextIndex];

    const isHoliday = daysOfWeek.find((d) => d.date === date)?.special === "Holiday";

    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [date]: isHoliday ? "holiday" : nextStatus,
      },
    }));
  }, [daysOfWeek]);

  const handlePreviousWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newWeekStart);
  };

  const handleNextWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newWeekStart);
  };

  const handleToday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    setCurrentWeekStart(monday);
  };

  const handleOpenCalendarModal = () => {
    navigate("/calendarcom");
  };

  return {
    selectedStudents,
    attendance,
    currentWeekStart,
    daysOfWeek,
    formattedStudents,
    handleToggleSelect,
    handleCellClick,
    handlePreviousWeek,
    handleNextWeek,
    handleToday,
    handleOpenCalendarModal,
    attendanceStatuses,
    getInitials
  };
};