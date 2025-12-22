import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Calendar, Tag, X } from "lucide-react";
import StatsOverview from "../stats/Statsoverview";
import AttendanceTable from "../attendance/AttendanceTable";
import { SkeletonLoader } from "../../common/skeleton/Skeleton";

// Event Card Component
const EventCard = ({ event, index }) => {
  const colors = {
    blue: { bg: "bg-blue-50", icon: "text-blue-600", shadow: "59,130,246" },
    red: { bg: "bg-red-50", icon: "text-red-600", shadow: "239,68,68" },
    yellow: { bg: "bg-yellow-50", icon: "text-yellow-600", shadow: "245,158,11" },
    green: { bg: "bg-green-50", icon: "text-green-600", shadow: "34,197,94" },
    purple: { bg: "bg-purple-50", icon: "text-purple-600", shadow: "168,85,247" },
  };

  const theme = (event.event_theme || "").toLowerCase();
  const color =
    theme.includes("blue")
      ? colors.blue
      : theme.includes("red") || theme.includes("holiday")
        ? colors.red
        : theme.includes("yellow")
          ? colors.yellow
          : theme.includes("green")
            ? colors.green
            : theme.includes("purple")
              ? colors.purple
              : colors.green;

  const date =
    event.event_date?.toDate ? event.event_date.toDate() : new Date(event.event_date);

  return (
    <div
      className={`p-5 rounded-xl bg-white/95 transform transition-all duration-500 ease-out shadow-sm hover:shadow-xl hover:-translate-y-1 opacity-0 animate-fade-in`}
      style={{
        boxShadow: `0 3px 10px rgba(${color.shadow}, 0.08)`,
        animationDelay: `${index * 100}ms`,
        animationFillMode: "forwards",
      }}
    >
      <div className={`inline-block px-2 py-1 rounded-full text-xs ${color.bg} mb-2`}>
        <Tag className={`inline h-3 w-3 mr-1 ${color.icon}`} />
        {event.event_theme}
      </div>
      <h4 className="font-semibold text-gray-800">{event.event_title}</h4>
      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
        <Calendar className="h-3.5 w-3.5" />
        {date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
      </p>
    </div>
  );
};

// Skeleton Loader for Events
const EventSkeleton = () => (
  <SkeletonLoader type="event" />
);

const MainContent = () => {
  const [showEvents, setShowEvents] = useState(false);
  const events = useSelector((state) => state.events.list);
  const employees = useSelector((state) => state.employees.list);

  // Check if data is loading
  const isLoading = !employees || employees.length === 0;

  // Add CSS animation styles
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fade-in {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fade-in {
        animation: fade-in 0.6s ease-out forwards;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleEventsClick = () => {
    setShowEvents(prev => !prev);
  };

  // Close events view and show attendance table
  const handleCloseEvents = () => {
    setShowEvents(false);
  };

  // Sort events by date (newest first)
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = a.event_date?.toDate ? a.event_date.toDate() : new Date(a.event_date);
    const dateB = b.event_date?.toDate ? b.event_date.toDate() : new Date(b.event_date);
    return dateB - dateA;
  });

  return (
    <div className="space-y-6">
      <StatsOverview
        onEventsClick={handleEventsClick}
        events={events}
        eventLoading={isLoading}
      />
      {showEvents ? (
        <div className="bg-white rounded-xl shadow-lg mt-8 p-6">
          <div className="border-b border-gray-100 pb-4 mb-6 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">
              Events
            </h3>
            <button
              onClick={handleCloseEvents}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="pt-3 pb-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <EventSkeleton key={i} />
                ))}
              </div>
            ) : sortedEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedEvents.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No events available</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <AttendanceTable />
      )}
    </div>
  );
};

export default MainContent;