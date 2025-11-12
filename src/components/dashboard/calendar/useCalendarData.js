import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
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
   Helper: Get initials for avatar
   -------------------------------------------------------------- */
const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("");

/* --------------------------------------------------------------
   Attendance UI definitions (used by the UI components)
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
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ----------------------------------------------------------
     1. Load Employee_Details → array of {id, empId, name, avatarColor}
     ---------------------------------------------------------- */
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const snap = await getDocs(collection(db, "Employee_Details"));
        const list = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id, // This is the document ID
            empId: String(data?.EmployeeID ?? data?.employeeId ?? d.id), // Use EmployeeID field or fallback to document ID
            name: data?.Name ?? data?.name ?? "Unknown",
            avatarColor: "bg-purple-300",
          };
        });
        setEmployees(list);
        console.log("Loaded Employees:", list);
      } catch (e) {
        console.error("Error loading Employee_Details:", e);
      }
    };

    fetchEmployees();
    dispatch(listenToEmployees());
  }, [dispatch]);

  /* ----------------------------------------------------------
     2. Build Mon-Fri array for the current week
     ---------------------------------------------------------- */
  useEffect(() => {
    const generateWeek = (start) => {
      const days = [];
      const date = new Date(start);
      const dow = date.getDay();
      const mondayOffset = dow === 0 ? -6 : 1 - dow; // Monday = 0 offset
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
    };

    setDaysOfWeek(generateWeek(currentWeekStart));
  }, [currentWeekStart]);

  /* ----------------------------------------------------------
     3. Fetch attendance for the whole week
     ---------------------------------------------------------- */
  const fetchAttendanceForWeek = useCallback(async () => {
    if (!employees.length || !daysOfWeek.length) return;

    setLoading(true);
    const newAttendance = {};

    // thresholds (minutes from midnight)
    const onTimeThreshold = 10 * 60; // 10:00 AM
    const officeEnd = 18 * 60;       // 6:00 PM

    // Helper: convert Firestore Timestamp → Date (handles both Timestamp & plain object)
    const toDate = (ts) => {
      if (!ts) return null;
      if (typeof ts.toDate === "function") return ts.toDate();
      return new Date(ts);
    };

    // Helper function to determine status based on check-in time
    const determineStatus = (checkIn, onTimeThreshold, officeEnd) => {
      let status = "absent";
      
      if (checkIn && !isNaN(checkIn.getTime())) {
        const totalMins = checkIn.getHours() * 60 + checkIn.getMinutes();
        
        // Update logic to match requirements:
        // "on-time" for check-in between 10:00 AM to 10:15 AM
        // "late" for check-in after 10:15 AM
        const lateThreshold = 10 * 60 + 15; // 10:15 AM
        
        if (totalMins >= onTimeThreshold && totalMins <= lateThreshold) {
          status = "on-time";
        } else if (totalMins > lateThreshold) {
          status = "late";
        }
        // If check-in is before 10:00 AM, it's still considered "on-time"
        else if (totalMins < onTimeThreshold) {
          status = "on-time";
        }
      }
      
      return status;
    };

    for (const day of daysOfWeek) {
      const dateKey = day.fullDate;                     // e.g. "2025-11-12"
      console.log("Checking attendance for date:", dateKey);
      
      const dateDocRef = doc(db, "Employee_CheckIn_CheckOut", dateKey);
      const empRecColRef = collection(dateDocRef, "employee_records");

      // ------------------------------------------------------------------
      // 1. Get **all** employee docs that exist for this date
      // ------------------------------------------------------------------
      const empSnap = await getDocs(empRecColRef);
      console.log(`Found ${empSnap.size} employee records for ${dateKey}`);

      // Initialise every employee with "absent"
      employees.forEach((emp) => {
        if (!newAttendance[emp.id]) newAttendance[emp.id] = {};
        newAttendance[emp.id][dateKey] = "absent";
      });

      // ------------------------------------------------------------------
      // 2. Process the docs that *do* exist
      // ------------------------------------------------------------------
      empSnap.forEach((empDoc) => {
        const empIdFromDoc = empDoc.id;                 // <-- this is the EmployeeID string
        const data = empDoc.data();
        console.log("Processing employee record:", empIdFromDoc, data);

        // Use correct field names: CheckIn and CheckOut (with capital C)
        const checkIn = toDate(data?.CheckIn);
        const checkOut = toDate(data?.CheckOut);
        console.log("CheckIn time:", checkIn);

        // Find the employee entry that matches this doc id
        const employee = employees.find((e) => e.empId === empIdFromDoc);
        if (!employee) {
          // If not found by empId, try to match by document ID
          const employeeById = employees.find((e) => e.id === empIdFromDoc);
          if (employeeById) {
            console.log("Found employee by document ID:", employeeById);
            const status = determineStatus(checkIn, onTimeThreshold, officeEnd);
            if (!newAttendance[employeeById.id]) newAttendance[employeeById.id] = {};
            newAttendance[employeeById.id][dateKey] = status;
          } else {
            console.log("Could not find employee for ID:", empIdFromDoc);
          }
          return;
        }

        const status = determineStatus(checkIn, onTimeThreshold, officeEnd);
        console.log("Determined status:", status);
      
        if (!newAttendance[employee.id]) newAttendance[employee.id] = {};
        newAttendance[employee.id][dateKey] = status;
      });
    }

    console.log("Final attendance data:", newAttendance);
    setAttendance(newAttendance);
    setLoading(false);
  }, [employees, daysOfWeek]);

  // Run once employees + week are ready
  useEffect(() => {
    if (employees.length && daysOfWeek.length) {
      fetchAttendanceForWeek();
    } else {
      setLoading(false);
    }
  }, [employees, daysOfWeek, fetchAttendanceForWeek]);

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
    formattedStudents,                 // Return formattedStudents instead of employees
    handleCellClick,
    handlePreviousWeek,
    handleNextWeek,
    handleToday,
    handleOpenCalendarModal,
    attendanceStatuses,
  };
};