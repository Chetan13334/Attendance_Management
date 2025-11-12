import React from 'react';

const LegendBar = ({ attendanceData = {} }) => {
  // Check if we have attendance data
  const hasData = Object.keys(attendanceData).length > 0;
  
  // Calculate percentages based on real attendance data
  const calculatePercentages = () => {
    let totalCells = 0;
    let onTimeCount = 0;
    let lateCount = 0;
    let absentCount = 0;
    
    // Iterate through all attendance data to count statuses
    Object.values(attendanceData).forEach(employee => {
      Object.values(employee).forEach(status => {
        totalCells++;
        if (status === 'on-time') onTimeCount++;
        else if (status === 'late') lateCount++;
        else if (status === 'absent') absentCount++;
      });
    });
    
    // Calculate percentages
    const onTimePercent = totalCells > 0 ? Math.round((onTimeCount / totalCells) * 100) : 0;
    const latePercent = totalCells > 0 ? Math.round((lateCount / totalCells) * 100) : 0;
    const absentPercent = totalCells > 0 ? Math.round((absentCount / totalCells) * 100) : 0;
    
    return { onTimePercent, latePercent, absentPercent };
  };
  
  // Add error handling for the calculation
  let percentages = { onTimePercent: 0, latePercent: 0, absentPercent: 0 };
  try {
    percentages = calculatePercentages();
  } catch (error) {
    console.error("Error calculating percentages:", error);
  }
  
  const { onTimePercent, latePercent, absentPercent } = percentages;

  const legendData = [
    {
      label: 'Holiday',
      value: null, 
      dotColor: 'bg-gray-600',
      textColor: 'text-gray-800',
    },
    {
      label: 'On time',
      value: hasData ? `${onTimePercent}%` : '--%',
      dotColor: 'bg-green-500', 
      textColor: 'text-gray-800',
    },
    {
      label: 'Late',
      value: hasData ? `${latePercent}%` : '--%',
      dotColor: 'bg-yellow-400',
      textColor: 'text-gray-800',
    },
    {
      label: 'Absent',
      value: hasData ? `${absentPercent}%` : '--%',
      dotColor: 'bg-red-500',
      textColor: 'text-gray-800',
    },
  ];

  const LegendItem = ({ label, value, dotColor, textColor }) => (
    <div
      className="flex items-center cursor-pointer transition duration-150 ease-in-out
                 hover:scale-[1.03] hover: px-2 py-1 "
    >
    
      <span
        className={`w-2.5 h-2.5 rounded-full mr-2 ${dotColor} flex-shrink-0`}
        aria-hidden="true"
      ></span>

    
      <span className={`text-sm font-medium ${textColor}`}>
        {label}
       
        {value && <span className="ml-1 font-semibold">{value}</span>}
      </span>
    </div>
  );

  return (
    <div className="  flex items-center justify-center p-0">
      <div className="max-w-full">
        
        <div
          className="flex flex-wrap items-center justify-center p-1 bg-white
                     rounded-[32px] shadow-xl space-x-2 sm:space-x-4 border border-gray-100"
        >
          {legendData.map((item, index) => (
            <LegendItem
              key={index}
              label={item.label}
              value={item.value}
              dotColor={item.dotColor}
              textColor={item.textColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LegendBar;