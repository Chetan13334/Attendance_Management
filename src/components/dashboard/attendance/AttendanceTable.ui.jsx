// src/components/dashboard/attendance/AttendanceTable.ui.jsx

import React, { useEffect } from "react";
import { SkeletonLoader } from "../../common/skeleton/Skeleton";

const AttendanceTableUI = ({ mergedRecords, getStatusClasses, loading }) => {
  // Debugging: Log when records are updated
  useEffect(() => {
    console.log("AttendanceTableUI - mergedRecords updated:", mergedRecords.length);
    if (mergedRecords.length > 0) {
      console.log("First record:", mergedRecords[0]);
    }
  }, [mergedRecords]);

  // Show skeleton loader when loading
  if (loading) {
    console.log("AttendanceTableUI - showing skeleton loader");
    return (
      <div className="bg-white rounded-xl shadow-lg mt-8">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800">
            Attendance Records
          </h3>
        </div>

        {/* Table Skeleton */}
        <div className="overflow-x-auto">
          <SkeletonLoader type="table" rows={8} />
        </div>
      </div>
    );
  }

  console.log("AttendanceTableUI - showing data table with", mergedRecords.length, "records");

  return (
    <div className="bg-white rounded-xl shadow-lg mt-8">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800">
          Attendance Records
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Photo", "Employee Id", "Name", "Date", "Time", "Status", "Remarks"].map(
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
              <tr
                key={record.id || index}
                className="transition duration-150 select-none hover:bg-gray-50"
              >
                {/* ✅ Photo */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {record.photo ? (
                    <img
                      src={record.photo}
                      alt={record.name}
                      className="w-10 h-10 rounded-full object-cover shadow-sm hover:scale-105 transition-transform duration-150"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                      P
                    </div>
                  )}
                </td>

                {/* ✅ Employee ID */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                  {record.employeeId}
                </td>

                {/* ✅ Name */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {record.name}
                </td>

                {/* ✅ Date */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.date}
                </td>

                {/* ✅ Time */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.time}
                </td>

                {/* ✅ Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(
                      record.status
                    )}`}
                  >
                    {record.status}
                  </span>
                </td>

                {/* ✅ Remarks */}
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