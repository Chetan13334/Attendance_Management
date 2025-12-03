import { db, auth, storage } from "../firebase";
import { collection, doc } from "firebase/firestore";

export const DB = {
    collections: {
        Employee_CheckIn_CheckOut: collection(db, "Employee_CheckIn_CheckOut"),
        Events: collection(db, "Events"),
        Employee_Details: collection(db, "Employee_Details"),
        Leave_Requests: collection(db, "Leave-req"), // Added this for easier access
    },

    employeeRecord: (dateKey, empId) =>
        doc(db, "Employee_CheckIn_CheckOut", dateKey, "employee_records", empId),

    eventDoc: (eventId) => doc(db, "Events", eventId),

    Leave: {
        LeaveByEmpAndDate: (empId, date) =>
            doc(db, "Leave-req", empId, "dates", date),

        // Helper to get the 'dates' subcollection for an employee
        EmployeeLeaveDates: (empId) =>
            collection(db, "Leave-req", empId, "dates")
    },

    auth,
    storage,
};

export default DB;
