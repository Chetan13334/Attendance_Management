import React from "react";
import { Calendar, Tag, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ✅ Redux Imports
import { useSelector, useDispatch } from "react-redux";
import { deleteEvent } from "../../redux/slices/eventSlice";

// Skeleton Loader (unchanged)
const EventCardSkeleton = () => {
    return (
        <div className="relative bg-white p-6 rounded-xl shadow-lg transition-all duration-300">
            <div className="animate-pulse space-y-4">
                <div className="absolute top-0 right-0 m-4 p-2 rounded-full bg-gray-200 h-9 w-9"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                
                <div className="space-y-2 pt-3 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                        <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/5"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const getThemeColorClass = (theme) => {
  const t = theme ? theme.toLowerCase() : '';

  if (t.includes('blue')) return { shadowRgb: '59, 130, 246', text: 'text-blue-800', tagBg: 'bg-blue-50', icon: 'text-blue-600' };
  if (t.includes('red') || t.includes('holiday')) return { shadowRgb: '239, 68, 68', text: 'text-red-800', tagBg: 'bg-red-50', icon: 'text-red-600' };
  if (t.includes('yellow') || t.includes('warning')) return { shadowRgb: '245, 158, 11', text: 'text-yellow-800', tagBg: 'bg-yellow-50', icon: 'text-yellow-600' };
  if (t.includes('green') || t.includes('release')) return { shadowRgb: '34, 197, 94', text: 'text-green-800', tagBg: 'bg-green-50', icon: 'text-green-600' };
  if (t.includes('purple') || t.includes('meeting')) return { shadowRgb: '168, 85, 247', text: 'text-purple-800', tagBg: 'bg-purple-50', icon: 'text-purple-600' };
  if (t.includes('pink') || t.includes('social')) return { shadowRgb: '236, 72, 153', text: 'text-pink-800', tagBg: 'bg-pink-50', icon: 'text-pink-600' };
  if (t.includes('indigo') || t.includes('onboarding')) return { shadowRgb: '99, 102, 241', text: 'text-indigo-800', tagBg: 'bg-indigo-50', icon: 'text-indigo-600' };
    
  return { shadowRgb: '107, 114, 128', text: 'text-gray-700', tagBg: 'bg-gray-50', icon: 'text-gray-500' };
};

// ✅ No events coming from props now
const AllEventsModal = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Get events from Redux
  const events = useSelector((state) => state.events.list);

  const handleClose = () => {
    if (onClose) onClose();
  };

  const sortedEvents = [...events].sort((a, b) => new Date(b.event_date) - new Date(a.event_date));
  
  const isLoading = !events;

  let content;

  if (isLoading) {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    );
  } else if (events.length === 0) {
    content = (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-gray-100 p-5 rounded-2xl mb-4 shadow-inner">
          <Calendar className="h-8 w-8 text-gray-400" />
        </div>
        <h4 className="text-lg font-semibold text-gray-700 mb-1">
          No Events Found
        </h4>
        <p className="text-gray-500 text-sm">
          There are no upcoming events to display.
        </p>
      </div>
    );
  } else {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedEvents.map((event, index) => {
          const eventDate = new Date(event.event_date);
          const eventTime = event.created_at ? new Date(event.created_at) : null;
          const colors = getThemeColorClass(event.event_theme);

          const dateDisplay = eventDate.toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          });
          
          const timeDisplay = eventTime ? eventTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }) : 'All Day';

          const shadowStyle = {
              boxShadow: `0 5px 15px -3px rgba(${colors.shadowRgb}, 0.3), 0 2px 4px -2px rgba(${colors.shadowRgb}, 0.15)`
          };

          return (
            <div
              key={index}
              className={`relative bg-white p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.03]`}
              style={shadowStyle}
            >

              {/* ✅ DELETE BUTTON */}
              <button
                onClick={() => dispatch(deleteEvent(event.id))}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                ✕
              </button>

              <div className={`absolute top-0 right-0 m-4 p-2 rounded-full ${colors.tagBg}`}>
                <Tag className={`h-5 w-5 ${colors.icon}`} />
              </div>

              <h3 className="text-lg text-gray-900 leading-snug mb-3 pr-10">
                {event.event_title || "Untitled Event"}
              </h3>
              
              <div className="space-y-2 text-sm">
                
                <p className="flex items-center gap-2 text-gray-700">
                  <Calendar className={`h-4 w-4 ${colors.icon} flex-shrink-0`} />
                  <span className="font-normal">{dateDisplay}</span>
                </p>
                
                <p className="flex items-center gap-2 text-gray-600">
                  <Clock className={`h-4 w-4 ${colors.icon} flex-shrink-0`} />
                  <span>{timeDisplay}</span>
                </p>

                <p className={`flex items-center gap-2 pt-2 border-t border-gray-100 ${colors.text}`}>
                    <Tag className={`h-4 w-4 ${colors.text} flex-shrink-0`} />
                    <span className="font-normal">{event.event_theme || 'General Event'}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full min-h-screen bg-white">
      <div className="w-full max-w-6xl mx-auto flex flex-col transition-all duration-500">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                All Events Overview
              </h2>
              <p className="text-sm text-gray-500">
                {events.length} event{events.length !== 1 ? "s" : ""} scheduled
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full transition-colors duration-200 hover:bg-gray-100"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-8 bg-gray-50 flex-grow">
          {content}
        </div>
      </div>
    </div>
  );
};

export default AllEventsModal;
