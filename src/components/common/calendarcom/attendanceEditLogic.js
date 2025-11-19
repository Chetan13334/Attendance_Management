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
    const dateStr = date instanceof Date ? 
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` :
      date;

    // Create the document path: Employee_CheckIn_CheckOut/{date}/employee_records/{employeeId}
    const dateDocRef = doc(db, "Employee_CheckIn_CheckOut", dateStr);
    const empRecDocRef = doc(dateDocRef, "employee_records", employeeId);

    // Convert time strings to Firestore Timestamps
    const checkInTime = new Date(`${dateStr}T${checkIn}:00`);
    const checkOutTime = new Date(`${dateStr}T${checkOut}:00`);

    // Prepare the attendance data
    const attendanceData = {
      CheckIn: checkInTime,
      CheckOut: checkOutTime,
      employeeId: employeeId,
      date: dateStr,
      lastUpdated: new Date()
    };

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
   
    const dateStr = date instanceof Date ? 
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` :
      date;

   
    const dateDocRef = doc(db, "Employee_CheckIn_CheckOut", dateStr);
    const empRecDocRef = doc(dateDocRef, "employee_records", employeeId);

    
    const docSnap = await getDoc(empRecDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        CheckIn: data.CheckIn?.toDate ? data.CheckIn.toDate() : data.CheckIn,
        CheckOut: data.CheckOut?.toDate ? data.CheckOut.toDate() : data.CheckOut
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching attendance record:", error);
    throw error;
  }
};