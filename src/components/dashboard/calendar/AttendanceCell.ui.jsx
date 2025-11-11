import React, { useCallback } from "react";

const AttendanceCellUI = ({
  statusKey,
  date,
  studentId,
  isHoliday,
  isFuture,
  holidayDetail,
  onClick,
  attendanceStatuses
}) => {
  const status = attendanceStatuses[statusKey] || attendanceStatuses["on-time"];

  const handleClick = useCallback(() => {
    if (!isFuture && !isHoliday) {
      onClick(studentId, date, statusKey);
    }
  }, [studentId, date, statusKey, onClick, isFuture, isHoliday]);

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

export default AttendanceCellUI;