import React, { useEffect } from "react";
import { UserCheck, UserX, Clock, Calendar } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { listenToEvents } from "../../redux/slices/eventSlice";

const IconMap = {
  UserCheck,
  UserX,
  Clock,
  Calendar,
};

const StatCard = ({ title, value, icon: Icon, color, onClick }) => {
  const IconComponent = Icon ? IconMap[Icon.name] : null;

  const shadowColor = {
    green: "shadow-green-100",
    red: "shadow-red-100",
    blue: "shadow-blue-100",
    yellow: "shadow-yellow-100",
  };

  const gradientBg = {
    green: "from-green-200 to-green-100",
    red: "from-red-200 to-red-100",
    blue: "from-blue-200 to-blue-100",
    yellow: "from-yellow-100 to-yellow-50",
  };

  return (
    <div
      className={`p-6 bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl flex items-center justify-between border border-gray-100 hover:border-${color}-200 cursor-pointer transform hover:-translate-y-1 ${
        shadowColor[color] || "shadow-gray-100"
      }`}
      onClick={onClick}
    >
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-1 text-3xl font-bold text-gray-900">
          {value === "..." ? "..." : value}
        </p>
      </div>
      <div
        className={`p-3 rounded-xl bg-gradient-to-br ${
          gradientBg[color] || "from-gray-400 to-gray-600"
        } text-white shadow-md`}
      >
        {IconComponent && <IconComponent className="w-6 h-6" />}
      </div>
    </div>
  );
};

function Statsoverview({ stats = [], onEventsClick }) {
  const dispatch = useDispatch();

  // Redux event data
  const events = useSelector((state) => state.events.list);
  const eventLoading = useSelector((state) => state.events.loading);

  // Fetch events initially
  useEffect(() => {
    if (events.length === 0 && !eventLoading) {
      dispatch(listenToEvents());
    }
  }, [dispatch, events.length, eventLoading]);

  const eventCount = events.length;

  // Default stats with onEventsClick instead of navigation
  const defaultStats = [
    { title: "Active Users", value: 1200, icon: UserCheck, color: "green" },
    { title: "Inactive Users", value: 80, icon: UserX, color: "red" },
    { title: "Clocked Hours", value: 56, icon: Clock, color: "blue" },
    {
      title: "Events",
      value: eventCount,
      icon: Calendar,
      color: "yellow",
      onClick: onEventsClick, // ✅ toggle view in dashboard
    },
  ];

  let currentStats = stats.length ? stats : defaultStats;

  // Handle loading state
  if (eventLoading && eventCount === 0) {
    currentStats = currentStats.map((stat) =>
      stat.title === "Events"
        ? { ...stat, value: "...", onClick: onEventsClick }
        : stat
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {currentStats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}

export default Statsoverview;
