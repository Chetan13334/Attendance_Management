import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { listenToAttendance } from "../../redux/slices/attendanceSlice";

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
  if (status === "Late") return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
};

function AttendanceTable() {
  const dispatch = useDispatch();
  const attendanceRecords = useSelector((state) => state.attendance.list);
  const employees = useSelector((state) => state.employees.list);

  // Start real-time listener once
  useEffect(() => {
    dispatch(listenToAttendance());
  }, [dispatch]);

  const mergedRecords = employees.map((emp, i) => {
    const record =
      attendanceRecords.find(
        (r) => r.employeeId === emp.id || r.employeeId === emp.EmployeeID
      ) || {};

    const fallback = DUMMY_RECORDS[i] || { time: "-", status: "Absent", remarks: "Not marked" };

    return {
      id: emp.id,
      name: emp.Name || emp.name || "Unknown",
      employeeId: emp.EmployeeID || emp.employeeId || emp.id,
      date: new Date().toLocaleDateString(),
      ...fallback,
      ...record,
    };
  });

  if (employees.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg mt-8 p-8 text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Today's Records</h3>
        <p className="text-gray-500">No employees found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg mt-8">
      <div className="p-4 sm:p-6 flex justify-between items-center border-b border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800">Today's Records</h3>
        <p className="text-sm text-gray-500">
          Showing {employees.length} employee{employees.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Name", "Employee ID", "Date", "Time", "Status", "Remarks"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {mergedRecords.map((r, i) => (
              <tr key={r.id || i} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{r.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{r.employeeId}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{r.date}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{r.time}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClasses(r.status)}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{r.remarks}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default AttendanceTable;
