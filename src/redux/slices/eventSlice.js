import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
let socket;

const getAuthHeaders = () => {
  const headers = {
    'Content-Type': 'application/json'
  };
  const token = localStorage.getItem("authToken");
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const listenToEvents = createAsyncThunk(
  "events/listenToEvents",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      console.log("Fetching events...");
      const response = await fetch(`${API_BASE_URL}/events`, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      if (!response.ok) throw new Error("Failed to fetch events");

      const events = await response.json();

      // Normalize
      // Normalize
      const formattedEvents = events.map(ev => ({
        ...ev,
        id: ev._id,
        event_title: ev.title || ev.event_title || "No Title",
        // Recover color from description (primary storage) or mapped type (fallback)
        event_theme: ev.description || ev.event_theme || (ev.type === "Holiday" ? "green" : ev.type === "Meeting" ? "yellow" : "blue"),
        event_date: ev.event_date || ev.start || ev.end
      }));

      dispatch(setEvents(formattedEvents));

      // Socket config
      if (!socket) {
        // Pass token in auth object for socket handshake if supported
        // const token = localStorage.getItem("authToken");
        socket = io(API_BASE_URL.replace('/api', ''), {
          withCredentials: true,
          // auth: { token } // enable if backend socket requires it
        });
      }

      socket.off("eventsUpdated");
      socket.on("eventsUpdated", (event) => {
        console.log("Event update received:", event);
        // Simplest robust strategy: Re-fetch list
        dispatch(listenToEvents());
      });

      // Thunks should NOT return functions (cleanup logic must be handled in useEffects if needed)
      // We return the data so the fulfilled action has a payload
      return formattedEvents;

    } catch (error) {
      console.error("Events fetch error:", error);
      return rejectWithValue(error.message);
    }
  }
);


export const createEvent = createAsyncThunk(
  "events/createEvent",
  async ({ event_title, event_theme, event_date }, { rejectWithValue }) => {
    try {
      // map frontend theme colors to backend valid 'type' enum if needed, or just default to 'Event'
      // Valid backend types likely: 'Event', 'Holiday', 'Meeting'
      let backendType = "Event";
      if (event_theme === "green") backendType = "Holiday"; // Example mapping
      else if (event_theme === "yellow") backendType = "Meeting";
      else backendType = "Event";

      const payload = {
        title: event_title,
        type: backendType, // Sent valid enum
        event_theme: event_theme || "blue", // Keep visual theme for frontend
        start: event_date instanceof Date ? event_date.toISOString() : event_date,
        end: event_date instanceof Date ? event_date.toISOString() : event_date,
        event_date: event_date instanceof Date ? event_date.toISOString() : event_date,
        description: event_theme || "blue" // Store theme in description to persist it
      };

      console.log("POSTING event:", payload);

      const response = await fetch(`${API_BASE_URL}/events/add`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let errorMessage = "Failed to create event";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error("❌ Backend Event Error:", errorData);
        } catch (e) {
          console.error("❌ Could not parse backend event error text:", await response.text());
        }
        throw new Error(errorMessage);
      }

      const newEvent = await response.json();
      return newEvent.event;

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      if (!response.ok) throw new Error("Failed to delete event");
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const eventSlice = createSlice({
  name: "events",
  initialState: {
    list: [],
    loading: false,
  },
  reducers: {
    setEvents(state, action) {
      state.list = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listenToEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(listenToEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload; // Now using the returned payload
      })
      .addCase(listenToEvents.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.list = state.list.filter(event => event.id !== action.payload);
      })
  },

});

export const { setEvents } = eventSlice.actions;
export default eventSlice.reducer;