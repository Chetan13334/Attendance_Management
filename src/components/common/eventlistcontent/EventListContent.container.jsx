import React from "react";
import EventListContentUI from "./EventListContent.ui";
import { useEventListContentData } from "./useEventListContentData";

const EventListContentContainer = ({ isModal = false, onClose }) => {
  const {
    events,
    loading,
    loaded,
    setLoaded
  } = useEventListContentData();

  return (
    <EventListContentUI
      events={events}
      loading={loading}
      loaded={loaded}
      isModal={isModal}
      onClose={onClose}
    />
  );
};

export default EventListContentContainer;