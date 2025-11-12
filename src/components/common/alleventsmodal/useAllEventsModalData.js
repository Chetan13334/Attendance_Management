import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listenToEvents } from "../../../redux/slices/eventSlice";

export const useAllEventsModalData = () => {
  const dispatch = useDispatch();
  const { list: events = [], loading } = useSelector((state) => state.events);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    dispatch(listenToEvents()).then(() => {
      // Add a slight delay to show skeleton → data transition
      setTimeout(() => setLoaded(true), 300);
    });
  }, [dispatch]);

  return {
    events,
    loading,
    loaded,
    setLoaded
  };
};