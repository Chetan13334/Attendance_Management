import api from "../../../utils/api";

/**
 * Updates or creates an attendance record for an employee on a specific date
 * @param {string} employeeId - The ID of the employee
 * @param {Date} date - The date of the attendance record
 * @param {string} checkIn - Check-in time in HH:mm format
 * @param {string} checkOut - Check-out time in HH:mm format
 * @returns {Promise<Object>} The updated attendance record
 */
export const updateAttendanceRecord = async (employeeId, date, checkIn, checkOut) => {
  try {
    let dateStr;
    if (date instanceof Date) {
      dateStr = date.toISOString().split('T')[0];
    } else if (typeof date === 'string') {
      dateStr = date;
    } else {
      throw new Error("Invalid date format");
    }

    const checkInDateTime = new Date(`${dateStr}T${checkIn}:00`);
    const checkOutDateTime = new Date(`${dateStr}T${checkOut}:00`);

    if (isNaN(checkInDateTime.getTime()) || isNaN(checkOutDateTime.getTime())) {
      throw new Error("Invalid time format");
    }

    const payload = {
      employeeId,
      date: dateStr,
      checkInTime: checkInDateTime.toISOString(),
      checkOutTime: checkOutDateTime.toISOString(),
    };

    const response = await api.post("/attendance/record", payload);
    return response.data;

  } catch (error) {
    console.error("Error updating attendance record:", error);
    throw error;
  }
};

/**
 * Fetches an existing attendance record for an employee on a specific date
 * @param {string} employeeId - The ID of the employee
 * @param {Date} date 
 * @returns {Promise<Object|null>} 
 */
export const fetchAttendanceRecord = async (employeeId, date) => {
  try {
    let dateStr;
    if (date instanceof Date) {
      dateStr = date.toISOString().split('T')[0];
    } else if (typeof date === 'string') {
      dateStr = date;
    } else {
      throw new Error("Invalid date format");
    }

    const response = await api.get("/attendance", {
      params: { date: dateStr, employeeId }
    });

    const data = response.data;

    // If backend returns an array, find the specific one
    if (Array.isArray(data)) {
      const record = data.find(r => r.employeeId === employeeId || r._id === employeeId || r.id === employeeId);
      if (record) return normalizeRecord(record);
    } else if (data && (data.employeeId === employeeId || data.id === employeeId)) {
      return normalizeRecord(data);
    }

    return null;
  } catch (error) {
    console.error("Error fetching attendance record:", error);
    return null;
  }
};

const normalizeRecord = (record) => {
  return {
    ...record,
    id: record._id || record.id,
    CheckIn: record.checkInTime ? new Date(record.checkInTime) : null,
    CheckOut: record.checkOutTime ? new Date(record.checkOutTime) : null,
  };
};