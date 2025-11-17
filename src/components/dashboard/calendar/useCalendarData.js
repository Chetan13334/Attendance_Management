import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  collection,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { listenToEmployees } from "../../../redux/slices/employeeSlice";

/* --------------------------------------------------------------
   Helper: YYYY-MM-DD string (local timezone)
-------------------------------------------------------------- */
const getLocalDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/* --------------------------------------------------------------
   Helper: Get Monday of the week
-------------------------------------------------------------- */
const getMonday = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0); // Normalize
  return d;
};

/* --------------------------------------------------------------
   Helper: Get initials for avatar
-------------------------------------------------------------- */
const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("");

/* --------------------------------------------------------------
   Attendance UI definitions
-------------------------------------------------------------- */
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

/* --------------------------------------------------------------
   Hook
-------------------------------------------------------------- */
export const useCalendarData = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedStudents, setSelectedStudents] = useState({});
  const [attendance, setAttendance] = useState({});
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getMonday(new Date()));
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ----------------------------------------------------------
     1. Load Employees
  ---------------------------------------------------------- */
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const snap = await getDocs(collection(db, "Employee_Details"));
        const list = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            empId: String(data?.EmployeeID ?? data?.employeeId ?? d.id),
            name: data?.Name ?? data?.name ?? "Unknown",
            avatarColor: "bg-purple-300",
          };
        });

        setEmployees(list);
      } catch (e) {
        console.error("Error loading Employee_Details:", e);
      }
    };

    fetchEmployees();
    dispatch(listenToEmployees());
  }, [dispatch]);

  /* ----------------------------------------------------------
     2. Build Mon-Fri for current week
  ---------------------------------------------------------- */
  useEffect(() => {
    const generateWeek = (start) => {
      const days = [];
      const monday = getMonday(start);

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

    setDaysOfWeek(generateWeek(currentWeekStart));
  }, [currentWeekStart]);

  /* ----------------------------------------------------------
     3. Fetch attendance for week
  ---------------------------------------------------------- */
  const fetchAttendanceForWeek = useCallback(async () => {
    if (!employees.length || !daysOfWeek.length) return;

    setLoading(true);
    const newAttendance = {};

    const onTimeThreshold = 10 * 60; // 10:00
    const lateThreshold = 10 * 60 + 15; // 10:15

    const toDate = (ts) => {
      if (!ts) return null;
      if (typeof ts.toDate === "function") return ts.toDate();
      return new Date(ts);
    };

    const determineStatus = (checkIn) => {
      if (!checkIn || isNaN(checkIn.getTime())) return "absent";

      const totalMins = checkIn.getHours() * 60 + checkIn.getMinutes();

      if (totalMins <= onTimeThreshold) return "on-time";
      if (totalMins <= lateThreshold) return "on-time";
      return "late";
    };

    for (const day of daysOfWeek) {
      const dateKey = day.fullDate;
      const dateDocRef = doc(db, "Employee_CheckIn_CheckOut", dateKey);
      const empRecColRef = collection(dateDocRef, "employee_records");

      const empSnap = await getDocs(empRecColRef);

      employees.forEach((emp) => {
        if (!newAttendance[emp.id]) newAttendance[emp.id] = {};
        newAttendance[emp.id][dateKey] = "absent";
      });

      empSnap.forEach((empDoc) => {
        const data = empDoc.data();
        const checkIn = toDate(data?.CheckIn);

        const employee = employees.find((e) => e.empId === empDoc.id);
        if (!employee) return;

        newAttendance[employee.id][dateKey] = determineStatus(checkIn);
      });
    }

    setAttendance(newAttendance);
    setLoading(false);
  }, [employees, daysOfWeek]);

  useEffect(() => {
    if (employees.length && daysOfWeek.length) {
      fetchAttendanceForWeek();
    } else {
      setLoading(false);
    }
  }, [employees, daysOfWeek, fetchAttendanceForWeek]);

  /* ----------------------------------------------------------
     Navigation: BLOCK FUTURE WEEKS
  ---------------------------------------------------------- */

  // Always check if going +7 days would exceed current week
  const isNextWeekDisabled = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentMonday = getMonday(today);

    const nextMonday = new Date(currentWeekStart);
    nextMonday.setDate(currentWeekStart.getDate() + 7);
    const nextMondayDate = getMonday(nextMonday);
    nextMondayDate.setHours(0, 0, 0, 0);

    return nextMondayDate > currentMonday;
  }, [currentWeekStart]);

  const handlePreviousWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekStart(getMonday(prev));
  };

  const handleNextWeek = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentMonday = getMonday(today);

    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    const nextMonday = getMonday(next);
    nextMonday.setHours(0, 0, 0, 0);

    if (nextMonday > currentMonday) {
      return; // BLOCK FUTURE
    }

    setCurrentWeekStart(nextMonday);
  };

  const handleToday = () => {
    setCurrentWeekStart(getMonday(new Date()));
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
     Auto-correct if somehow in future (safety net)
  ---------------------------------------------------------- */
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentMonday = getMonday(today);
    const displayedMonday = getMonday(currentWeekStart);
    displayedMonday.setHours(0, 0, 0, 0);

    if (displayedMonday > currentMonday) {
      setCurrentWeekStart(currentMonday);
    }
  }, [currentWeekStart]);

  /* ----------------------------------------------------------
     Final return
  ---------------------------------------------------------- */
  const formattedStudents = employees.map((emp) => ({
    ...emp,
    initials: getInitials(emp.name),
  }));

  return {
    loading,
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