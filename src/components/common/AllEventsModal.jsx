import React from "react";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AllEventsModal = ({ onClose, events = [] }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    if (onClose) onClose();
    else navigate("/dashboard");
  };

  return (
    <div className="bg-white/40 backdrop-blur-3xl rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] w-full flex flex-col overflow-hidden transition-all duration-500 border border-gray-100/50">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100/60 bg-gradient-to-r from-white/80 via-gray-50 to-white/80 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-500 text-white shadow-lg shadow-blue-200/30">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
              All Events
            </h2>
            <p className="text-sm text-gray-500">
              {events.length} event{events.length !== 1 ? "s" : ""} scheduled
            </p>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 p-2 rounded-full transition-colors duration-200 hover:bg-gray-100/50"
        >
          ✕
        </button>
      </div>

      {/* Events Section */}
      <div className="p-6 overflow-y-auto bg-gradient-to-b from-white/90 to-gray-50">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-gray-100 p-5 rounded-2xl mb-4 shadow-inner">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-700 mb-1">
              No Events Found
            </h4>
            <p className="text-gray-500 text-sm">
              You don’t have any upcoming events. Add some to your calendar!
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events
              .sort((a, b) => new Date(b.event_date) - new Date(a.event_date))
              .map((event, index) => (
                <div
                  key={index}
                  className="group relative bg-gradient-to-tr from-white/70 to-blue-50/40 backdrop-blur-md rounded-2xl border border-gray-100/60 hover:border-indigo-300/60 hover:shadow-[0_10px_30px_rgba(79,70,229,0.12)] p-6 transition-all duration-300"
                >
                  {/* Glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>

                  <div className="flex justify-between items-start relative z-10">
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-semibold text-lg mb-1 group-hover:text-indigo-600 transition-colors duration-300">
                        {event.event_title || "Untitled Event"}
                      </h3>
                      <div className="mt-2 text-sm text-gray-600 space-y-2">
                        {/* Date */}
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span>
                            {event.event_date
                              ? new Date(event.event_date).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : "No date specified"}
                          </span>
                        </div>

                        {/* Time */}
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-indigo-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>
                            {event.created_at
                              ? new Date(
                                  event.created_at
                                ).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      
    </div>
  );
};

export default AllEventsModal;
