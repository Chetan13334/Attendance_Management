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
                                // Richer gradient background, rounded corners, slight shadow
                                className="relative bg-pink-500 rounded-lg p-2 flex items-center space-x-2.5 shadow-md overflow-hidden
               transform transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg cursor-pointer"
                              >
                                {/* Confetti overlay for a festive look */}
                                <div
                                  className="absolute inset-0 opacity-20 pointer-events-none"
                                  style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath fill-rule='evenodd' d='M0 10l9.991-7.07L20 10l-10.009 7.07L0 10zm10 4a4 4 0 100-8 4 4 0 000 8z'/%3E%3C/g%3E%3C/svg%3E")`,
                                    backgroundSize: "20px 20px",
                                    backgroundBlendMode: "overlay",
                                  }}
                                ></div>

                                <div className="relative flex-shrink-0 z-10">
                                  {" "}
                                  {/* Ensure image is above confetti */}
                                  <img
                                    src={
                                      b.Photo ||
                                      "https://placehold.co/40x40/ffffff/777?text=P" // White placeholder for contrast
                                    }
                                    alt={b.Name}
                                    // Slightly larger avatar with a festive border
                                    className="w-10 h-10 rounded-full object-cover border-2 border-yellow-300 shadow-sm"
                                  />
                                  {/* Balloon icon as a festive badge */}
                                  <span
                                    className="absolute -bottom-1 -right-1 text-sm leading-none z-20"
                                    title="Birthday"
                                  >
                                    🎈
                                  </span>
                                </div>

                                <div className="flex flex-col text-left overflow-hidden leading-tight z-10">
                                  {" "}
                                  {/* Ensure text is above confetti */}
                                  {/* Name in white for contrast */}
                                  <span className="font-bold text-white text-sm truncate">
                                    {b.Name}
                                  </span>
                                  {/* "Happy Birthday!" message with a distinct color */}
                                  <span className="text-yellow-200 text-xs font-semibold">
                                    Happy Birthday!
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

export default CalenderCom;
