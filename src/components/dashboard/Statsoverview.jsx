import React from 'react';
import { UserCheck, UserX, Clock, Calendar } from 'lucide-react';


const IconMap = {
  UserCheck,
  UserX,
  Clock,
  Calendar,
};


const StatCard = ({ title, value, icon: Icon, color }) => {
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
      className={`p-5 bg-white rounded-xl shadow-lg transition duration-300 hover:shadow-xl flex items-center justify-between border-t-4 ${borderColor[color] || 'border-gray-500'}`}
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


function Statsoverview({ stats = [] }) {
  
  if (!stats.length) {
    stats = [
      { title: "Active Users", value: 1200, icon: UserCheck, color: "green" },
      { title: "Inactive Users", value: 80, icon: UserX, color: "red" },
      { title: "Clocked Hours", value: 56, icon: Clock, color: "blue" },
      { title: "Events", value: 24, icon: Calendar, color: "yellow" },
    ];
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}

export default Statsoverview;
