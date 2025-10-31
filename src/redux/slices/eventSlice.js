import { createSlice } from "@reduxjs/toolkit";

const eventSlice = createSlice({
  name: "events",
  initialState: {
    list: [],
  },
  reducers: {
    setEvents(state, action) {
      state.list = action.payload;
    },
    addEvent(state, action) {
      state.list.push(action.payload);
    },
    updateEvent(state, action) {
      const { id, data } = action.payload;
      const index = state.list.findIndex(ev => ev.id === id);
      if (index !== -1) state.list[index] = { ...state.list[index], ...data };
    },
    deleteEvent(state, action) {
      state.list = state.list.filter(ev => ev.id !== action.payload);
    }
  }
});

export const { setEvents, addEvent, updateEvent, deleteEvent } = eventSlice.actions;
export default eventSlice.reducer;
