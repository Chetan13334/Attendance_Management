import React from "react";

// Helper function to get initials for the avatar background
const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("");

const StudentProfileUI = ({ student, isSelected, onToggle, onNameClick }) => (
  <div className="flex items-center p-3 text-sm font-medium border-r border-gray-200">
   
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold  ${student.avatarColor}`}
    >
      {getInitials(student.name)}
    </div>
    <span className="text-gray-800 cursor-pointer hover:text-blue-600" onClick={() => onNameClick(student.id)}>
      {student.name}
    </span>
  </div>
);

export default StudentProfileUI;