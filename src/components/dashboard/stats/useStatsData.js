import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserCheck, UserX, Clock, Calendar } from "lucide-react";
import { fetchLeaveRequests } from "../../../redux/slices/leaveSlice";

export const useStatsData = (stats = [], onEventsClick, events, eventLoading) => {
  const dispatch = useDispatch();
  const { list: leaves } = useSelector((state) => state.leaves);
  const eventCount = events ? events.length : 0;

  useEffect(() => {
    if (leaves.length === 0) {
      dispatch(fetchLeaveRequests());
    }
  }, [dispatch, leaves.length]);

  const pendingLeaves = leaves.filter(l => l.status === "Pending" || l.status === "pending").length;

  // Default stats with onEventsClick instead of navigation
  const defaultStats = [
    {
      title: "Active Users",
      value: 1200,
      icon: UserCheck,
      color: "green",
      onClick: () => { } // Dummy handler for click effect
    },
    {
      title: "Pending Requests", // Changed from Inactive Users to be more relevant
      value: pendingLeaves,
      icon: UserX,
      color: "red",
      onClick: () => { } // Dummy handler for click effect
    },
    {
      title: "Clocked Hours",
      value: 56,
      icon: Clock,
      color: "blue",
      onClick: () => { } // Dummy handler for click effect
    },
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