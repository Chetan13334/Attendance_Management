import React from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
// Import the refactored content component
import EventListContentContainer from "../eventlistcontent/EventListContent.container";

const AllEventsModalContainer = ({ onClose }) => {
  // Use selector only for the count for the header
  const { list: events = [] } = useSelector((state) => state.events);

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b bg-gradient-to-r from-indigo-50 to-purple-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-bold">All Events</h2>
              <p className="text-sm text-gray-600">{events.length} events</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-white/50">
            X
          </button>
        </div>

        {/* Modal Body: Use the core content component */}
        <EventListContentContainer isModal={true} onClose={onClose} /> 
      </div>
    </div>,
    document.body
  );
};

export default AllEventsModalContainer;