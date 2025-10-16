import React, { useState, useEffect } from 'react';

const CalenderBTN = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState([
    {
      event_date: new Date(2024, 3, 1),
      event_title: "April Fool's Day",
      event_theme: 'blue'
    },
    {
      event_date: new Date(2024, 3, 10),
      event_title: "Birthday",
      event_theme: 'red'
    },
    {
      event_date: new Date(2024, 3, 16),
      event_title: "Upcoming Event",
      event_theme: 'green'
    }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    theme: 'blue'
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const themes = [
    { value: 'blue', label: 'Blue Theme' },
    { value: 'red', label: 'Red Theme' },
    { value: 'yellow', label: 'Yellow Theme' },
    { value: 'green', label: 'Green Theme' },
    { value: 'purple', label: 'Purple Theme' }
  ];

  // Get calendar days for the current month
  const getCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add previous month's days
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonth - 1, prevMonthLastDay - i)
      });
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: new Date(currentYear, currentMonth, day)
      });
    }

    // Add next month's days to complete the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonth + 1, day)
      });
    }

    return days;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getEventKey = (date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
    setEventForm({ title: '', theme: 'blue' });
  };

  const handleAddEvent = () => {
    if (!eventForm.title) {
      alert('Please enter event title');
      return;
    }

    const newEvent = {
      event_date: selectedDate,
      event_title: eventForm.title,
      event_theme: eventForm.theme
    };

    setEvents([...events, newEvent]);
    setIsModalOpen(false);
    setEventForm({ title: '', theme: 'blue' });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEventForm({ title: '', theme: 'blue' });
  };

  const isToday = (date) => {
    const today = new Date();
    const d = new Date(currentYear, currentMonth, date);
    return today.toDateString() === d.toDateString();
  };

  const calendarDays = getCalendarDays();

  return (
    <div className="antialiased sans-serif bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-2 md:py-24">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between py-2 px-6">
            <div>
              <span className="text-lg font-bold text-gray-800">{monthNames[currentMonth]}</span>
              <span className="ml-1 text-lg text-gray-600 font-normal">{currentYear}</span>
            </div>
            <div className="border rounded-lg px-1" style={{ paddingTop: '2px' }}>
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={currentMonth === 0}
                className={`leading-none rounded-lg transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 items-center ${
                  currentMonth === 0 ? 'cursor-not-allowed opacity-25' : ''
                }`}
              >
                <svg className="h-6 w-6 text-gray-500 inline-flex leading-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="border-r inline-flex h-6"></div>
              <button
                type="button"
                onClick={handleNextMonth}
                disabled={currentMonth === 11}
                className={`leading-none rounded-lg transition ease-in-out duration-100 inline-flex items-center cursor-pointer hover:bg-gray-200 p-1 ${
                  currentMonth === 11 ? 'cursor-not-allowed opacity-25' : ''
                }`}
              >
                <svg className="h-6 w-6 text-gray-500 inline-flex leading-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="-mx-1 -mb-1">
            {/* Day Headers */}
            <div className="flex flex-wrap" style={{ marginBottom: '-40px' }}>
              {daysOfWeek.map((day, index) => (
                <div key={index} style={{ width: '14.26%' }} className="px-2 py-2">
                  <div className="text-gray-600 text-sm uppercase tracking-wide font-bold text-center">
                    {day}
                  </div>
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="flex flex-wrap border-t border-l">
              {/* Blank days */}
              {calendarDays.filter(d => !d.isCurrentMonth && d.date.getMonth() < currentMonth).map((dayInfo, idx) => (
                <div
                  key={`blank-${idx}`}
                  style={{ width: '14.28%', height: '120px' }}
                  className="text-center border-r border-b px-4 pt-2"
                ></div>
              ))}

              {/* Current month days */}
              {calendarDays.filter(d => d.isCurrentMonth).map((dayInfo, idx) => {
                const dayEvents = events.filter(e => 
                  new Date(e.event_date).toDateString() === dayInfo.date.toDateString()
                );

                return (
                  <div
                    key={`day-${idx}`}
                    style={{ width: '14.28%', height: '120px' }}
                    className="px-4 pt-2 border-r border-b relative"
                  >
                    <div
                      onClick={() => handleDayClick(dayInfo.date)}
                      className={`inline-flex w-6 h-6 items-center justify-center cursor-pointer text-center leading-none rounded-full transition ease-in-out duration-100 ${
                        isToday(dayInfo.day)
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-700 hover:bg-blue-200'
                      }`}
                    >
                      {dayInfo.day}
                    </div>
                    <div style={{ height: '80px' }} className="overflow-y-auto mt-1">
                      {dayEvents.map((event, eventIdx) => (
                        <div
                          key={eventIdx}
                          className={`px-2 py-1 rounded-lg mt-1 overflow-hidden border ${
                            event.event_theme === 'blue'
                              ? 'border-blue-200 text-blue-800 bg-blue-100'
                              : event.event_theme === 'red'
                              ? 'border-red-200 text-red-800 bg-red-100'
                              : event.event_theme === 'yellow'
                              ? 'border-yellow-200 text-yellow-800 bg-yellow-100'
                              : event.event_theme === 'green'
                              ? 'border-green-200 text-green-800 bg-green-100'
                              : 'border-purple-200 text-purple-800 bg-purple-100'
                          }`}
                        >
                          <p className="text-sm truncate leading-tight">{event.event_title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {isModalOpen && (
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} className="fixed z-40 top-0 right-0 left-0 bottom-0 h-full w-full">
          <div className="p-4 max-w-xl mx-auto relative absolute left-0 right-0 overflow-hidden mt-24">
            <div
              className="shadow absolute right-0 top-0 w-10 h-10 rounded-full bg-white text-gray-500 hover:text-gray-800 inline-flex items-center justify-center cursor-pointer"
              onClick={handleCloseModal}
            >
              <svg className="fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M16.192 6.344L11.949 10.586 7.707 6.344 6.293 7.758 10.535 12 6.293 16.242 7.707 17.656 11.949 13.414 16.192 17.656 17.606 16.242 13.364 12 17.606 7.758z" />
              </svg>
            </div>

            <div className="shadow w-full rounded-lg bg-white overflow-hidden w-full block p-8">
              <h2 className="font-bold text-2xl mb-6 text-gray-800 border-b pb-2">Add Event Details</h2>

              <div className="mb-4">
                <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Event title</label>
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="Enter event title"
                />
              </div>

              <div className="mb-4">
                <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Event date</label>
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                  type="text"
                  value={selectedDate ? selectedDate.toDateString() : ''}
                  readOnly
                />
              </div>

              <div className="inline-block w-64 mb-4">
                <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Select a theme</label>
                <div className="relative">
                  <select
                    value={eventForm.theme}
                    onChange={(e) => setEventForm({ ...eventForm, theme: e.target.value })}
                    className="block appearance-none w-full bg-gray-200 border-2 border-gray-200 hover:border-gray-500 px-4 py-2 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-gray-700"
                  >
                    {themes.map((theme) => (
                      <option key={theme.value} value={theme.value}>
                        {theme.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-right">
                <button
                  type="button"
                  className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm mr-2"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 border border-gray-700 rounded-lg shadow-sm"
                  onClick={handleAddEvent}
                >
                  Save Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalenderBTN;
