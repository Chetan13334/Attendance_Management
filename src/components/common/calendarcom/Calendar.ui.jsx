import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BackBTN } from "../BackBTN";

const BirthdayTooltip = ({ birthday }) => {
  const avatarRef = useRef(null);
  const tooltipRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (isHovered && avatarRef.current && tooltipRef.current) {
      const avatarRect = avatarRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      const left = avatarRect.left + (avatarRect.width / 2) - (tooltipRect.width / 2);
      const top = avatarRect.top - tooltipRect.height - 12;
      
      const adjustedLeft = Math.max(10, left);
      
      const maxLeft = window.innerWidth - tooltipRect.width - 10;
      const finalLeft = Math.min(adjustedLeft, maxLeft);
      
      setPosition({ top, left: finalLeft });
    }
  }, [isHovered, showTooltip]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(true);
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 100);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowTooltip(false);
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="inline-block w-fit">
      {/* Avatar Only (Default) */}
      <div 
        ref={avatarRef}
        className="relative flex-shrink-0 cursor-pointer transition-all duration-300 hover:scale-110 hover:z-50"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="w-8 h-8 p-[1px] rounded-full bg-gradient-to-br from-yellow-300 to-red-500 shadow-md 
          transition-all duration-300 hover:shadow-lg hover:shadow-yellow-300/50 ring-2 ring-white">
          <img
            src={
              birthday.Photo ||
              "https://placehold.co/40x40/fbcfe8/000?text=P"
            }
            alt={birthday.Name}
            className="w-full h-full rounded-full object-cover border-2 border-white"
          />
        </div>
      </div>

      {/* Tooltip Birthday Card (Hover) - Fixed Position */}
      {isHovered && (
        <div 
          ref={tooltipRef}
          className="fixed transition-all duration-300 ease-out"
          style={{ 
            top: `${position.top}px`,
            left: `${position.left}px`,
            zIndex: 999999,
            opacity: showTooltip && position.top > 0 ? 1 : 0,
            transform: showTooltip && position.top > 0 
              ? 'translateY(0) scale(1)' 
              : 'translateY(10px) scale(0.9)',
            pointerEvents: 'none'
          }}
        >
          <div className="px-3 py-2 rounded-lg shadow-2xl border-2 border-pink-200
            bg-gradient-to-br from-pink-50 via-white to-pink-50 backdrop-blur-sm whitespace-nowrap
            transform transition-all duration-300">
            <div className="flex items-center gap-2.5">
              <div className="relative flex-shrink-0">
                <div className="w-7 h-7 p-[1px] rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 shadow-md">
                  <img
                    src={
                      birthday.Photo ||
                      "https://placehold.co/40x40/fbcfe8/000?text=P"
                    }
                    alt={birthday.Name}
                    className="w-full h-full rounded-full object-cover border border-white"
                  />
                </div>
              </div>

              <div className="flex flex-col text-left leading-tight">
                <span className="font-bold text-gray-800 text-xs">
                  {birthday.Name}
                </span>
                <span className="text-pink-600 font-semibold text-[10px] italic flex items-center gap-1">
                  <span className="animate-bounce inline-block" style={{ animationDelay: '0ms' }}>🎉</span>
                  <span>Happy Birthday!</span>
                </span>
              </div>
            </div>
          </div>
          
          {/* Tooltip Arrow */}
          <div 
            className="absolute -bottom-[5px] w-0 h-0 
              border-l-[5px] border-l-transparent 
              border-r-[5px] border-r-transparent 
              border-t-[5px] border-t-pink-200
              transition-all duration-300"
            style={{
              left: `${avatarRef.current ? 
                (avatarRef.current.getBoundingClientRect().left + avatarRef.current.getBoundingClientRect().width / 2 - position.left) : 0}px`,
              filter: 'drop-shadow(0 2px 4px rgba(236, 72, 153, 0.2))'
            }}
          >
          </div>
          <div 
            className="absolute -bottom-[4px] w-0 h-0 
              border-l-[4px] border-l-transparent 
              border-r-[4px] border-r-transparent 
              border-t-[4px] border-t-pink-50
              transition-all duration-300"
            style={{
              left: `${avatarRef.current ? 
                (avatarRef.current.getBoundingClientRect().left + avatarRef.current.getBoundingClientRect().width / 2 - position.left) : 0}px`
            }}
          >
          </div>
        </div>
      )}
    </div>
  );
};

const CalendarUI = ({
  // State
  currentMonth,
  currentYear,
  isModalOpen,
  selectedDate,
  eventForm,
  loading,
  weeks,
  daysOfWeek,
  monthNames,
  parsedEvents,
  parsedEmployees,
  
  // Functions
  handlePrevMonth,
  handleNextMonth,
  handleDayClick,
  handleAddEvent,
  handleDeleteEvent,
  getBirthdaysForDate,
  getEventsForDate,
  setIsModalOpen,
  setEventForm,
}) => {
  return (
    <div>
      <div className="container mx-auto bg-white rounded shadow w-full">
        <BackBTN />
        <div className="p-4 flex justify-between items-center">
          <span className="text-lg font-bold">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={handlePrevMonth}
              className="flex items-center gap-2 px-2 py-2 rounded-xl bg-white text-black font-medium shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNextMonth}
              className="flex items-center gap-2 px-2 py-2 rounded-xl bg-white text-black font-medium shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-visible">
          <table className="w-full table-fixed overflow-visible">
          <thead>
            <tr>
              {daysOfWeek.map((day, i) => (
                <th key={i} className="p-2 bg-gray-50 text-xs md:text-sm text-gray-700">
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{day.slice(0, 3)}</span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {weeks.map((week, wi) => (
              <tr key={wi} className="text-center">
                {week.map((date, di) => {
                  const dayEvents = getEventsForDate(date);
                  const birthdays = getBirthdaysForDate(date);
                  
                  // Check if this date is today
                  const isToday = date && 
                    date.getDate() === new Date().getDate() &&
                    date.getMonth() === new Date().getMonth() &&
                    date.getFullYear() === new Date().getFullYear();

                  return (
                    <td
                      key={di}
                      onClick={() => date && handleDayClick(date)}
                      className={`border border-gray-200 p-1 h-32 sm:h-40 cursor-pointer align-top relative ${
                        isToday 
                          ? "bg-gray-200 text-white hover:bg-gray-300" 
                          : "hover:bg-gray-100"
                      }`}
                      style={{ overflow: "visible" }}
                    >
                      {date ? (
                        <div className="flex flex-col h-full" style={{ overflow: "visible" }}>
                          <div className={`text-sm text-center rounded-full w-7 h-7 flex items-center justify-center mx-auto ${
                            isToday 
                              ? "bg-white text-blue-600 font-bold" 
                              : "text-gray-500"
                          }`}>
                            {date.getDate()}
                          </div>

                          <div className="flex-grow mt-1 overflow-y-auto flex flex-col gap-2 px-1" style={{ overflowX: "visible" }}>
                            {/* Events */}
                            {dayEvents.map((ev) => (
                              <div
                                key={ev.id}
                                className={`relative group text-white rounded p-1 text-xs mb-1 ${
                                  ev.event_theme === "blue"
                                    ? "bg-blue-400"
                                    : ev.event_theme === "red"
                                    ? "bg-red-400"
                                    : ev.event_theme === "yellow"
                                    ? "bg-yellow-400"
                                    : ev.event_theme === "green"
                                    ? "bg-green-400"
                                    : "bg-purple-400"
                                }`}
                              >
                                {ev.event_title}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteEvent(ev.id);
                                  }}
                                  className="absolute bottom-0.5 right-1 text-[15px] opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-black"
                                  title="Delete Event"
                                >
                                  X
                                </button>
                              </div>
                            ))}

                            {/* Birthdays */}
                            {birthdays.length > 0 && (
                              <div className="flex items-center -space-x-2 mt-1">
                                {birthdays.map((b, index) => (
                                  <div
                                    key={b.id}
                                    style={{ zIndex: birthdays.length - index }}
                                    className="relative"
                                  >
                                    <BirthdayTooltip birthday={b} />
                                  </div>
                                ))}
                               
                              </div>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Modal */}
{isModalOpen && (
  // 1. Backdrop: Keep the strong backdrop blur
  <div className="fixed inset-0 flex justify-end items-stretch backdrop-blur-md bg-black/20 z-50">
    
    {/* 2. Side Sheet Container: Fixes to the right, full height, no corners on the right edge, subtle drop shadow */}
    <div className="bg-white w-full max-w-sm relative shadow-2xl p-8 transform transition-transform duration-300 ease-out translate-x-0">
      
      {/* Close Button: Positioned cleanly, using subtle hover effect */}
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-6 right-6 text-gray-500 hover:text-gray-900 p-1 transition-colors"
        aria-label="Close"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>

      {/* Header */}
      <h2 className="text-3xl font-bold mb-1 text-gray-900 mt-2">Schedule Event</h2>
      <p className="text-md font-medium text-indigo-600 mb-8">
        {selectedDate?.toDateString()}
      </p>

      {/* Input Field */}
      <div className="mb-6">
        <label htmlFor="event-title" className="text-sm font-semibold text-gray-700 block mb-2">Title</label>
        <input
          id="event-title"
          type="text"
          placeholder="Event Title"
          value={eventForm.title}
          onChange={(e) =>
            setEventForm((s) => ({ ...s, title: e.target.value }))
          }
          // 3. Input Styling: Minimalist, just a bottom border, sharp focus
          className="w-full p-2 border-b-2 border-gray-300 focus:border-indigo-600 outline-none transition-all text-lg placeholder-gray-400 bg-transparent"
        />
      </div>


      {/* Select Field */}
      <div className="mb-10">
        <label htmlFor="event-theme" className="text-sm font-semibold text-gray-700 block mb-2">Category</label>
        <div className="relative">
          <select
            id="event-theme"
            value={eventForm.theme}
            onChange={(e) =>
              setEventForm((s) => ({ ...s, theme: e.target.value }))
            }
            // 4. Select Styling: Consistent with input, clean look
            className="w-full p-2 border-b-2 border-gray-300 focus:border-indigo-600 outline-none transition-all cursor-pointer appearance-none bg-transparent text-lg"
          >
            <option value="indigo" className="text-gray-700">Meeting (Indigo)</option>
            <option value="red" className="text-gray-700">Urgent (Red)</option>
            <option value="yellow" className="text-gray-700">Personal (Yellow)</option>
            <option value="green" className="text-gray-700">Task (Green)</option>
            <option value="purple" className="text-gray-700">Holiday (Purple)</option>
          </select>
          {/* Custom Arrow Icon for Select */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="absolute bottom-0 left-0 right-0 p-8 border-t border-gray-100 bg-white/95 backdrop-blur-sm flex justify-end gap-4">
        
        {/* Cancel Button (Ghost Style) */}
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-6 py-3 rounded-full text-gray-600 font-semibold hover:bg-gray-100 transition-all"
        >
          Cancel
        </button>
        
        {/* Primary Button (Pill shape, Indigo focus) */}
        <button
          onClick={handleAddEvent}
          disabled={loading}
          className={`px-6 py-3 rounded-full font-bold text-white shadow-md transition-all ${
            loading
              ? "bg-indigo-300 cursor-not-allowed shadow-none"
              : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-indigo-500/50"
          }`}
        >
          {loading ? "Saving..." : "Save Event"}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default CalendarUI;