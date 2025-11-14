import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BackBTN } from "../BackBTN";
import LegendBar from "../../../components/common/LegendBar";

const EmployeeCalendarCom = ({
  currentMonth,
  currentYear,
  daysOfWeek,
  weeks,
  monthNames,
  handlePrevMonth,
  handleNextMonth,
  selectedEmployee,
  getAttendanceStatusForDate,
  employeeAttendance,
  loading,
}) => {
  // Default values and setup remain the same
  const safeMonthNames = monthNames || [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const safeCurrentMonth = currentMonth !== undefined ? currentMonth : new Date().getMonth();
  const safeCurrentYear = currentYear || new Date().getFullYear();
  const safeDaysOfWeek = daysOfWeek || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const safeWeeks = weeks || [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // --- UPDATED: LIGHT ATTENDANCE STATUS STYLING (Small Rounded Badge) ---
  const getAttendanceBadgeClass = (status) => {
    switch (status) {
      case "on-time":
        return "bg-green-100 text-green-800"; // Subtle green for professionalism
      case "late":
        return "bg-yellow-100 text-yellow-800";
      case "absent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getAttendanceLabel = (status) => {
    switch (status) {
      case "on-time":
        return "On Time";
      case "late":
        return "Late";
      case "absent":
        return "Absent";
      default:
        return "Scheduled";
    }
  };

  
 

  return (
   
    <div>
        
    
      <div className="container mx-auto bg-white rounded-xl shadow-md overflow-hidden max-w-7xl">
        <BackBTN />


        <div className="px-1 py-1 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200">
          
          
          <div className="flex items-end gap-3 mt-3 sm:mt-0">
            <button
              onClick={handlePrevMonth}
              className="flex items-end p-1 rounded-full text-gray-600 hover:bg-gray-100 transition duration-200 ease-in-out"
              aria-label="Previous Month"
              disabled={loading}
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                {safeMonthNames[safeCurrentMonth]} <span className="font-normal text-gray-500">{safeCurrentYear}</span>
              </h2>
             
            </div>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-full text-gray-600 hover:bg-gray-100 transition duration-200 ease-in-out"
              aria-label="Next Month"
              disabled={loading}
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="mb-2">
          <LegendBar /></div>
           {selectedEmployee && (
                <p className="text-sm text-gray-600 mt-2 ml-10 mb-2">
                  <span className="font-semibold text-gray-800 tracking-tight ml-10">Employee:</span> {selectedEmployee.name || selectedEmployee.Name || "Unknown Employee"}
                </p>
              )}
        </div>


        {/* Calendar Grid - Subtle separators, increased cell height for attractiveness */}
        <table className="w-full table-fixed border-collapse">
          {/* Days of Week Header - Softer background, refined text */}
          <thead>
            <tr>
              {safeDaysOfWeek.map((day, i) => (
                <th
                  key={i}
                  className="p-4 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {safeWeeks.map((week, wi) => (
              <tr key={wi} className="border-b border-gray-200 last:border-b-0">
                {week.map((date, di) => {
                  const isCurrentMonth = date && date.getMonth() === safeCurrentMonth;

                  const isToday =
                    date &&
                    date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear();

                  const isFutureDate = date && date > today;

                  const attendanceStatus = date
                    ? getAttendanceStatusForDate(date)
                    : null;

                  const badgeClass = getAttendanceBadgeClass(attendanceStatus);
                  const attendanceLabel = isFutureDate ? "Future" : getAttendanceLabel(attendanceStatus);

                  return (
                    <td
                      key={di}
                      className={`
                        p-4 h-40 md:h-44 overflow-hidden align-top relative 
                        border-r border-gray-200 last:border-r-0
                        ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white text-gray-900 hover:bg-gray-50 transition duration-200'} 
                        ${isFutureDate ? 'cursor-not-allowed' : ''}
                      `}
                    >
                      {date ? (
                        <div className="flex flex-col h-full">
                          {/* Date Number - Circular highlight for today, clean and attractive */}
                          <div
                            className={`text-xl font-semibold w-8 h-8 flex items-center justify-center rounded-full mb-3
                              ${isToday
                                ? "bg-blue-500 text-white" // Professional blue accent for today
                                : "text-gray-800"
                              }
                            `}
                          >
                            {date.getDate()}
                          </div>

                          {/* Attendance Status - Subtle, pill-shaped badge with soft colors */}
                          <div className="w-full">
                            {loading ? (
                              <div className="text-xs font-medium px-3 py-1 rounded-full bg-gray-200 animate-pulse w-16 h-5"></div>
                            ) : date && !isFutureDate && attendanceStatus ? (
                              <span className={`text-xs font-medium px-3 py-1 rounded-full ${badgeClass}`}>
                                {getAttendanceLabel(attendanceStatus)}
                              </span>
                            ) : isFutureDate ? (
                              <span className={`text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-500`}>
                                {attendanceLabel}
                              </span>
                            ) : null}
                          </div>

                          {/* Data Metric (Total Hours) - Clean, minimal display */}
                          <div className="flex-grow w-full mt-2 overflow-hidden text-sm text-gray-600">
                            {loading ? (
                              <p className="pt-1 h-4 bg-gray-200 animate-pulse rounded w-3/4"></p>
                            ) : date && !isFutureDate ? (
                              <p className="pt-1">
                                {/* Uncomment and customize as needed */}
                                {/* {attendanceStatus === 'on-time' && 'Total Hrs: 8.0'}
                                {attendanceStatus === 'late' && 'Total Hrs: 7.5'} */}
                                {/* {attendanceStatus === 'absent' && <span className="text-gray-500 italic">No Hours Logged</span>}
                                {attendanceStatus === null && <span className="text-gray-400 italic">N/A</span>} */}
                              </p>
                            ) : null}
                            {/* {isFutureDate && <p className="text-gray-400 italic">Expected Hrs: 8.0</p>} */}
                          </div>
                        </div>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeCalendarCom;