import { updateAttendanceRecord, fetchAttendanceRecord } from "./attendanceEditLogic";

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
    // Validate inputs
    if (!employeeId || !date || !checkIn || !checkOut) {
      throw new Error("Missing required parameters");
    }
    
    // Validate time format (HH:mm)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(checkIn) || !timeRegex.test(checkOut)) {
      throw new Error("Invalid time format. Expected HH:mm");
    }
    
    console.log("Saving attendance data:", { employeeId, date, checkIn, checkOut });
    const result = await updateAttendanceRecord(employeeId, date, checkIn, checkOut);
    console.log("Attendance data saved successfully:", result);
    return result;
  } catch (error) {
    console.error("Error in saveAttendanceData:", error);
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
    if (!employeeId || !date) {
      throw new Error("Missing required parameters");
    }
    
    console.log("Loading attendance data:", { employeeId, date });
    const result = await fetchAttendanceRecord(employeeId, date);
    console.log("Attendance data loaded:", result);
    return result;
  } catch (error) {
    console.error("Error in loadAttendanceData:", error);
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
      const date = new Date(timeValue);
      if (isNaN(date.getTime())) {
        return "09:00";
      }
      return date.toTimeString().slice(0, 5);
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