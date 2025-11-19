/**
 * Calculates attendance percentages for the LegendBar
 * Only includes past and current dates, excludes future dates
 */

export const calculateLegendPercentages = (attendanceData) => {
  console.log("LegendBarLogic - Input attendanceData:", attendanceData);
  
  // Validate input data
  if (!attendanceData || typeof attendanceData !== 'object') {
    console.log("LegendBarLogic - Invalid attendance data");
    return { onTimePercent: 0, latePercent: 0, absentPercent: 0, totalValidRecords: 0 };
  }

  // Check if we have actual employee data with attendance records
  const hasValidAttendanceData = Object.keys(attendanceData).length > 0 && 
    Object.values(attendanceData).some(employee => 
      employee && typeof employee === 'object' && 
      Object.keys(employee).length > 0 &&
      Object.values(employee).some(status => 
        status === 'on-time' || status === 'late' || status === 'absent'
      )
    );

  if (!hasValidAttendanceData) {
    console.log("LegendBarLogic - No valid attendance data found");
    return { onTimePercent: 0, latePercent: 0, absentPercent: 0, totalValidRecords: 0 };
  }

  let totalValidRecords = 0;
  let onTimeCount = 0;
  let lateCount = 0;
  let absentCount = 0;
  
  // Process each employee's attendance data
  Object.values(attendanceData).forEach(employee => {
    if (employee && typeof employee === 'object') {
      Object.entries(employee).forEach(([dateKey, status]) => {
        // Only count valid statuses: on-time, late, absent
        if (status === 'on-time' || status === 'late' || status === 'absent') {
          totalValidRecords++;
          if (status === 'on-time') onTimeCount++;
          else if (status === 'late') lateCount++;
          else if (status === 'absent') absentCount++;
        }
      });
    }
  });
  
  console.log("LegendBarLogic - Calculation results:", { 
    totalValidRecords, 
    onTimeCount, 
    lateCount, 
    absentCount 
  });
  
  // Calculate percentages only if we have valid records
  const onTimePercent = totalValidRecords > 0 ? Math.round((onTimeCount / totalValidRecords) * 100) : 0;
  const latePercent = totalValidRecords > 0 ? Math.round((lateCount / totalValidRecords) * 100) : 0;
  const absentPercent = totalValidRecords > 0 ? Math.round((absentCount / totalValidRecords) * 100) : 0;
  
  return { 
    onTimePercent, 
    latePercent, 
    absentPercent, 
    totalValidRecords 
  };
};

/**
 * Formats attendance data specifically for the LegendBar
 * Ensures data is in the correct format: { employeeId: { dateKey: status } }
 */
export const formatLegendData = (selectedEmployee, employeeAttendance) => {
  console.log("LegendBarLogic - Formatting data for legend");
  console.log("LegendBarLogic - selectedEmployee:", selectedEmployee);
  console.log("LegendBarLogic - employeeAttendance:", employeeAttendance);
  
  // Create a structure that the LegendBar expects: { employeeId: { dateKey: status } }
  const formattedData = {};

  // Only format data if we have a selected employee and valid attendance data
  if (selectedEmployee && employeeAttendance) {
    // Make sure employeeAttendance is an object with date keys and status values
    if (typeof employeeAttendance === 'object' && !Array.isArray(employeeAttendance)) {
      // Only add to formattedData if there are actual attendance records
      const hasAttendanceRecords = Object.keys(employeeAttendance).length > 0 &&
        Object.values(employeeAttendance).some(status => 
          status === 'on-time' || status === 'late' || status === 'absent'
        );
      
      if (hasAttendanceRecords) {
        formattedData[selectedEmployee.id] = employeeAttendance;
      }
    } else {
      console.warn("LegendBarLogic - employeeAttendance is not in expected format:", employeeAttendance);
    }
  } else {
    console.log("LegendBarLogic - Missing data for legend - selectedEmployee:", !!selectedEmployee, "employeeAttendance:", !!employeeAttendance);
  }

  console.log("LegendBarLogic - Formatted legend data:", formattedData);
  return formattedData;
};

/**
 * Checks if we should show percentages in the LegendBar
 */
export const shouldShowPercentages = (attendanceData, totalValidRecords) => {
  // Show percentages only if we have valid attendance data and records
  const hasValidData = Object.keys(attendanceData).length > 0 && 
    Object.values(attendanceData).some(employee => 
      employee && typeof employee === 'object' && 
      Object.keys(employee).length > 0 &&
      Object.values(employee).some(status => 
        status === 'on-time' || status === 'late' || status === 'absent'
      )
    );
    
  return hasValidData && totalValidRecords > 0;
};