import React from 'react';
import { Calendar } from 'lucide-react';

const AllEventsModal = ({ isOpen, onClose, events }) => {
  if (!isOpen) return null;

  return (
   <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-xl transition-all duration-300 animate-in fade-in">
  <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-3xl max-h-[90vh] mx-4 flex flex-col border border-gray-100/50 animate-in zoom-in-95 duration-300">
    
    {/* Header with gradient */}
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 relative">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">All Events</h3>
            <p className="text-blue-100 text-sm">{events.length} events scheduled</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    {/* Events List */}
    <div className="overflow-y-auto flex-grow p-6">
      {events.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
          <h4 className="text-xl font-semibold text-gray-700 mb-2">No Events Found</h4>
          <p className="text-gray-500">There are no events scheduled at the moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events
            .sort((a, b) => new Date(b.event_date) - new Date(a.event_date))
            .map((event, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-2xl p-5 bg-white hover:border-blue-200 transition-all duration-300 hover:shadow-md group"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 w-3 h-3 rounded-full ${
                        event.event_theme === 'blue'
                          ? 'bg-blue-500'
                          : event.event_theme === 'red'
                          ? 'bg-red-500'
                          : event.event_theme === 'yellow'
                          ? 'bg-yellow-500'
                          : event.event_theme === 'green'
                          ? 'bg-green-500'
                          : event.event_theme === 'purple'
                          ? 'bg-purple-500'
                          : 'bg-gray-500'
                      }`}></div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                          {event.event_title}
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="flex items-center text-sm text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {event.event_date
                              ? new Date(event.event_date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })
                              : 'Date not specified'}
                          </span>
                          <span className="flex items-center text-sm text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {event.created_at
                              ? new Date(event.created_at).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      event.event_theme === 'blue'
                        ? 'bg-blue-100 text-blue-800'
                        : event.event_theme === 'red'
                        ? 'bg-red-100 text-red-800'
                        : event.event_theme === 'yellow'
                        ? 'bg-yellow-100 text-yellow-800'
                        : event.event_theme === 'green'
                        ? 'bg-green-100 text-green-800'
                        : event.event_theme === 'purple'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {event.event_theme}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>

    {/* Footer */}
    <div className="border-t border-gray-100 p-6 bg-gray-50/50">
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5 focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</div>
  );
};

export default AllEventsModal;