
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

const CalenderCom = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventForm, setEventForm] = useState({ title: '', theme: 'blue' });
  const [loading, setLoading] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const themes = [
    { value: 'blue', label: 'Blue Theme' },
    { value: 'red', label: 'Red Theme' },
    { value: 'yellow', label: 'Yellow Theme' },
    { value: 'green', label: 'Green Theme' },
    { value: 'purple', label: 'Purple Theme' }
  ];

  // Fetch events from Firebase
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const eventsRef = collection(db, 'Events');
      const q = query(eventsRef, orderBy('event_date', 'asc'));
      const querySnapshot = await getDocs(q);
      
      const fetchedEvents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        event_date: doc.data().event_date?.toDate() || new Date(doc.data().event_date)
      }));
      
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const getCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const days = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(currentYear, currentMonth, day));
    }
    return days;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else setCurrentMonth(currentMonth - 1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else setCurrentMonth(currentMonth + 1);
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
    setEventForm({ title: '', theme: 'blue' });
  };

  const handleAddEvent = async () => {
    if (!eventForm.title.trim()) {
      alert('Please enter event title');
      return;
    }
    
    setLoading(true);
    try {
      // Add event to Firebase
      const eventsRef = collection(db, 'Events');
      await addDoc(eventsRef, {
        event_date: selectedDate,
        event_title: eventForm.title,
        event_theme: eventForm.theme,
        created_at: new Date()
      });
      
      // Refresh events list
      await fetchEvents();
      
      setIsModalOpen(false);
      setEventForm({ title: '', theme: 'blue' });
      alert('Event added successfully!');
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to add event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getEventsForDate = (date) =>
    events.filter(e => new Date(e.event_date).toDateString() === date?.toDateString());

  const calendarDays = getCalendarDays();
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) weeks.push(calendarDays.slice(i, i + 7));

  const handleBackToCalendar = () => {
    navigate('/calendar');
  };

  return (
    <div className=" ">
      {/* Back Button */}
      

      <div className="container mx-auto bg-white rounded shadow overflow-hidden w-full ">
        <div className="container mx-auto pt-1 px-1">
        <button
          onClick={handleBackToCalendar}
          className="flex items-center gap-1 px-2 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium mb-4"
        >
          <ArrowLeft className=" " />
          Back 
        </button>
      </div>
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4 bg-gray-100">
          <span className="text-lg font-bold">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <div className="flex gap-2">
            <button onClick={handlePrevMonth} className="p-1 text-gray-500 hover:text-black">
              ◀
            </button>
            <button onClick={handleNextMonth} className="p-1 text-gray-500 hover:text-black">
              ▶
            </button>
          </div>
        </div>

        {/* Calendar Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {daysOfWeek.map((day, i) => (
                <th
                  key={i}
                  className="p-2 border text-xs md:text-sm text-gray-700 bg-gray-50"
                >
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
                  return (
                    <td
                      key={di}
                      onClick={() => date && handleDayClick(date)}
                      className={`border p-1 h-32 sm:h-40 overflow-auto cursor-pointer transition-all duration-200 hover:bg-gray-100 align-top ${
                        date ? '' : 'bg-gray-50'
                      }`}
                    >
                      {date && (
                        <div className="flex flex-col h-full">
                          <div className="text-gray-500 text-sm text-right pr-1">{date.getDate()}</div>
                          <div className="flex-grow mt-1 overflow-y-auto">
                            {dayEvents.map((event, idx) => (
                              <div
                                key={idx}
                                className={`text-white rounded p-1 text-xs mb-1 ${
                                  event.event_theme === 'blue'
                                    ? 'bg-blue-400'
                                    : event.event_theme === 'red'
                                    ? 'bg-red-400'
                                    : event.event_theme === 'yellow'
                                    ? 'bg-yellow-400'
                                    : event.event_theme === 'green'
                                    ? 'bg-green-400'
                                    : 'bg-purple-400'
                                }`}
                              >
                                {event.event_title}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50">
  <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-2">Add Event</h2>
            <p className="text-sm text-gray-600 mb-4">
              {selectedDate?.toDateString()}
            </p>

            <input
              type="text"
              placeholder="Event Title"
              value={eventForm.title}
              onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
              className="w-full border p-2 rounded mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <select
              value={eventForm.theme}
              onChange={(e) => setEventForm({ ...eventForm, theme: e.target.value })}
              className="w-full border p-2 rounded mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
            >
              {themes.map((theme) => (
                <option key={theme.value} value={theme.value}>
                  {theme.label}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                disabled={loading}
                className={`px-4 py-2 rounded ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                {loading ? 'Adding...' : 'Add Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalenderCom;
