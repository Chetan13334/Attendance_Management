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
    table: (
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`${skeletonClasses} h-4 rounded`}></div>
          ))}
        </div>
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, j) => (
              <div key={j} className={`${skeletonClasses} h-10 rounded`}></div>
            ))}
          </div>
        ))}
      </div>
    ),
    calendar: (
      <div className="w-full h-full flex flex-col">
        {/* Calendar header with navigation */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className={`${skeletonClasses} h-8 w-24 rounded`}></div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`${skeletonClasses} h-8 w-8 rounded-full`}></div>
            <div className={`${skeletonClasses} h-4 w-32 rounded`}></div>
            <div className={`${skeletonClasses} h-8 w-8 rounded-full`}></div>
          </div>
          
          <div className={`${skeletonClasses} h-8 w-32 rounded`}></div>
        </div>
        
        {/* Calendar days header */}
        <div className="grid grid-cols-6 border-b border-gray-200 flex-shrink-0">
          <div className="p-4 border-r border-gray-200">
            <div className={`${skeletonClasses} h-4 w-24 rounded`}></div>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-3 border-r border-gray-200 text-center">
              <div className={`${skeletonClasses} h-4 w-8 rounded mx-auto mb-1`}></div>
              <div className={`${skeletonClasses} h-3 w-6 rounded mx-auto`}></div>
            </div>
          ))}
        </div>
        
        {/* Calendar rows - fill remaining space */}
        <div className="flex-grow overflow-hidden">
          {[...Array(8)].map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-6 divide-y divide-gray-100 h-20">
              {/* Employee profile column */}
              <div className="p-4 flex items-center">
                <div className="flex items-center">
                  <div className={`${skeletonClasses} rounded-full w-8 h-8 mr-3`}></div>
                  <div>
                    <div className={`${skeletonClasses} h-4 w-20 rounded mb-1`}></div>
                    <div className={`${skeletonClasses} h-3 w-16 rounded`}></div>
                  </div>
                </div>
              </div>
              
              {/* Attendance cells */}
              {[...Array(5)].map((_, cellIndex) => (
                <div key={cellIndex} className="p-3 flex items-center justify-center">
                  <div className={`${skeletonClasses} h-6 w-16 rounded`}></div>
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