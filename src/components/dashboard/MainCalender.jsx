import React, { useState, useCallback } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import CalenderBTN from '../common/CalenderBTN';

// --- Mock Data ---

// Helper function to get initials for the avatar background
const getInitials = (name) => name.split(' ').map(n => n[0]).join('');

// Student list with unique IDs
const initialStudents = [
  { id: '1', name: 'Marta Adams', avatarColor: 'bg-purple-300' },
  { id: '2', name: 'Robin Logan', avatarColor: 'bg-yellow-300' },
  { id: '3', name: 'Cruz French', avatarColor: 'bg-blue-300' },
  { id: '4', name: 'Claudine Cherry', avatarColor: 'bg-green-300' },
  { id: '5', name: 'Mitch Huber', avatarColor: 'bg-pink-300' },
  { id: '6', name: 'Essie Fry', avatarColor: 'bg-indigo-300' },
  { id: '7', name: 'Shanna Orozco', avatarColor: 'bg-red-300' },
  { id: '8', name: 'Gabriel Nelson', avatarColor: 'bg-teal-300' },
  { id: '9', name: 'Shirley George', avatarColor: 'bg-cyan-300' },
  { id: '10', name: 'Gustavo Lopez', avatarColor: 'bg-orange-300' },
  { id: '11', name: 'Dante Cantrell', avatarColor: 'bg-lime-300' },
  { id: '12', name: 'Irwin Roberts', avatarColor: 'bg-violet-300' },
  { id: '13', name: 'Adeline Decker', avatarColor: 'bg-fuchsia-300' },
];

// Helper function to generate week data
const generateWeekData = (startDate) => {
  const days = [];
  const date = new Date(startDate);
  
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(date);
    currentDate.setDate(date.getDate() + i);
    
    days.push({
      date: currentDate.getDate(),
      day: currentDate.toLocaleDateString('en-US', { weekday: 'long' }),
      fullDate: currentDate.toISOString().split('T')[0],
      month: currentDate.toLocaleDateString('en-US', { month: 'short' }),
      year: currentDate.getFullYear(),
      index: i + 1
    });
  }
  
  return days;
};

// Status mapping for styling and labels
const attendanceStatuses = {
    'on-time': { label: 'On time', detail: null, classes: 'text-gray-700 hover:bg-gray-50' },
    'absent-health': { label: 'Absent', detail: '(Health Problem)', classes: 'bg-red-50 text-red-800 border-l-red-500' },
    'late-traffic': { label: 'Late', detail: '(Traffic Jam)', classes: 'bg-yellow-50 text-yellow-800 border-l-yellow-400' },
    'absent-family': { label: 'Absent', detail: '(Family Problem)', classes: 'bg-red-50 text-red-800 border-l-red-500' },
    'late-family': { label: 'Late', detail: '(Family Problem)', classes: 'bg-yellow-50 text-yellow-800 border-l-yellow-400' },
};

// Initial attendance data structure (Student ID -> Date -> Status Key)
const initialAttendance = {
    '1': { 23: 'on-time', 24: 'absent-health', 25: 'holiday', 26: 'on-time', 27: 'on-time', 28: 'on-time', 29: 'late-traffic' },
    '2': { 23: 'on-time', 24: 'late-traffic', 25: 'holiday', 26: 'on-time', 27: 'on-time', 28: 'on-time', 29: 'on-time' },
    '3': { 23: 'on-time', 24: 'on-time', 25: 'holiday', 26: 'on-time', 27: 'on-time', 28: 'on-time', 29: 'on-time' },
    '4': { 23: 'on-time', 24: 'on-time', 25: 'holiday', 26: 'on-time', 27: 'on-time', 28: 'on-time', 29: 'on-time' },
    '5': { 23: 'on-time', 24: 'on-time', 25: 'holiday', 26: 'on-time', 27: 'on-time', 28: 'late-family', 29: 'on-time' },
    '6': { 23: 'on-time', 24: 'on-time', 25: 'holiday', 26: 'on-time', 27: 'on-time', 28: 'on-time', 29: 'absent-health' },
    '7': { 23: 'late-traffic', 24: 'on-time', 25: 'holiday', 26: 'absent-health', 27: 'on-time', 28: 'on-time', 29: 'on-time' },
    '8': { 23: 'on-time', 24: 'on-time', 25: 'holiday', 26: 'on-time', 27: 'on-time', 28: 'on-time', 29: 'on-time' },
    '9': { 23: 'on-time', 24: 'on-time', 25: 'holiday', 26: 'on-time', 27: 'on-time', 28: 'late-traffic', 29: 'on-time' },
    '10': { 23: 'on-time', 24: 'absent-family', 25: 'holiday', 26: 'late-family', 27: 'on-time', 28: 'on-time', 29: 'on-time' },
    '11': { 23: 'on-time', 24: 'on-time', 25: 'holiday', 26: 'on-time', 27: 'on-time', 28: 'on-time', 29: 'on-time' },
    '12': { 23: 'on-time', 24: 'on-time', 25: 'holiday', 26: 'on-time', 27: 'on-time', 28: 'on-time', 29: 'on-time' },
    '13': { 23: 'on-time', 24: 'on-time', 25: 'holiday', 26: 'on-time', 27: 'on-time', 28: 'on-time', 29: 'on-time' },
};

// --- Sub-Components (Defined within App scope for single file rule) ---

// Attendance Cell Component
const AttendanceCell = ({ statusKey, date, studentId, isHoliday, onClick }) => {
    const status = attendanceStatuses[statusKey] || attendanceStatuses['on-time'];
    
    // Class names for the holiday column
    const holidayClasses = isHoliday ? 'bg-gray-100 hover:bg-gray-200' : '';

    // Simulate buttons working by adding a pointer and an onClick handler
    const handleClick = useCallback(() => {
        onClick(studentId, date, statusKey);
    }, [studentId, date, statusKey, onClick]);

    return (
        <div
            className={`
                flex flex-col justify-center items-center p-0 text-xs font-medium h-full cursor-pointer
                border-r border-gray-100 transition duration-100 ease-in-out
                ${isHoliday ? 'bg-gray-50' : status.classes} 
                ${statusKey !== 'on-time' && !isHoliday ? 'border-l-4' : 'border-l-transparent'}
                ${status.border}
            `}
            onClick={handleClick}
        >
            <span className="leading-tight">{status.label}</span>
            {status.detail && (
                <span className={`text-[10px] font-normal mt-0.5 ${isHoliday ? 'text-gray-500' : 'text-gray-500'}`}>
                    {status.detail}
                </span>
            )}
        </div>
    );
};

// Student Profile Component
const StudentProfile = ({ student, isSelected, onToggle }) => (
    <div className="flex items-center  p-3 text-sm font-medium border-r border-gray-200">
        <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggle(student.id)}
            className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 mr-3 cursor-pointer"
        />
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 ${student.avatarColor}`}>
            {getInitials(student.name)}
        </div>
        <span className="text-gray-800">{student.name}</span>
    </div>
);


// --- Main App Component ---

export default function MainCalender() {
    const [selectedStudents, setSelectedStudents] = useState({});
    const [attendance, setAttendance] = useState(initialAttendance);
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date(2024, 9, 23)); // Oct 23, 2024
    const [daysOfWeek, setDaysOfWeek] = useState(generateWeekData(new Date(2024, 9, 23)));
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

    // Grid layout class for 1 wider profile column and 7 equal day columns
    const gridColsClass = 'grid grid-cols-[300px_repeat(7,minmax(0,1fr))]';

    const handleToggleSelect = (studentId) => {
        setSelectedStudents(prev => ({
            ...prev,
            [studentId]: !prev[studentId],
        }));
    };

    const handleCellClick = (studentId, date, currentStatus) => {
        // Mock Interaction Logic: In a real app, this would open a modal/dropdown to select a new status.
        // For demonstration, we'll log the action and toggle a simple status change.
        console.log(`Cell Clicked: Student ${studentId}, Date ${date}, Status ${currentStatus}`);

        // Cycle through statuses for demonstration purposes
        const statusKeys = Object.keys(attendanceStatuses);
        const currentIndex = statusKeys.indexOf(currentStatus);
        const nextIndex = (currentIndex + 1) % statusKeys.length;
        const nextStatus = statusKeys[nextIndex];

        // Ensure we don't accidentally set a holiday cell to a normal status
        const isHoliday = daysOfWeek.find(d => d.date === date)?.special === 'Holiday';

        setAttendance(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [date]: isHoliday ? 'holiday' : nextStatus,
            }
        }));
    };

    const handlePreviousWeek = () => {
        const newWeekStart = new Date(currentWeekStart);
        newWeekStart.setDate(currentWeekStart.getDate() - 7);
        setCurrentWeekStart(newWeekStart);
        setDaysOfWeek(generateWeekData(newWeekStart));
    };

    const handleNextWeek = () => {
        const newWeekStart = new Date(currentWeekStart);
        newWeekStart.setDate(currentWeekStart.getDate() + 7);
        setCurrentWeekStart(newWeekStart);
        setDaysOfWeek(generateWeekData(newWeekStart));
    };

    const handleToday = () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const monday = new Date(today);
        monday.setDate(today.getDate() + mondayOffset);
        setCurrentWeekStart(monday);
        setDaysOfWeek(generateWeekData(monday));
    };

    const handleOpenCalendarModal = () => {
        setIsCalendarModalOpen(true);
    };

    const handleCloseCalendarModal = () => {
        setIsCalendarModalOpen(false);
    };

    return (
        <div className="mt-15 p-8 md:p-0 min-h-screen bg-gray-100 font-sans">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Week Navigation Bar */}
                <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleOpenCalendarModal}
                            className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium"
                        >
                            Show Calendar
                        </button>
                        <button 
                            onClick={handleToday}
                            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
                        >
                            Today
                        </button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handlePreviousWeek}
                            className="p-2 rounded-md hover:bg-gray-200 transition-colors"
                            title="Previous Week"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        
                        <div className="text-sm font-semibold text-gray-700">
                            {daysOfWeek[0]?.month} {daysOfWeek[0]?.date} - {daysOfWeek[6]?.month} {daysOfWeek[6]?.date}, {daysOfWeek[0]?.year}
                        </div>
                        
                        <button
                            onClick={handleNextWeek}
                            className="p-2 rounded-md hover:bg-gray-200 transition-colors"
                            title="Next Week"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                    
                    <div className="w-24"></div> {/* Spacer for alignment */}
                </div>
                
                {/* --- Header Row --- */}
                <div className={`${gridColsClass} border-b border-gray-200 text-gray-800 font-semibold text-center`}>
                    
                    {/* Header Corner */}
                    <div className="flex items-center justify-start p-4 text-sm font-bold border-r border-gray-200">
                        <span className='mr-1'>Student Profile</span>
                        <ChevronDown className="w-4 h-4 text-gray-400 cursor-pointer" />
                    </div>
                    

                    {/* Day Headers */}
                    {daysOfWeek.map((day, index) => {
                        const isToday = new Date().toISOString().split('T')[0] === day.fullDate;
                        return (
                            <div
                                key={day.fullDate}
                                className={`p-3 border-r border-gray-200 text-sm flex flex-col justify-center transition-colors
                                    ${day.special === 'Holiday' ? 'bg-gray-100 text-gray-500' : 'text-gray-500'}
                                    ${isToday ? 'bg-blue-50' : ''}
                                    ${index === 6 ? 'border-r-0' : ''}
                                `}
                            >
                                <span className={`text-lg font-bold ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                                    {day.date}
                                </span>
                                <span className={`text-xs font-medium uppercase mt-0.5 ${isToday ? 'text-blue-600' : ''}`}>
                                    {day.day.substring(0, 3)}
                                </span>
                                <span className="text-[10px] text-gray-400 mt-0.5">
                                    {day.month}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* --- Student Rows (Body) --- */}
                <div className="divide-y divide-gray-100 max-h-[80vh] overflow-y-auto">
                    {initialStudents.map((student) => {
                        // Replicate the data redundancy from the image for visual purposes
                        const displayStudent = student.id === '4' ? initialStudents.find(s => s.id === '1') : student;

                        return (
                            <div key={student.id} className={`${gridColsClass} hover:bg-red-50/20`}>
                                {/* Student Profile */}
                                <StudentProfile
                                    student={displayStudent}
                                    isSelected={!!selectedStudents[student.id]}
                                    onToggle={handleToggleSelect}
                                />

                                {/* Attendance Cells */}
                                {daysOfWeek.map((day) => {
                                    const statusKey = attendance[student.id]?.[day.date] || 'on-time';
                                    const isHoliday = day.special === 'Holiday';

                                    // Special case to render the holiday details only on the holiday column (date 25)
                                    const currentStatusKey = (isHoliday && statusKey !== 'holiday') ? 'holiday' : statusKey;
                                    const currentStatus = isHoliday && day.detail ? {
                                        label: 'Holiday',
                                        detail: `(${day.detail})`,
                                        classes: 'bg-gray-100 text-gray-500',
                                        border: 'border-l-transparent'
                                    } : attendanceStatuses[currentStatusKey];


                                    return (
                                        <AttendanceCell
                                            key={day.date}
                                            studentId={student.id}
                                            date={day.date}
                                            statusKey={currentStatusKey}
                                            isHoliday={isHoliday}
                                            onClick={handleCellClick}
                                        />
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
                {/* Optional: Footer or summary bar */}
                <div className="p-4 border-t border-gray-200 text-sm text-gray-500 flex justify-between items-center">
                    <span className="font-medium">Total Students: {initialStudents.length}</span>
                    <span>Week of {daysOfWeek[0]?.month} {daysOfWeek[0]?.date} - {daysOfWeek[6]?.month} {daysOfWeek[6]?.date}, {daysOfWeek[0]?.year}</span>
                </div>
            </div>

            {/* Calendar Modal Popup */}
            {isCalendarModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                        onClick={handleCloseCalendarModal}
                    ></div>
                    
                    {/* Modal Content */}
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
                            {/* Close Button */}
                            <button
                                onClick={handleCloseCalendarModal}
                                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white hover:bg-gray-100 shadow-lg transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                            
                            {/* Calendar Component */}
                            <div className="overflow-y-auto max-h-[90vh]">
                                <CalenderBTN />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}