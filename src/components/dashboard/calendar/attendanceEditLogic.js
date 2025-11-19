import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";

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
    // Format the date as YYYY-MM-DD
    let dateStr;
    if (date instanceof Date) {
      dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    } else if (typeof date === 'string') {
      // If it's already a string in YYYY-MM-DD format, use it directly
      dateStr = date;
    } else {
      throw new Error("Invalid date format");
    }

    console.log("Formatted date string:", dateStr);

    // Create the document path: Employee_CheckIn_CheckOut/{date}/employee_records/{employeeId}
    const dateDocRef = doc(db, "Employee_CheckIn_CheckOut", dateStr);
    const empRecDocRef = doc(dateDocRef, "employee_records", employeeId);

    // Convert time strings to Firestore Timestamps
    // Ensure we're handling the time correctly
    const checkInDateTime = new Date(`${dateStr}T${checkIn}:00`);
    const checkOutDateTime = new Date(`${dateStr}T${checkOut}:00`);

    console.log("CheckIn DateTime:", checkInDateTime);
    console.log("CheckOut DateTime:", checkOutDateTime);

    // Validate the dates
    if (isNaN(checkInDateTime.getTime()) || isNaN(checkOutDateTime.getTime())) {
      throw new Error("Invalid time format");
    }

    // Prepare the attendance data
    const attendanceData = {
      CheckIn: checkInDateTime,
      CheckOut: checkOutDateTime,
      employeeId: employeeId,
      date: dateStr,
      lastUpdated: new Date()
    };

    console.log("Saving attendance data:", attendanceData);

    // Update or create the document
    await setDoc(empRecDocRef, attendanceData, { merge: true });

    // Return the updated data
    return {
      id: employeeId,
      ...attendanceData
    };
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
    // Format the date as YYYY-MM-DD
    let dateStr;
    if (date instanceof Date) {
      dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    } else if (typeof date === 'string') {
      // If it's already a string in YYYY-MM-DD format, use it directly
      dateStr = date;
    } else {
      throw new Error("Invalid date format");
    }

    console.log("Fetching record for date string:", dateStr);

    const dateDocRef = doc(db, "Employee_CheckIn_CheckOut", dateStr);
    const empRecDocRef = doc(dateDocRef, "employee_records", employeeId);

    const docSnap = await getDoc(empRecDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("Record found:", data);
      // Ensure we're properly converting Firestore timestamps
      return {
        id: docSnap.id,
        ...data,
        CheckIn: data.CheckIn?.toDate ? data.CheckIn.toDate() : (data.CheckIn || null),
        CheckOut: data.CheckOut?.toDate ? data.CheckOut.toDate() : (data.CheckOut || null)
      };
    }

    console.log("No record found for this date");
    return null;
  } catch (error) {
    console.error("Error fetching attendance record:", error);
    throw error;
  }
};