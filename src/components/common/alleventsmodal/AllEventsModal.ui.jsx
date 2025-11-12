import React from "react";
import { Calendar } from "lucide-react";

const AllEventsModalUI = ({ eventsCount, onClose }) => {
  return (
    <>
      {/* Modal Header */}
      <div className="p-6 border-b bg-gradient-to-r from-indigo-50 to-purple-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Calendar className="h-7 w-7 text-indigo-600" />
          <div>
            <h2 className="text-xl font-bold">All Events</h2>
            <p className="text-sm text-gray-600">{eventsCount} events</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-white/50">
          X
        </button>
      </div>
    </>
  );
};

export default AllEventsModalUI;