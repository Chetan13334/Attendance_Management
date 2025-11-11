import React from "react";

// Helper function to get initials for the avatar background
const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("");

const StudentProfileUI = ({ student, isSelected, onToggle }) => (
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

export default StudentProfileUI;