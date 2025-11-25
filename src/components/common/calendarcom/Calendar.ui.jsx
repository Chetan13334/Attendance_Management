import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BackBTN } from "../BackBTN";

const CalendarUI = ({
  
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
  // Check if next month is in the future
  const isNextMonthDisabled = () => {
    const today = new Date();
    const currentDisplayedDate = new Date(currentYear, currentMonth);
    const nextMonthDate = new Date(currentYear, currentMonth + 1);
    
    // If next month is after current month and year, disable it
    return nextMonthDate > new Date(today.getFullYear(), today.getMonth());
  };

  const nextMonthDisabled = isNextMonthDisabled();

  return (
    <div>
      <div className="container mx-auto bg-white rounded shadow overflow-hidden w-full">
        <BackBTN />
        <div className="p-4 flex justify-between items-center">
          
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={handlePrevMonth}
              className="flex items-center gap-2 px-2 py-2 rounded-xl bg-white text-black font-medium shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-lg ">
            {monthNames[currentMonth]} {currentYear}
          </span>
            <button
              onClick={handleNextMonth}
              disabled={nextMonthDisabled}
              className={`flex items-center gap-2 px-2 py-2 rounded-xl bg-white text-black font-medium shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 ${
                nextMonthDisabled 
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:shadow-lg hover:scale-105"
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <table className="w-full table-fixed">
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

                  return (
                    <td
                      key={di}
                      onClick={() => date && handleDayClick(date)}
                      className="border border-gray-200 p-1 h-32 sm:h-40 overflow-hidden cursor-pointer align-top hover:bg-gray-100"
                    >
                      {date ? (
                        <div className="flex flex-col h-full">
                          <div className="text-gray-500 text-sm text-center">
                            {date.getDate()}
                          </div>

                          <div className="flex-grow mt-1 overflow-y-auto flex flex-col gap-2 px-1">
                            {}
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

                            {}
                            {birthdays.map((b) => (
                              <div
                                key={b.id}
                                className="p-2.5 rounded-xl shadow-lg border-2 border-pink-100/50 
                                  bg-white transition-all duration-300 transform hover:scale-[1.03] 
                                  hover:shadow-2xl cursor-pointer flex items-center gap-3"
                                style={{ maxWidth: "200px" }}
                              >
                                <div className="relative flex-shrink-0">
                                  <div className="w-8 h-8 p-[1px] rounded-full bg-gradient-to-br from-yellow-300 to-red-500 shadow-md">
                                    <img
                                      src={
                                        b.Photo ||
                                        "https:"
                                      }
                                      alt={b.Name}
                                      className="w-full h-full rounded-full object-cover border-2 border-white"
                                    />
                                  </div>
                                  <span className="absolute -bottom-[2px] -right-[2px] text-xs bg-purple-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-[2px]">
                                    *
                                  </span>
                                </div>

                                <div className="flex flex-col text-left leading-snug overflow-hidden">
                                  <span className="font-extrabold text-gray-800 text-[10px] truncate">
                                    {b.Name}
                                  </span>
                                  <span className="text-pink-600 font-semibold text-[9px] italic tracking-tight">
                                    Happy B-Day!
                                  </span>
                                </div>
                              </div>
                            ))}
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

      {}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-96 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              X
            </button>

            <h2 className="text-2xl font-semibold mb-1 text-gray-800">Add Event</h2>
            <p className="text-sm text-gray-500 mb-4">
              {selectedDate?.toDateString()}
            </p>

            <input
              type="text"
              placeholder="Event Title"
              value={eventForm.title}
              onChange={(e) =>
                setEventForm((s) => ({ ...s, title: e.target.value }))
              }
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none mb-4 shadow-sm placeholder-gray-400 transition-all"
            />

            <select
              value={eventForm.theme}
              onChange={(e) =>
                setEventForm((s) => ({ ...s, theme: e.target.value }))
              }
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none mb-6 shadow-sm transition-all cursor-pointer appearance-none bg-white"
            >
              <option value="blue">Blue Theme</option>
              <option value="red">Red Theme</option>
              <option value="yellow">Yellow Theme</option>
              <option value="green">Green Theme</option>
              <option value="purple">Purple Theme</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-all shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                disabled={loading}
                className={`px-5 py-2 rounded-xl font-medium text-white ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-400 to-blue-700 hover:from-blue-500 hover:to-blue-800"
                } transition-all shadow-md`}
              >
                {loading ? "Adding..." : "Add Event"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarUI;
