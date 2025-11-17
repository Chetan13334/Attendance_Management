import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  collection,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { listenToEmployees } from "../../../redux/slices/employeeSlice";

/* --------------------------------------------------------------
   Helper: YYYY-MM-DD string
-------------------------------------------------------------- */
const getLocalDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/* --------------------------------------------------------------
   Helper: Get Monday of the week (THIS WAS MISSING!)
-------------------------------------------------------------- */
const getMonday = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Sunday fix
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

/* --------------------------------------------------------------
   Helper: Get initials
-------------------------------------------------------------- */
const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("");

/* --------------------------------------------------------------
   Attendance Statuses
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
   Main Hook
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
  const [lastLoadedWeek, setLastLoadedWeek] = useState(null);

  const employeeState = useSelector((state) => state.employees || { list: [] });

  /* ----------------------------------------------------------
     Load Employees
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
      } finally {
        setLoading(false);
      }
    };

    if (employeeState.list?.length > 0) {
      setEmployees(employeeState.list);
      setLoading(false);
    } else {
      fetchEmployees();
    }

    dispatch(listenToEmployees());
  }, [dispatch, employeeState.list]);

  /* ----------------------------------------------------------
     Generate Week Days (Mon - Fri)
  ---------------------------------------------------------- */
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

  /* ----------------------------------------------------------
     Fetch Attendance for Current Week
  ---------------------------------------------------------- */
  const fetchAttendanceForWeek = useCallback(async () => {
    if (!employees.length || !daysOfWeek.length) return;

    const weekKey = daysOfWeek.map(d => d.fullDate).sort().join(",");
    if (lastLoadedWeek === weekKey) return;

    setLoading(true);
    const newAttendance = {};

    const toDate = (ts) => (ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null);

    const determineStatus = (checkIn) => {
      if (!checkIn || isNaN(checkIn.getTime())) return "absent";
      const mins = checkIn.getHours() * 60 + checkIn.getMinutes();
      return mins <= 10 * 60 + 15 ? "on-time" : "late";
    };

    try {
      for (const day of daysOfWeek) {
        const dateDocRef = doc(db, "Employee_CheckIn_CheckOut", day.fullDate);
        const empRecColRef = collection(dateDocRef, "employee_records");
        const snap = await getDocs(empRecColRef);

        // Initialize all as absent
        employees.forEach(emp => {
          if (!newAttendance[emp.id]) newAttendance[emp.id] = {};
          newAttendance[emp.id][day.fullDate] = "absent";
        });

        // Update present employees
        snap.forEach(doc => {
          const data = doc.data();
          const emp = employees.find(e => e.empId === doc.id || e.id === doc.id);
          if (emp && data?.CheckIn) {
            const checkIn = toDate(data.CheckIn);
            newAttendance[emp.id][day.fullDate] = determineStatus(checkIn);
          }
        });
      }

      setAttendance(newAttendance);
      setLastLoadedWeek(weekKey);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  }, [employees, daysOfWeek, lastLoadedWeek]);

  useEffect(() => {
    fetchAttendanceForWeek();
  }, [fetchAttendanceForWeek]);

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
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekStart(getMonday(prev));
  };

  const handleNextWeek = () => {
    if (isNextWeekDisabled) return;
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(getMonday(next));
  };

  const handleToday = () => {
    setCurrentWeekStart(getMonday(new Date()));
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
     Safety: Never allow future week
  ---------------------------------------------------------- */
  useEffect(() => {
    const todayMonday = getMonday(new Date());
    const displayedMonday = getMonday(currentWeekStart);
    if (displayedMonday > todayMonday) {
      setCurrentWeekStart(todayMonday);
    }
  }, []);

  /* ----------------------------------------------------------
     Format Students
  ---------------------------------------------------------- */
  const formattedStudents = employees.map(emp => ({
    ...emp,
    initials: getInitials(emp.name),
  }));

  const showLoading = loading && employees.length === 0;

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