import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { listenToAttendance } from "../../../redux/slices/attendanceSlice";

const getLocalDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const useAttendanceData = () => {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employees.list || []);
  const attendanceList = useSelector((state) => state.attendance.list || []);
  const attendanceLoading = useSelector((state) => state.attendance.loading || false);


  const [currentDate, setCurrentDate] = useState(new Date());
  const [forceRefresh, setForceRefresh] = useState(0);

  useEffect(() => {
    const now = new Date();
    console.log("Component mounted, setting current date to:", now.toDateString());
    setCurrentDate(now);

    setForceRefresh(prev => prev + 1);
  }, []);


  useEffect(() => {
    const checkDateChange = () => {
      const now = new Date();

      if (now.toDateString() !== currentDate.toDateString()) {
        console.log("Date changed from", currentDate.toDateString(), "to", now.toDateString(), "- updating current date");
        setCurrentDate(now);
      }
    };

    window.addEventListener('focus', checkDateChange);


    const interval = setInterval(checkDateChange, 60000);

    return () => {
      window.removeEventListener('focus', checkDateChange);
      clearInterval(interval);
    };
  }, [currentDate]);

  useEffect(() => {
    console.log("Setting up attendance listener for date:", currentDate, "forceRefresh:", forceRefresh);

    const result = dispatch(listenToAttendance(currentDate));


    let cleanup;
    result.then((unsubscribe) => {
      console.log("Attendance listener set up successfully");
      cleanup = unsubscribe;
    }).catch((error) => {
      console.error("Failed to set up attendance listener:", error);
    });


    return () => {
      console.log("Cleaning up attendance listener");
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [dispatch, currentDate, forceRefresh]);


  useEffect(() => {
    console.log("Employees updated:", employees.length);
    console.log("Attendance list updated:", attendanceList.length);
    if (attendanceList.length > 0) {
      console.log("First attendance record:", attendanceList[0]);
    }
  }, [employees, attendanceList]);


  const mergedRecords = useMemo(() => {
    console.log("Recalculating merged records with", employees.length, "employees and", attendanceList.length, "attendance records");
    return employees.map((emp) => {

      const att = attendanceList.find(a => {
        const matchId = a.employeeId === emp.empId || a.employeeId === emp.id;
        // Also match the date to avoid picking up records from other loaded days
        const matchDate = a.date === getLocalDateKey(currentDate);
        return matchId && matchDate;
      });

      console.log(`Matching employee ${emp.id} with attendance:`, att);

      let status = "Absent";
      let time = "-";
      let remarks = "Not marked";

      if (att?.CheckIn) {

        let checkIn;
        if (typeof att.CheckIn.toDate === "function") {
          checkIn = att.CheckIn.toDate();
        } else if (att.CheckIn.seconds) {
          checkIn = new Date(att.CheckIn.seconds * 1000);
        } else {
          checkIn = new Date(att.CheckIn);
        }


        if (checkIn instanceof Date && !isNaN(checkIn.getTime())) {
          time = checkIn.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          });

          const mins = checkIn.getHours() * 60 + checkIn.getMinutes();
          const cutoff = 10 * 60 ;

          if (mins <= cutoff) {
            status = "On time";
            remarks = "On time";
          } else {
            status = "Late";
            const diff = mins - cutoff;

            if (diff < 60) {
              remarks = `${diff} min late`;
            } else {
              remarks = `${Math.floor(diff / 60)} hr ${diff % 60} min late`;
            }
          }
        } else {

          status = "Absent";
          time = "-";
          remarks = "Invalid data";
        }
      }


      let checkOutTime = "-";
      if (att?.CheckOut) {
        let checkOut;
        if (typeof att.CheckOut.toDate === "function") {
          checkOut = att.CheckOut.toDate();
        } else if (att.CheckOut.seconds) {
          checkOut = new Date(att.CheckOut.seconds * 1000);
        } else {
          checkOut = new Date(att.CheckOut);
        }

        if (checkOut instanceof Date && !isNaN(checkOut.getTime())) {
          checkOutTime = checkOut.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          });
        }
      }


      const formattedDate = currentDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      return {
        id: emp.id || '',
        employeeId: emp.EmployeeID || emp.employeeId || emp.empId || emp.id || '',
        name: emp.Name || emp.name || 'Unknown',
        photo: emp.Photo || emp.photo || null,
        date: formattedDate,
        checkIn: time,
        checkOut: checkOutTime,
        status,
        remarks,
        dateOfJoining: emp.DateOfJoining || null,
      };
    });
  }, [employees, attendanceList, currentDate]);

  return { mergedRecords, loading: attendanceLoading };
};


export const getStatusClasses = (status) => {
  if (status === "On time") return "bg-green-100 text-green-800";
  if (status === "Late") return "bg-yellow-100 text-yellow-800";
  if (status === "Absent") return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
};