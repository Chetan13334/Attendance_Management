import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import DatePicker from "react-date-picker";
import TimePicker from "react-time-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-time-picker/dist/TimePicker.css";
import "react-calendar/dist/Calendar.css";
import { saveAttendanceData, loadAttendanceData, formatTime, getDefaultTimes } from "./EditModalData";

const EditModal = ({ isOpen, onClose, onSave }) => {
  const employees = useSelector((state) => state.employees.list);
  
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [checkIn, setCheckIn] = useState("09:00");
  const [checkOut, setCheckOut] = useState("18:00");
  const [loading, setLoading] = useState(false);
  
  // For custom dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Filter employees based on search term
  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && employees.length > 0) {
      setSelectedUser(employees[0]?.name || "");
      setSelectedUserId(employees[0]?.id || "");
      setSelectedDate(null);
      setCheckIn("09:00");
      setCheckOut("18:00");
      setSearchTerm("");
    }
  }, [isOpen, employees]);

  // Load existing attendance data when user and date are selected
  useEffect(() => {
    const loadAttendanceDataForUser = async () => {
      if (selectedUserId && selectedDate) {
        try {
          setLoading(true);
          console.log("Loading attendance data for:", { selectedUserId, selectedDate });
          const record = await loadAttendanceData(selectedUserId, selectedDate);
          
          if (record) {
            console.log("Record found:", record);
            const checkInTime = formatTime(record.CheckIn);
            const checkOutTime = formatTime(record.CheckOut);
              
            setCheckIn(checkInTime);
            setCheckOut(checkOutTime);
          } else {
            console.log("No record found, using default times");
            const { checkIn: defaultCheckIn, checkOut: defaultCheckOut } = getDefaultTimes();
            setCheckIn(defaultCheckIn);
            setCheckOut(defaultCheckOut);
          }
        } catch (error) {
          console.error("Error loading attendance data:", error);
          const { checkIn: defaultCheckIn, checkOut: defaultCheckOut } = getDefaultTimes();
          setCheckIn(defaultCheckIn);
          setCheckOut(defaultCheckOut);
        } finally {
          setLoading(false);
        }
      }
    };

    loadAttendanceDataForUser();
  }, [selectedUserId, selectedDate]);

  const handleUserChange = (userName) => {
    setSelectedUser(userName);
    const user = employees.find(emp => emp.name === userName);
    if (user) {
      setSelectedUserId(user.id);
    }
    setIsDropdownOpen(false);
    // Reset time when user changes
    const { checkIn: defaultCheckIn, checkOut: defaultCheckOut } = getDefaultTimes();
    setCheckIn(defaultCheckIn);
    setCheckOut(defaultCheckOut);
  };

  const handleDateChange = (date) => {
    console.log("Date selected:", date);
    setSelectedDate(date);
    // Reset time when date changes
    const { checkIn: defaultCheckIn, checkOut: defaultCheckOut } = getDefaultTimes();
    setCheckIn(defaultCheckIn);
    setCheckOut(defaultCheckOut);
  };

  const handleSave = async () => {
    if (!selectedUser || !selectedUserId || !selectedDate) {
      alert("Please select an employee and date");
      return;
    }
    
    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(checkIn) || !timeRegex.test(checkOut)) {
      alert("Please enter valid time formats (HH:mm)");
      return;
    }
    
    try {
      setLoading(true);
      console.log("Saving attendance data:", { selectedUserId, selectedDate, checkIn, checkOut });
      
      // Log the types of data being passed
      console.log("Data types - userId:", typeof selectedUserId, "date:", typeof selectedDate, "checkIn:", typeof checkIn, "checkOut:", typeof checkOut);
      
      // Ensure we're passing the correct data types
      await saveAttendanceData(selectedUserId, selectedDate, checkIn, checkOut);
      
      if (onSave) {
        onSave({
          user: selectedUser,
          userId: selectedUserId,
          date: selectedDate,
          checkIn,
          checkOut
        });
      }
      
      onClose();
    } catch (error) {
      console.error("Error saving attendance record:", error);
      alert("Failed to save attendance record. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="px-8 py-6 pt-20 border-b border-gray-100">
          <h2 className="text-2xl ml-21 font-bold text-gray-900">Update Attendance</h2>
          <p className="text-gray-600 ml-18 mt-1">Edit Employee CheckIn-CheckOut</p>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-6">
          {/* Employee Dropdown with Search */}
          <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
            <div 
              className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="flex justify-between items-center">
                <span className={selectedUser ? "text-gray-900" : "text-gray-500"}>
                  {selectedUser || "Select employee"}
                </span>
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {/* Search Input */}
                <div className="p-2 border-b border-gray-100">
                  <input
                    type="text"
                    placeholder="Search employees..."
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                </div>
                
                {/* Employee List with Scroll */}
                <div className="max-h-60 overflow-y-auto">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((emp) => (
                      <div
                        key={emp.id}
                        className={`px-4 py-3 text-sm cursor-pointer hover:bg-gray-50 transition ${
                          selectedUser === emp.name ? "bg-indigo-50 text-indigo-700" : "text-gray-700"
                        }`}
                        onClick={() => handleUserChange(emp.name)}
                      >
                        {emp.name}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                      No employees found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <div className="relative">
              <DatePicker
                onChange={handleDateChange}
                value={selectedDate}
                clearIcon={null}
                calendarIcon={null}
                format="dd/MM/yyyy"
                className="w-full"
                disabled={loading}
                calendarClassName="border border-gray-200 rounded-xl shadow-2xl bg-white text-sm w-[300px] [&_.react-calendar__tile]:!py-1.5 [&_.react-calendar__tile]:!px-2 [&_.react-calendar__tile]:text-sm [&_.react-calendar__month-view__weekdays__weekday>abbr]:text-xs [&_.react-calendar__navigation__label]:text-base [&_.react-calendar__navigation_button]:text-sm"
                placeholderText="Select Date"
              />
            </div>
          </div>

          {/* Time Pickers */}
          {selectedDate && (
            <div className="space-y-6 pt-4 border-t border-gray-100">
              <label className="block text-sm font-medium text-gray-700">Shift Time</label>
              <div className="grid grid-cols-2 gap-4">
                {/* Check In */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Check In</label>
                  <div className="relative">
                    <TimePicker
                      onChange={setCheckIn}
                      value={checkIn}
                      disableClock={true}
                      clearIcon={null}
                      clockIcon={null}
                      format="HH:mm"
                      className="w-full"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Check Out */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Check Out</label>
                  <div className="relative">
                    <TimePicker
                      onChange={setCheckOut}
                      value={checkOut}
                      disableClock={true}
                      clearIcon={null}
                      clockIcon={null}
                      format="HH:mm"
                      className="w-full"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-8 py-6 pb-20 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedDate || loading}
            className={`px-6 py-2.5 font-medium text-white rounded-xl transition ${
              selectedDate && !loading
                ? "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30"
                : "bg-indigo-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

        

        {/* Loading */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-3 text-sm text-gray-600">Saving...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditModal;