import React from "react";
import { Search } from "lucide-react";


const DUMMY_RECORDS = [
  { id: "101", name: "Amit Sharma", time: "09:05 AM", status: "Present", remarks: "On time" },
  { id: "102", name: "Priya Verma", time: "09:12 AM", status: "Late", remarks: "5 min late" },
  { id: "103", name: "Rohit Mehta", time: "-", status: "Absent", remarks: "Not marked" },
  { id: "104", name: "Neha Patel", time: "09:00 AM", status: "Present", remarks: "Perfect" },
  { id: "105", name: "Karan Singh", time: "09:10 AM", status: "Late", remarks: "Slight delay" },
  { id: "106", name: "Anjali Gupta", time: "09:03 AM", status: "Present", remarks: "On time" },
  { id: "107", name: "Rahul Jain", time: "-", status: "Absent", remarks: "Leave applied" },
  { id: "108", name: "Meena Joshi", time: "08:59 AM", status: "Present", remarks: "Early" },
  { id: "109", name: "Vikas Kumar", time: "09:06 AM", status: "Present", remarks: "On time" },
  { id: "110", name: "Sneha Das", time: "09:02 AM", status: "Present", remarks: "Good" },
  { id: "111", name: "Arjun Yadav", time: "-", status: "Absent", remarks: "No info" },
  { id: "112", name: "Deepika Rao", time: "09:15 AM", status: "Late", remarks: "Traffic" },
  { id: "113", name: "Ravi Malhotra", time: "09:00 AM", status: "Present", remarks: "Excellent" },
  { id: "114", name: "Simran Kaur", time: "09:07 AM", status: "Present", remarks: "Good" },
];


const getStatusClasses = (status) => {
  if (status === "Present") return "bg-green-100 text-green-800";
  if (status === "Absent") return "bg-red-100 text-red-800";
  if (status === "Late") return "bg-yellow-100 text-yellow-800";
  return "bg-gray-100 text-gray-800";
};

function AttendanceTable({ records = DUMMY_RECORDS }) {
  return (
    <div className="bg-white rounded-xl shadow-lg mt-8">
      
      <div className="p-4 sm:p-6 flex justify-between items-center border-b border-gray-100 flex-wrap">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
          Today's Records
        </h3>
      
      </div>

      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Name", "Roll No.", "Time", "Status", "Remarks"].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {records.map((record) => (
              <tr
                key={record.id}
                className="hover:bg-gray-50 transition duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {record.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(
                      record.status
                    )}`}
                  >
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {record.remarks}
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
