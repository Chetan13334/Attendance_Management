import React from 'react';

const SkeletonLoader = ({ type = 'default', className = '', rows = 5 }) => {
  const skeletonClasses = `animate-pulse bg-gray-200 rounded ${className}`;

  const skeletonTypes = {
    circle: (
      <div className={`${skeletonClasses} rounded-full`} style={{ width: '40px', height: '40px' }}></div>
    ),
    text: (
      <div className="space-y-2">
        <div className={`${skeletonClasses} h-4 rounded w-3/4`}></div>
        <div className={`${skeletonClasses} h-4 rounded`}></div>
        <div className={`${skeletonClasses} h-4 rounded w-5/6`}></div>
      </div>
    ),
    stat: (
      <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-between">
        <div>
          <div className={`${skeletonClasses} h-4 w-24 mb-2 rounded`}></div>
          <div className={`${skeletonClasses} h-8 w-16 rounded`}></div>
        </div>
        <div className={`${skeletonClasses} w-12 h-12 rounded-xl`}></div>
      </div>
    ),
    event: (
      <div className="p-5 rounded-xl bg-white shadow-sm border border-gray-100 space-y-3">
        <div className={`${skeletonClasses} h-5 w-16 rounded-full`}></div>
        <div className={`${skeletonClasses} h-5 w-3/4 rounded`}></div>
        <div className={`${skeletonClasses} h-4 w-1/2 rounded`}></div>
      </div>
    ),
    card: (
      <div className="space-y-4">
        <div className={`${skeletonClasses} h-48 rounded`}></div>
        <div className="space-y-2">
          <div className={`${skeletonClasses} h-4 rounded w-3/4`}></div>
          <div className={`${skeletonClasses} h-4 rounded`}></div>
          <div className={`${skeletonClasses} h-4 rounded w-5/6`}></div>
        </div>
      </div>
    ),
    profile: (
      <div className="flex items-center space-x-4">
        <div className={`${skeletonClasses} rounded-full`} style={{ width: '50px', height: '50px' }}></div>
        <div className="flex-1 space-y-2">
          <div className={`${skeletonClasses} h-4 rounded`}></div>
          <div className={`${skeletonClasses} h-4 rounded w-3/4`}></div>
        </div>
      </div>
    ),
    employeeTable: (
      <div className="min-w-full inline-block align-middle">
        <div className="rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                {[...Array(10)].map((_, i) => (
                  <th key={i} className="px-4 py-3 text-left">
                    <div className={`${skeletonClasses} h-4 w-16 rounded`}></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[...Array(rows)].map((_, i) => (
                <tr key={i}>
                  {/* Photo */}
                  <td className="px-4 py-4 whitespace-nowrap"><div className={`${skeletonClasses} w-10 h-10 rounded-full`}></div></td>
                  {/* Emp ID */}
                  <td className="px-4 py-4 whitespace-nowrap"><div className={`${skeletonClasses} h-4 w-16 rounded`}></div></td>
                  {/* Name */}
                  <td className="px-4 py-4 whitespace-nowrap"><div className={`${skeletonClasses} h-4 w-24 rounded`}></div></td>
                  {/* Gender */}
                  <td className="px-4 py-4 whitespace-nowrap"><div className={`${skeletonClasses} h-6 w-16 rounded-full mx-auto`}></div></td>
                  {/* Dept */}
                  <td className="px-4 py-4 whitespace-nowrap"><div className={`${skeletonClasses} h-4 w-20 rounded`}></div></td>
                  {/* Role */}
                  <td className="px-4 py-4 whitespace-nowrap"><div className={`${skeletonClasses} h-6 w-24 rounded-full mx-auto`}></div></td>
                  {/* Contact */}
                  <td className="px-4 py-4 whitespace-nowrap"><div className={`${skeletonClasses} h-4 w-24 rounded`}></div></td>
                  {/* Join Date */}
                  <td className="px-4 py-4 whitespace-nowrap"><div className={`${skeletonClasses} h-4 w-20 rounded`}></div></td>
                  {/* DOB */}
                  <td className="px-4 py-4 whitespace-nowrap"><div className={`${skeletonClasses} h-4 w-20 rounded`}></div></td>
                  {/* Action */}
                  <td className="px-4 py-4 whitespace-nowrap"><div className={`${skeletonClasses} h-4 w-12 rounded mx-auto`}></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
    table: (
      <div className="min-w-full inline-block align-middle">
        <div className="rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[...Array(8)].map((_, i) => (
                  <th key={i} className="px-6 py-3 text-left">
                    <div className={`${skeletonClasses} h-4 w-20 rounded`}></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {[...Array(rows)].map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap"><div className={`${skeletonClasses} w-10 h-10 rounded-full`}></div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className={`${skeletonClasses} h-4 w-16 rounded`}></div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className={`${skeletonClasses} h-4 w-24 rounded`}></div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className={`${skeletonClasses} h-4 w-20 rounded`}></div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className={`${skeletonClasses} h-4 w-16 rounded`}></div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className={`${skeletonClasses} h-4 w-16 rounded`}></div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className={`${skeletonClasses} h-6 w-20 rounded-full`}></div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className={`${skeletonClasses} h-4 w-32 rounded`}></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
    calendar: (
      <div className="w-full h-full flex flex-col bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Control Bar Skeleton (Matches CalendarUI header) */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
          {/* Left: Show Calendar Button & Legend */}
          <div className="flex items-center gap-4">
            <div className={`${skeletonClasses} h-9 w-32 rounded-md`}></div>
            <div className={`${skeletonClasses} h-6 w-48 rounded`}></div>
          </div>

          {/* Right: Navigation Controls */}
          <div className="flex items-center gap-4">
            <div className={`${skeletonClasses} h-9 w-9 rounded-md`}></div> {/* Prev */}
            <div className={`${skeletonClasses} h-5 w-32 rounded`}></div>    {/* Date Range */}
            <div className={`${skeletonClasses} h-9 w-9 rounded-md`}></div> {/* Next */}
          </div>
        </div>

        {/* Calendar header */}
        <div className="grid grid-cols-[300px_repeat(5,minmax(0,1fr))] border-b border-gray-200 bg-gray-50">
          <div className="p-4 border-r border-gray-200 flex items-center">
            <div className={`${skeletonClasses} h-5 w-32 rounded`}></div>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-3 border-r border-gray-200 flex flex-col items-center justify-center h-16">
              <div className={`${skeletonClasses} h-6 w-8 rounded mb-1`}></div>
              <div className={`${skeletonClasses} h-3 w-12 rounded`}></div>
            </div>
          ))}
        </div>

        {/* Calendar rows */}
        <div className="flex-grow">
          {[...Array(8)].map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-[300px_repeat(5,minmax(0,1fr))] border-b border-gray-100 hover:bg-gray-50/50">
              {/* Employee profile column */}
              <div className="p-4 border-r border-gray-200 flex items-center">
                <div className={`${skeletonClasses} rounded-full w-10 h-10 mr-3 flex-shrink-0`}></div>
                <div className="flex-1">
                  <div className={`${skeletonClasses} h-4 w-32 rounded mb-2`}></div>
                  <div className={`${skeletonClasses} h-3 w-20 rounded`}></div>
                </div>
              </div>

              {/* Attendance cells */}
              {[...Array(5)].map((_, cellIndex) => (
                <div key={cellIndex} className="p-3 border-r border-gray-200 flex items-center justify-center">
                  <div className={`${skeletonClasses} h-8 w-20 rounded`}></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
    default: (
      <div className={`${skeletonClasses} h-10 rounded`}></div>
    )
  };

  return skeletonTypes[type] || skeletonTypes.default;
};

export default SkeletonLoader;