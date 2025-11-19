import React from 'react';
import { calculateLegendPercentages, shouldShowPercentages } from '../common/EmployeeCalendarcom/legendBarLogic';

const LegendBar = ({ attendanceData = {} }) => {

  // Calculate percentages using the new logic
  const { onTimePercent, latePercent, absentPercent, totalValidRecords } = calculateLegendPercentages(attendanceData);
  
  // Determine if we should show percentages
  const showPercentages = shouldShowPercentages(attendanceData, totalValidRecords);

  console.log("LegendBar - Final display values:", { 
    showPercentages, 
    onTimePercent, 
    latePercent, 
    absentPercent, 
    totalValidRecords 
  });

  const legendData = [
    {
      label: 'On time',
      value: showPercentages ? `${onTimePercent}%` : '--%',
      dotColor: 'bg-green-500', 
      textColor: 'text-gray-800',
    },
    {
      label: 'Late',
      value: showPercentages ? `${latePercent}%` : '--%',
      dotColor: 'bg-yellow-400',
      textColor: 'text-gray-800',
    },
    {
      label: 'Absent',
      value: showPercentages ? `${absentPercent}%` : '--%',
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