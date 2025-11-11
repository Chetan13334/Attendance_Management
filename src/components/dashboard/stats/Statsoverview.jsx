import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { listenToEvents } from "../../../redux/slices/eventSlice";
import StatsContainer from "./Stats.container";

function Statsoverview({ stats = [], onEventsClick }) {
  const dispatch = useDispatch();

  // Redux event data
  const events = useSelector((state) => state.events.list);
  const eventLoading = useSelector((state) => state.events.loading);

  // Fetch events initially
  useEffect(() => {
    dispatch(listenToEvents());
  }, [dispatch]);

  // Pass the event count and events data to the container
  return <StatsContainer stats={stats} onEventsClick={onEventsClick} events={events} eventLoading={eventLoading} />;
}

export default Statsoverview;