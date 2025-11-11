import React from "react";
import CalendarContainer from "./Calendar.container";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import LegendBar from "../../common/LegendBar";
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

// Attendance Cell Component
const AttendanceCell = ({
  statusKey,
  date,
  studentId,
  isHoliday,
  isFuture,
  holidayDetail,
  onClick,
}) => {
  const status = attendanceStatuses[statusKey] || attendanceStatuses["on-time"];

  const handleClick = () => {
    if (!isFuture && !isHoliday) {
      onClick(studentId, date, statusKey);
    }
  };

  if (isFuture) {
    return (
      <div className="flex flex-col justify-center items-center p-0 text-xs font-medium h-full border-r border-gray-100 bg-gray-50">
        <span className="text-gray-400 text-lg">----</span>
      </div>
    );
  }

  if (isHoliday) {
    return (
      <div className="flex flex-col justify-center items-center p-0 text-xs font-medium h-full border-r border-gray-100 bg-gray-100 text-gray-500">
        <span className="leading-tight font-semibold">Holiday</span>
        {holidayDetail && (
          <span className="text-[10px] font-normal mt-0.5">({holidayDetail})</span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`
        flex flex-col justify-center items-center p-0 text-xs font-medium h-full cursor-pointer
        border-r border-gray-100 transition duration-100 ease-in-out
        ${status.classes}
        ${statusKey !== "on-time" ? "border-l-4" : "border-l-transparent"}
      `}
      onClick={handleClick}
    >
      <span className="leading-tight">{status.label}</span>
      {status.detail && (
        <span className="text-[10px] font-normal mt-0.5 text-gray-500">{status.detail}</span>
      )}
    </div>
  );
};

// Student Profile Component
const StudentProfile = ({ student, isSelected, onToggle }) => (
  <div className="flex items-center p-3 text-sm font-medium border-r border-gray-200">
    <input
      type="checkbox"
      checked={isSelected}
      onChange={() => onToggle(student.id)}
      className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 mr-3 cursor-pointer"
    />
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 ${student.avatarColor}`}
    >
      {getInitials(student.name)}
    </div>
    <span className="text-gray-800">{student.name}</span>
  </div>
);

export default function MainCalender() {
  return <CalendarContainer />;
}