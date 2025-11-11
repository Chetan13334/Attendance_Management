import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  listenToEvents,
  createEvent,
  deleteEvent,
} from "../../../redux/slices/eventSlice";
import { listenToEmployees } from "../../../redux/slices/employeeSlice";

export const useCalendarData = () => {
  const dispatch = useDispatch();

  const { list: events } = useSelector((state) => state.events);
  const { list: employees } = useSelector((state) => state.employees);

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventForm, setEventForm] = useState({ title: "", theme: "blue" });
  const [loading, setLoading] = useState(false);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // --- Start real-time listeners ---
  useEffect(() => {
    dispatch(listenToEvents());
    dispatch(listenToEmployees());
  }, [dispatch]);

  // --- DEBUG: Log raw & parsed events ---
  useEffect(() => {
    console.log("Raw Events from Redux:", events);
  }, [events]);

  // --- Parse events safely (Handles ISO string OR Firebase Timestamp) ---
  const getParsedEvents = () => {
    return events
      .map((ev) => {
        let eventDate = null;

        if (ev.event_date) {
          if (typeof ev.event_date === "string") {
            eventDate = new Date(ev.event_date);
          } else if (ev.event_date.toDate) {
            // Firebase Timestamp
            eventDate = ev.event_date.toDate();
          } else if (ev.event_date instanceof Date) {
            eventDate = ev.event_date;
          }

          if (!eventDate || isNaN(eventDate.getTime())) {
            console.warn("Invalid event_date:", ev.event_date, ev);
            return null;
          }
        }

        return { ...ev, event_date: eventDate };
      })
      .filter(Boolean); // Remove nulls
  };

  const parsedEvents = getParsedEvents();

  // --- Parse employees ---
  const getParsedEmployees = () => {
    return employees.map((emp) => ({
      ...emp,
      DateOfBirth: emp.DateOfBirth
        ? typeof emp.DateOfBirth === "string"
          ? new Date(emp.DateOfBirth)
          : emp.DateOfBirth.toDate
          ? emp.DateOfBirth.toDate()
          : emp.DateOfBirth
        : null,
    }));
  };

  const parsedEmployees = getParsedEmployees();

  // --- Calendar days ---
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

  // --- Birthdays ---
  const getBirthdaysForDate = (date) => {
    if (!date) return [];
    return parsedEmployees.filter((emp) => {
      if (!emp.DateOfBirth) return false;
      return (
        emp.DateOfBirth.getDate() === date.getDate() &&
        emp.DateOfBirth.getMonth() === date.getMonth()
      );
    });
  };

  // --- Events for date ---
  const getEventsForDate = (date) => {
    if (!date) return [];
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    return parsedEvents.filter((ev) => {
      if (!ev.event_date) return false;
      const evDate = new Date(ev.event_date);
      evDate.setHours(0, 0, 0, 0);
      return evDate.getTime() === target.getTime();
    });
  };

  // --- Navigation ---
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // --- Modal ---
  const handleDayClick = (date) => {
    if (!date) return;
    setSelectedDate(date);
    setEventForm({ title: "", theme: "blue" });
    setIsModalOpen(true);
  };

  // --- Add Event ---
  const handleAddEvent = async () => {
    if (!eventForm.title.trim() || !selectedDate) {
      alert("Please add an event title");
      return;
    }
    setLoading(true);
    try {
      await dispatch(
        createEvent({
          event_title: eventForm.title,
          event_theme: eventForm.theme,
          event_date: selectedDate, // ← Date object
        })
      ).unwrap();

      setIsModalOpen(false);
      setEventForm({ title: "", theme: "blue" });
    } catch (err) {
      console.error("Error adding event:", err);
      alert("Failed to add event");
    } finally {
      setLoading(false);
    }
  };

  // --- Delete Event ---
  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await dispatch(deleteEvent(id)).unwrap();
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event");
    }
  };

  return {
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
    setCurrentMonth,
    setCurrentYear,
    setIsModalOpen,
    setSelectedDate,
    setEventForm,
    setLoading,
    handlePrevMonth,
    handleNextMonth,
    handleDayClick,
    handleAddEvent,
    handleDeleteEvent,
    getBirthdaysForDate,
    getEventsForDate,
  };
};