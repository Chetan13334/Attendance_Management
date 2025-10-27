import React, { useState, useEffect } from 'react';
import { UserCheck, UserX, Clock, Calendar } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const IconMap = {
  UserCheck,
  UserX,
  Clock,
  Calendar,
};

const StatCard = ({ title, value, icon: Icon, color, onClick }) => {
  const IconComponent = Icon ? IconMap[Icon.name] : null;

  const borderColor = {
    green: "border-green-500",
    red: "border-red-500",
    blue: "border-blue-500",
    yellow: "border-yellow-500",
  };

  const bgColor = {
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
    blue: "bg-blue-100 text-blue-600",
    yellow: "bg-yellow-100 text-yellow-600",
  };

  return (
    <div
      className={`p-5 bg-white rounded-xl shadow-lg transition duration-300 hover:shadow-xl flex items-center justify-between border-t-4 ${borderColor[color] || 'border-gray-500'} cursor-pointer`}
      onClick={onClick}
    >
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${bgColor[color] || 'bg-gray-100 text-gray-600'}`}>
        {IconComponent && <IconComponent className="w-6 h-6" />}
      </div>
    </div>
  );
};

// Event Modal Component
const EventModal = ({ isOpen, onClose, events }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/30">
  <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto mx-4">
    <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">All Events</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
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

        {events.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No events found</p>
        ) : (
          <div className="space-y-4">
            {events.map((event, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800">{event.event_title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Event On: {event.event_date ? new Date(event.event_date).toLocaleDateString() : 'Date not specified'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.event_theme === 'blue' ? 'bg-blue-100 text-blue-800' :
                    event.event_theme === 'red' ? 'bg-red-100 text-red-800' :
                    event.event_theme === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                    event.event_theme === 'green' ? 'bg-green-100 text-green-800' :
                    event.event_theme === 'purple' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.event_theme || 'default'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Created: {event.created_at ? new Date(event.created_at).toLocaleString() : 'N/A'}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

function Statsoverview({ stats = [] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);

  // Fetch events from Firebase
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsRef = collection(db, 'Events');
        const querySnapshot = await getDocs(eventsRef);
        
        const fetchedEvents = querySnapshot.docs.map(doc => {
          const data = doc.data();
          // Handle Firebase timestamps properly
          const eventDate = data.event_date;
          const createdAt = data.created_at;
          
          return {
            id: doc.id,
            ...data,
            event_date: eventDate?.toDate ? eventDate.toDate() : eventDate,
            created_at: createdAt?.toDate ? createdAt.toDate() : createdAt
          };
        });
        
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleEventCardClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!stats.length) {
    stats = [
      { title: "Active Users", value: 1200, icon: UserCheck, color: "green" },
      { title: "Inactive Users", value: 80, icon: UserX, color: "red" },
      { title: "Clocked Hours", value: 56, icon: Clock, color: "blue" },
      { title: "Events", value: 24, icon: Calendar, color: "yellow", onClick: handleEventCardClick },
    ];
  } else {
    // If stats are provided, find the Events card and add the onClick handler
    stats = stats.map(stat => {
      if (stat.title === "Events") {
        return { ...stat, onClick: handleEventCardClick };
      }
      return stat;
    });
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Event Modal */}
      <EventModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        events={events} 
      />
    </>
  );
}

export default Statsoverview;