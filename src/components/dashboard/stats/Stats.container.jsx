import React from "react";
import StatsUI from "./Stats.ui";
import { useStatsData } from "./useStatsData";

const StatsContainer = ({ stats = [], onEventsClick, events, eventLoading }) => {
  // Pass events and eventLoading to the hook
  const { currentStats } = useStatsData(stats, onEventsClick, events, eventLoading);

  return <StatsUI currentStats={currentStats} />;
};

export default StatsContainer;