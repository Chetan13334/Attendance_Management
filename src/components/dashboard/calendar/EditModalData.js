import { updateAttendanceRecord, fetchAttendanceRecord } from "../../common/calendarcom/attendanceEditLogic";

/**
 * Updates or creates an attendance record for an employee on a specific date
 * @param {string} employeeId - The ID of the employee
 * @param {Date} date - The date of the attendance record
 * @param {string} checkIn - Check-in time in HH:mm format
 * @param {string} checkOut - Check-out time in HH:mm format
 * @returns {Promise<Object>} The updated attendance record
 */
export const saveAttendanceData = async (employeeId, date, checkIn, checkOut) => {
  try {
    return await updateAttendanceRecord(employeeId, date, checkIn, checkOut);
  } catch (error) {
    console.error("Error saving attendance data:", error);
    throw error;
  }
};

/**
 * Fetches an existing attendance record for an employee on a specific date
 * @param {string} employeeId - The ID of the employee
 * @param {Date} date 
 * @returns {Promise<Object|null>} 
 */
export const loadAttendanceData = async (employeeId, date) => {
  try {
    return await fetchAttendanceRecord(employeeId, date);
  } catch (error) {
    console.error("Error loading attendance data:", error);
    throw error;
  }
};

/**
 * Formats time from a date object or timestamp to HH:mm format
 * @param {Date|any} timeValue - The time value to format
 * @returns {string} Formatted time in HH:mm format
 */
export const formatTime = (timeValue) => {
  if (!timeValue) return "09:00";
  
  try {
    if (timeValue instanceof Date) {
      return timeValue.toTimeString().slice(0, 5);
    } else {
      return new Date(timeValue).toTimeString().slice(0, 5);
    }
  } catch (error) {
    console.error("Error formatting time:", error);
    return "09:00";
  }
};

/**
 * Gets the default time values for check-in and check-out
 * @returns {Object} Object containing default checkIn and checkOut times
 */
export const getDefaultTimes = () => ({
  checkIn: "09:00",
  checkOut: "18:00"
});