// src/components/dashboard/CalenderCom.jsx
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Back_Button from "../assets/left-arrow.png";

const CalenderCom = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventForm, setEventForm] = useState({ title: "", theme: "blue" });
  const [loading, setLoading] = useState(false);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // --- Firestore: realtime events ---
  useEffect(() => {
    const eventsRef = collection(db, "Events");
    const q = query(eventsRef, orderBy("event_date", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => {
          const data = doc.data();
          const raw = data.event_date;
          const event_date = raw && raw.toDate ? raw.toDate() : new Date(raw);
          return { id: doc.id, ...data, event_date };
        });
        setEvents(list);
      },
      (err) => console.error("Events listener error:", err)
    );

    return () => unsubscribe();
  }, []);

  // --- Firestore: realtime employees (for birthdays) ---
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "Employee_Details"),
      (snapshot) => {
        const list = snapshot.docs.map((doc) => {
          const data = doc.data();
          const raw = data.DateOfBirth;
          const DateOfBirth =
            raw && raw.toDate ? raw.toDate() : raw ? new Date(raw) : null;
          return { id: doc.id, ...data, DateOfBirth };
        });
        setEmployees(list);
      },
      (err) => console.error("Employees listener error:", err)
    );

    return () => unsubscribe();
  }, []);

  // --- calendar day generation ---
  const getCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const days = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++)
      days.push(new Date(currentYear, currentMonth, d));
    return days;
  };
  const calendarDays = getCalendarDays();
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7)
    weeks.push(calendarDays.slice(i, i + 7));

  // --- Birthday finder ---
  const getBirthdaysForDate = (date) => {
    if (!date) return [];
    return employees.filter((emp) => {
      if (!emp.DateOfBirth) return false;
      return (
        emp.DateOfBirth.getDate() === date.getDate() &&
        emp.DateOfBirth.getMonth() === date.getMonth()
      );
    });
  };

  // --- events for date ---
  const getEventsForDate = (date) => {
    if (!date) return [];
    return events.filter((ev) => {
      if (!ev.event_date) return false;
      const d1 = new Date(ev.event_date);
      d1.setHours(0, 0, 0, 0);
      const d2 = new Date(date);
      d2.setHours(0, 0, 0, 0);
      return d1.getTime() === d2.getTime();
    });
  };

  // --- navigation ---
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else setCurrentMonth((m) => m - 1);
  };
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else setCurrentMonth((m) => m + 1);
  };
  const handleBackToCalendar = () => navigate("/calendar");

  // --- OPEN modal ---
  const handleDayClick = (date) => {
    if (!date) return;
    setSelectedDate(date);
    setEventForm({ title: "", theme: "blue" });
    setIsModalOpen(true);
  };

  // --- Add event ---
  const handleAddEvent = async () => {
    if (!eventForm.title.trim() || !selectedDate) {
      alert("Please add an event title");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "Events"), {
        event_date: selectedDate,
        event_title: eventForm.title,
        event_theme: eventForm.theme,
        created_at: new Date(),
      });
      setIsModalOpen(false);
      setEventForm({ title: "", theme: "blue" });
    } catch (err) {
      console.error("Error adding event:", err);
      alert("Failed to add event");
    } finally {
      setLoading(false);
    }
  };

  // --- Delete event ---
  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await deleteDoc(doc(db, "Events", id));
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event");
    }
  };

  return (
    <div>
      <div className="container mx-auto bg-white rounded shadow overflow-hidden w-full">
        <img
          src={Back_Button}
          alt="Back Button"
          className="h-9 w-9 mt-2 ml-2 bg-white rounded-full hover:scale-105 transition-all duration-300 hover:shadow-lg"
          onClick={() => navigate(-1)}
        />
        <div className="p-4 flex justify-between items-center">
          <span className="text-lg font-bold">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <div className="flex items-center justify-center gap-4 mt-4">
            {/* Previous Month Button */}
            <button
              onClick={handlePrevMonth}
              className="flex items-center gap-2 px-2 py-2 rounded-xl bg-white text-black font-medium shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <ChevronLeft size={20} />
              
            </button>

            {/* Next Month Button */}
            <button
              onClick={handleNextMonth}
              className="flex items-center gap-2 px-2 py-2 rounded-xl bg-white  text-black font-medium shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <table className="w-full table-fixed">
          <thead>
            <tr>
              {daysOfWeek.map((day, i) => (
                <th
                  key={i}
                  className="p-2 bg-gray-50 text-xs md:text-sm text-gray-700"
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
                            {/* Events */}
                            {dayEvents.map((ev) => (
                              <div
                                key={ev.id}
                                className={`relative group text-white rounded p-1 text-xs mb-1 ${ev.event_theme === "blue"
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

                                {/* Delete (X) button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteEvent(ev.id);
                                  }}
                                  className="absolute bottom-0.5 right-1 text-[15px] opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-black"
                                  title="Delete Event"
                                >
                                  🗙
                                </button>
                              </div>
                            ))}

                            {/* Birthdays */}
                            {birthdays.map((b) => (
                              <div
                                key={b.id}
                                className="
      p-2.5 rounded-xl shadow-lg border-2 border-pink-100/50 
      bg-white transition-all duration-300 transform hover:scale-[1.03] 
      hover:shadow-2xl cursor-pointer 
      flex items-center gap-3
    "
                                style={{ maxWidth: '200px' }} // Added max-width for better control if placed in a list
                              >
                                {/* Profile Image with Ring and Decorative Frame */}
                                <div className="relative flex-shrink-0">
                                  <div className="w-8 h-8 p-[1px] rounded-full bg-gradient-to-br from-yellow-300 to-red-500 shadow-md">
                                    <img
                                      src={
                                        b.Photo ||
                                        "https://placehold.co/40x40/fbcfe8/000?text=P"
                                      }
                                      alt={b.Name}
                                      className="w-full h-full rounded-full object-cover border-2 border-white"
                                    />
                                  </div>
                                  {/* Celebration Sparkle Badge */}
                                  <span className="absolute -bottom-[2px] -right-[2px] text-xs bg-purple-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-[2px]">
                                    *
                                  </span>
                                </div>

                                {/* Name and Message */}
                                <div className="flex flex-col text-left leading-snug overflow-hidden">
                                  <span className="font-extrabold text-gray-800 text-[10px] truncate">
                                    {b.Name}
                                  </span>
                                  <span className="text-pink-600 font-semibold text-[9px] italic tracking-tight">
                                    Happy B-Day! 🥳
                                  </span>
                                </div>
                                {/* Decorative Date/Indicator */}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-96 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold mb-1 text-gray-800">
              Add Event
            </h2>
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
                className={`px-5 py-2 rounded-xl font-medium text-white ${loading
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

export default CalenderCom;