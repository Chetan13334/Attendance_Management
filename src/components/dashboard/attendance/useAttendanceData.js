// src/components/dashboard/attendance/useAttendanceData.js

import { useSelector } from "react-redux";

// Dummy data to simulate attendance records
const DUMMY_RECORDS = [
  { time: "09:05 AM", status: "Present", remarks: "On time" },
  { time: "09:12 AM", status: "Late", remarks: "5 min late" },
  { time: "-", status: "Absent", remarks: "Not marked" },
  { time: "09:00 AM", status: "Present", remarks: "Perfect" },
  { time: "09:10 AM", status: "Late", remarks: "Slight delay" },
  { time: "09:03 AM", status: "Present", remarks: "On time" },
  { time: "-", status: "Absent", remarks: "Leave applied" },
  { time: "08:59 AM", status: "Present", remarks: "Early" },
  { time: "09:06 AM", status: "Present", remarks: "On time" },
  { time: "09:02 AM", status: "Present", remarks: "Good" },
  { time: "-", status: "Absent", remarks: "No info" },
  { time: "09:15 AM", status: "Late", remarks: "Traffic" },
  { time: "09:00 AM", status: "Present", remarks: "Excellent" },
  { time: "09:07 AM", status: "Present", remarks: "Good" },
];

export const useAttendanceData = () => {
  const employees = useSelector((state) => state.employees.list);

  const mergedRecords = employees.map((emp, index) => {
    const dummy = DUMMY_RECORDS[index] || {
      time: "-",
      status: "Absent",
      remarks: "Not marked",
    };

    return {
      id: emp.id || emp.EmployeeID || "",
      employeeId: emp.EmployeeID || emp.employeeId || "",
      name: emp.Name || emp.name || "",
      photo: emp.Photo || "", // ✅ New field for Cloudinary image
      date: new Date().toLocaleDateString(),
      ...dummy,
    };
  });

  return { mergedRecords };
};

// ✅ Helper for status color badges
export const getStatusClasses = (status) => {
  if (status === "Present") return "bg-green-100 text-green-800";
  if (status === "Absent") return "bg-red-100 text-red-800";
  if (status === "Late") return "bg-yellow-100 text-yellow-800";
  return "bg-gray-100 text-gray-800";
};
