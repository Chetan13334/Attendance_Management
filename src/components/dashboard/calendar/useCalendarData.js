import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastLoadedWeek, setLastLoadedWeek] = useState(null);

  const employeeState = useSelector((state) => state.employees);
  
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
        console.log("Loaded Employees directly:", list);
      } catch (e) {
        console.error("Error loading Employee_Details:", e);
      } finally {
        setLoading(false);
      }
    };

    if (employeeState.list && employeeState.list.length > 0) {
      setEmployees(employeeState.list);
      console.log("Loaded Employees from Redux:", employeeState.list);
      setLoading(false);
    } else {
   
      fetchEmployees();
    }
    dispatch(listenToEmployees());
  }, [dispatch, employeeState.list]);

  
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

  
  const fetchAttendanceForWeek = useCallback(async () => {
    if (!employees.length || !daysOfWeek.length) return;

    const weekKey = daysOfWeek.map(day => day.fullDate).join('-');
    if (lastLoadedWeek === weekKey) {
      return;
    }

    setLoading(true);
    const newAttendance = {};

    const onTimeThreshold = 10 * 60; 
    const officeEnd = 18 * 60;       

    const toDate = (ts) => {
      if (!ts) return null;
      if (typeof ts.toDate === "function") return ts.toDate();
      return new Date(ts);
    };

    const determineStatus = (checkIn, onTimeThreshold, officeEnd) => {
      let status = "absent";
      
      if (checkIn && !isNaN(checkIn.getTime())) {
        const totalMins = checkIn.getHours() * 60 + checkIn.getMinutes();
      
        const lateThreshold = 10 * 60 + 15;
        
        if (totalMins >= onTimeThreshold && totalMins <= lateThreshold) {
          status = "on-time";
        } else if (totalMins > lateThreshold) {
          status = "late";
        }
        
        else if (totalMins < onTimeThreshold) {
          status = "on-time";
        }
      }
      
      return status;
    };

    try {
      
      const attendancePromises = daysOfWeek.map(async (day) => {
        const dateKey = day.fullDate;
        console.log("Checking attendance for date:", dateKey);
        
        const dateDocRef = doc(db, "Employee_CheckIn_CheckOut", dateKey);
        const empRecColRef = collection(dateDocRef, "employee_records");

        const empSnap = await getDocs(empRecColRef);
        console.log(`Found ${empSnap.size} employee records for ${dateKey}`);

        const dayAttendance = {};
        
        // Initialize all employees as absent for this date
        employees.forEach(employee => {
          dayAttendance[employee.id] = "absent";
        });

        // Update status for employees who have records
        empSnap.forEach((empDoc) => {
          const empIdFromDoc = empDoc.id;
          const data = empDoc.data();
          console.log("Processing employee record:", empIdFromDoc, data);

          const checkIn = toDate(data?.CheckIn);
          const checkOut = toDate(data?.CheckOut);
          console.log("CheckIn time:", checkIn);

          const employee = employees.find((e) => e.empId === empIdFromDoc);
          if (!employee) {
            const employeeById = employees.find((e) => e.id === empIdFromDoc);
            if (employeeById) {
              console.log("Found employee by document ID:", employeeById);
              const status = determineStatus(checkIn, onTimeThreshold, officeEnd);
              dayAttendance[employeeById.id] = status;
            } else {
              console.log("Could not find employee for ID:", empIdFromDoc);
            }
            return;
          }

          const status = determineStatus(checkIn, onTimeThreshold, officeEnd);
          console.log("Determined status:", status);
          dayAttendance[employee.id] = status;
        });

        return { dateKey, attendance: dayAttendance };
      });

      // Wait for all attendance data to be fetched
      const attendanceResults = await Promise.all(attendancePromises);

      // Combine all attendance data
      attendanceResults.forEach(({ dateKey, attendance: dayAttendance }) => {
        Object.keys(dayAttendance).forEach((empId) => {
          if (!newAttendance[empId]) newAttendance[empId] = {};
          newAttendance[empId][dateKey] = dayAttendance[empId];
        });
      });

      console.log("Final attendance data:", newAttendance);
      setAttendance(newAttendance);
      setLastLoadedWeek(weekKey);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  }, [employees, daysOfWeek, lastLoadedWeek]);

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

  // Only show loading state when we're actively fetching data
  const showLoading = loading && (employees.length === 0 || daysOfWeek.length === 0);

  return {
    loading: showLoading,
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