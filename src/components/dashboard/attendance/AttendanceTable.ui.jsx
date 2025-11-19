// src/components/dashboard/attendance/AttendanceTable.ui.jsx

import React, { useEffect, useState } from "react";
import { SkeletonLoader } from "../../common/skeleton/Skeleton";

const AttendanceTableUI = ({ mergedRecords, getStatusClasses, loading }) => {
  const [sortedRecords, setSortedRecords] = useState([]);
  const [sortOption, setSortOption] = useState('checkIn'); // default sort by check-in time

  // Apply sorting based on selected option
  useEffect(() => {
    if (!mergedRecords || mergedRecords.length === 0) {
      setSortedRecords([]);
      return;
    }

    let sorted = [...mergedRecords];
    
    switch (sortOption) {
      case 'checkIn':
        // Sort by check-in time (earliest first)
        sorted.sort((a, b) => {
          if (a.checkIn === "-" && b.checkIn === "-") return 0;
          if (a.checkIn === "-") return 1;
          if (b.checkIn === "-") return -1;
          
          // Parse time in format "HH:MM am/pm" (12-hour format from toLocaleTimeString)
          const parseTime = (timeStr) => {
            // Handle the format from toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
            // Which produces strings like "01:24 pm" or "01:35 am"
            const parts = timeStr.trim().split(/\s+/); // Split on whitespace
            if (parts.length !== 2) {
              throw new Error("Invalid time format");
            }
            
            const [time, modifier] = parts;
            let [hours, minutes] = time.split(':').map(Number);
            
            if (modifier.toLowerCase() === "pm" && hours !== 12) hours += 12;
            if (modifier.toLowerCase() === "am" && hours === 12) hours = 0;
            
            return hours * 60 + minutes;
          };
          
          try {
            const aTime = parseTime(a.checkIn);
            const bTime = parseTime(b.checkIn);
            return aTime - bTime;
          } catch (e) {
            console.error("Error parsing check-in times:", a.checkIn, b.checkIn, e);
            return 0;
          }
        });
        break;
        
      case 'joiningDateOld':
        // Sort by joining date (oldest first)
        sorted.sort((a, b) => {
          if (!a.dateOfJoining && !b.dateOfJoining) return 0;
          if (!a.dateOfJoining) return 1;
          if (!b.dateOfJoining) return -1;
          
          const dateA = new Date(a.dateOfJoining);
          const dateB = new Date(b.dateOfJoining);
          
          return dateA - dateB;
        });
        break;
        
      case 'joiningDateNew':
        // Sort by joining date (newest first)
        sorted.sort((a, b) => {
          if (!a.dateOfJoining && !b.dateOfJoining) return 0;
          if (!a.dateOfJoining) return 1;
          if (!b.dateOfJoining) return -1;
          
          const dateA = new Date(a.dateOfJoining);
          const dateB = new Date(b.dateOfJoining);
          
          return dateB - dateA;
        });
        break;
        
      case 'nameAZ':
        // Sort by name (A to Z)
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
        
      case 'nameZA':
        // Sort by name (Z to A)
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
        
      case 'earlyCheckout':
        // Sort by checkout time (earliest first)
        sorted.sort((a, b) => {
          if (a.checkOut === "-" && b.checkOut === "-") return 0;
          if (a.checkOut === "-") return 1;
          if (b.checkOut === "-") return -1;
          
          // Parse time in format "HH:MM am/pm" (12-hour format from toLocaleTimeString)
          const parseTime = (timeStr) => {
            // Handle the format from toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
            // Which produces strings like "01:24 pm" or "01:35 am"
            const parts = timeStr.trim().split(/\s+/); // Split on whitespace
            if (parts.length !== 2) {
              throw new Error("Invalid time format");
            }
            
            const [time, modifier] = parts;
            let [hours, minutes] = time.split(':').map(Number);
            
            if (modifier.toLowerCase() === "pm" && hours !== 12) hours += 12;
            if (modifier.toLowerCase() === "am" && hours === 12) hours = 0;
            
            return hours * 60 + minutes;
          };
          
          try {
            const aTime = parseTime(a.checkOut);
            const bTime = parseTime(b.checkOut);
            return aTime - bTime;
          } catch (e) {
            console.error("Error parsing checkout times:", a.checkOut, b.checkOut, e);
            return 0;
          }
        });
        break;
        
      default:
        // Default sort by check-in time
        sorted.sort((a, b) => {
          if (a.checkIn === "-" && b.checkIn === "-") return 0;
          if (a.checkIn === "-") return 1;
          if (b.checkIn === "-") return -1;
          
          // Parse time in format "HH:MM am/pm" (12-hour format from toLocaleTimeString)
          const parseTime = (timeStr) => {
            // Handle the format from toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
            // Which produces strings like "01:24 pm" or "01:35 am"
            const parts = timeStr.trim().split(/\s+/); // Split on whitespace
            if (parts.length !== 2) {
              throw new Error("Invalid time format");
            }
            
            const [time, modifier] = parts;
            let [hours, minutes] = time.split(':').map(Number);
            
            if (modifier.toLowerCase() === "pm" && hours !== 12) hours += 12;
            if (modifier.toLowerCase() === "am" && hours === 12) hours = 0;
            
            return hours * 60 + minutes;
          };
          
          try {
            const aTime = parseTime(a.checkIn);
            const bTime = parseTime(b.checkIn);
            return aTime - bTime;
          } catch (e) {
            console.error("Error parsing check-in times:", a.checkIn, b.checkIn, e);
            return 0;
          }
        });
    }
    
    setSortedRecords(sorted);
  }, [mergedRecords, sortOption]);

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
      <div className="p-4 sm:p-2 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Attendance Records
          </h3>
          
          {/* Filter Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sortFilter" className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              id="sortFilter"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="checkIn">Early Check-in</option>
              <option value="joiningDateOld">Joining Date (Oldest)</option>
              <option value="joiningDateNew">Joining Date (Newest)</option>
              <option value="nameAZ">Name (A-Z)</option>
              <option value="nameZA">Name (Z-A)</option>
              <option value="earlyCheckout">Early Checkout</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Photo", "Employee Id", "Name", "Date", "Check In", "Check Out", "Status", "Remarks"].map(
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
            {sortedRecords.map((record, index) => (
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

                {/* ✅ Check In */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.checkIn}
                </td>
                
                {/* ✅ Check Out */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.checkOut}
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