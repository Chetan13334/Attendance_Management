import { UserCheck, UserX, Clock, Calendar } from "lucide-react";

export const useStatsData = (stats = [], onEventsClick, events, eventLoading) => {
  const eventCount = events ? events.length : 0;

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

  return {
    currentStats
  };
};