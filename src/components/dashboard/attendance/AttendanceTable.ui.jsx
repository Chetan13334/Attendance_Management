import React from "react";

// UI component only - receives all data and functions as props
const AttendanceTableUI = ({ mergedRecords, getStatusClasses }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg mt-8">
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800">
          Attendance Records
        </h3>
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
              <tr key={record.id || index} className="transition duration-150 select-none">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {record.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.employeeId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.date}
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
};

export default AttendanceTableUI;