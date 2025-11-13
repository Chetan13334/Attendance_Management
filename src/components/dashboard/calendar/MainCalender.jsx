import React from "react";
import CalendarContainer from "./Calendar.container";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import LegendBar from "../../common/LegendBar";
import { listenToEmployees } from "../../../redux/slices/employeeSlice";

// Helper for initials
const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("");


const attendanceStatuses = {
  "on-time": {
    label: "On time",
    detail: null,
    classes: "bg-green-200 text-green-800 border-l-green-500",
  },
  "absent": {
    label: "Absent",
    detail: null,
    classes: "bg-red-50 text-red-800 border-l-red-500",
  },
  "late": {
    label: "Late",
    detail: null,
    classes: "bg-yellow-50 text-yellow-800 border-l-yellow-400",
  },
};

export default function MainCalender() {
  return <CalendarContainer />;
}