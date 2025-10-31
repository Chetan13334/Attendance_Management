import React, { useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { useSelector, useDispatch } from "react-redux";
import { setAttendance } from "../../redux/slices/attendanceSlice";

const DUMMY_RECORDS = [
  { time: "09:05 AM", status: "Present", remarks: "On time" },
  { time: "09:12 AM", status: "Late", remarks: "5 min late" },
  { time: "-", status: "Absent", remarks: "Not marked" },
  { time: "09:00 AM", status: "Present", remarks: "Perfect" },
  { time: "09:10 AM", status: "Late", remarks: "Slight delay" },
  { time: "09:03 AM", status: "Present", remarks: "On time" },
  { time: "-", status: "Absent", remarks: "Leave applied" },
  { time: "08:59 AM", status: "Present", remarks: "Early" },
  { time: "09:06 AM", status: "Present", remarks: "On time" },
  { time: "09:02 AM", status: "Present", remarks: "Good" },
  { time: "-", status: "Absent", remarks: "No info" },
  { time: "09:15 AM", status: "Late", remarks: "Traffic" },
  { time: "09:00 AM", status: "Present", remarks: "Excellent" },
  { time: "09:07 AM", status: "Present", remarks: "Good" },
];

const getStatusClasses = (status) => {
  if (status === "Present") return "bg-green-100 text-green-800";
  if (status === "Absent") return "bg-red-100 text-red-800";
  if (status === "Late") return "bg-yellow-100 text-yellow-800";
  return "bg-gray-100 text-gray-800";
};

function AttendanceTable() {
  const dispatch = useDispatch();
  const attendanceRecords = useSelector((state) => state.attendance.records);
  const employees = useSelector((state) => state.employees.list);

  // Fetch attendance data from Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "attendance"),
      (snapshot) => {
        const attendanceData = [];
        snapshot.forEach((doc) => {
          attendanceData.push({ id: doc.id, ...doc.data() });
        });
        dispatch(setAttendance(attendanceData));
      },
      (error) => {
        console.error("Error fetching attendance data:", error);
      }
    );

    return () => unsubscribe();
  }, [dispatch]);

  // Merge attendance records with employee data
  const mergedRecords = employees.map((emp, index) => {
    // Find attendance record for this employee
    const attendanceRecord = attendanceRecords.find(record => 
      record.employeeId === emp.id || record.employeeId === emp.EmployeeID
    ) || {};
    
    // Use dummy data if no attendance record exists
    const dummy = DUMMY_RECORDS[index] || {
      time: "-",
      status: "Absent",
      remarks: "Not marked",
    };
    
    return {
      id: emp.id,
      name: emp.Name || emp.name || "Unknown",
      employeeId: emp.EmployeeID || emp.employeeId || emp.id,
      date: new Date().toLocaleDateString(),
      ...dummy,
      ...attendanceRecord
    };
  });

  // Show a message if there are no employees
  if (employees.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg mt-8 p-8 text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Today's Records</h3>
        <p className="text-gray-500">No employees found in the database.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg mt-8">
      <div className="p-4 sm:p-6 flex justify-between items-center border-b border-gray-100 flex-wrap">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
          Today's Records
        </h3>
        <p className="text-sm text-gray-500">
          Showing {employees.length} employee{employees.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Name", "Employee Id", "Date", "Time", "Status", "Remarks"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {mergedRecords.map((record, index) => (
              <tr key={record.id || index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {record.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.employeeId || record.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.time || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(
                      record.status || "Absent"
                    )}`}
                  >
                    {record.status || "Absent"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {record.remarks || "No remarks"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AttendanceTable;