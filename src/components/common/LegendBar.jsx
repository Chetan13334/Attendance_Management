import React from 'react';

// Data for the legend bar, including colors for the dot and text.
const legendData = [
  {
    label: 'Holiday',
    value: null, // No percentage for Holiday
    dotColor: 'bg-gray-600',
    textColor: 'text-gray-800',
  },
  {
    label: 'On time',
    value: '82%',
    dotColor: 'bg-pink-400', // Using pink to approximate the light purple/pink dot
    textColor: 'text-gray-800',
  },
  {
    label: 'Late',
    value: '10%',
    dotColor: 'bg-yellow-400',
    textColor: 'text-gray-800',
  },
  {
    label: 'Absent',
    value: '8%',
    dotColor: 'bg-red-500',
    textColor: 'text-gray-800',
  },
];

/**
 * Individual Legend Item Component (the "pill")
 */
const LegendItem = ({ label, value, dotColor, textColor }) => (
  <div
    className="flex items-center cursor-pointer transition duration-150 ease-in-out
               hover:scale-[1.03] hover: px-2 py-1 "
  >
    {/* Colored Dot */}
    <span
      className={`w-2.5 h-2.5 rounded-full mr-2 ${dotColor} flex-shrink-0`}
      aria-hidden="true"
    ></span>

    {/* Label and Value */}
    <span className={`text-sm font-medium ${textColor}`}>
      {label}
      {/* Conditionally display the value if it exists */}
      {value && <span className="ml-1 font-semibold">{value}</span>}
    </span>
  </div>
);

/**
 * Main App Component: Renders the entire Legend Bar
 */
const App = () => {
  return (
    <div className="  flex items-center justify-center p-0">
      <div className="max-w-full">
        
        {/* The main container for the legend bar, featuring the pill-shaped background and shadow */}
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

export default App;
