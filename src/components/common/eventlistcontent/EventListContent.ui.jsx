import React from "react";
import { Calendar, Tag, X } from "lucide-react";

// Event Card Component
export const EventCard = ({ event, index }) => {
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
        {date.toDateString()}
      </p>
    </div>
  );
};

// Skeleton Loader for Events
export const EventSkeleton = () => (
  <div className="p-5 rounded-xl bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse space-y-3 transition-all duration-700 ease-in-out">
    <div className="h-4 w-24 bg-gray-300 rounded"></div>
    <div className="h-5 w-3/4 bg-gray-300 rounded"></div>
    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
  </div>
);

const EventListContentUI = ({ events, loading, loaded, isModal = false, onClose }) => {
  return (
    <div
      className={`relative transition-all duration-700 ease-in-out transform overflow-y-auto`}
      style={{
        maxHeight: "75vh",
        scrollbarWidth: "thin",
        scrollbarColor: "#c4c4c4 transparent",
        paddingRight: "8px", // prevent right jerk
      }}
    >
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="flex justify-between items-center px-1 py-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-800">Events</h2>
          </div>
          {isModal && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {/* Subtle gradient fade */}
      </div>

      {/* Content Section */}
      <div className={`pt-3 pb-6 transition-all duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading || !loaded ? (
            Array.from({ length: 4 }).map((_, idx) => <EventSkeleton key={idx} />)
          ) : events.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">No events found.</p>
          ) : (
            events.map((event, i) => <EventCard key={event.id} event={event} index={i} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default EventListContentUI;