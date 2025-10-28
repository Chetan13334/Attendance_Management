import React, { useState, useEffect } from 'react';
import { UserCheck, UserX, Clock, Calendar } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import AllEventsModal from '../common/AllEventsModal';

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

  const gradientBg = {
    green: "from-green-200 to-green-100",
    red: "from-red-200 to-red-100",
    blue: "from-blue-200 to-blue-100",
    yellow: "from-yellow-200 to-yellow-100",
  };

  const shadowColor = {
    green: "shadow-green-100",
    red: "shadow-red-100",
    blue: "shadow-blue-100",
    yellow: "shadow-yellow-100",
  };

  return (
    <div
      className={`p-6 bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl flex items-center justify-between border border-gray-100 hover:border-${color}-200 cursor-pointer transform hover:-translate-y-1 ${shadowColor[color] || 'shadow-gray-100'}`}
      onClick={onClick}
    >
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-xl bg-gradient-to-br ${gradientBg[color] || 'from-gray-400 to-gray-600'} text-white shadow-md`}>
        {IconComponent && <IconComponent className="w-6 h-6" />}
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
      <AllEventsModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        events={events} 
      />
    </>
  );
}

export default Statsoverview;