// src/redux/slices/eventSlice.js (COMPLETE AND CORRECTED)

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";

let unsubscribe = null;

/* -------------------------------------------------
    LISTEN TO EVENTS (real-time & serializable)
    ------------------------------------------------- */
export const listenToEvents = createAsyncThunk(
  "events/listenToEvents",
  async (_, { dispatch }) => {
    // stop previous listener if any
    if (unsubscribe) unsubscribe();

    const colRef = collection(db, "Events");
    
    return new Promise((resolve, reject) => {
        unsubscribe = onSnapshot(colRef, 
            (snapshot) => {
                const list = snapshot.docs.map((d) => {
                    const data = d.data();
                    
                    // 🚨 CRITICAL FIX: Convert Firestore Timestamps to JavaScript Date Objects
                    const event_date = data.event_date?.toDate ? data.event_date.toDate() : data.event_date;
                    const created_at = data.created_at?.toDate ? data.created_at.toDate() : data.created_at;

                    return {
                        id: d.id,
                        ...data,
                        event_date: event_date, // Now a serializable JS Date
                        created_at: created_at, // Now a serializable JS Date
                    };
                });
                
                // Dispatch the clean, serializable list to the reducer
                dispatch(setEvents(list));
                
                // Resolve the promise once the initial data is fetched to complete the thunk lifecycle
                if (snapshot.docChanges().length > 0 || list.length > 0) {
                    resolve();
                }
            },
            (error) => {
                console.error("Firebase listener error:", error);
                reject(error);
            }
        );
    });
  }
);

/* -------------------------------------------------
    CREATE EVENT
    ------------------------------------------------- */
export const createEvent = createAsyncThunk(
  "events/createEvent",
  async ({ event_title, event_theme, event_date }) => {
    const colRef = collection(db, "Events");
    const docRef = await addDoc(colRef, {
      event_title,
      event_theme,
      event_date,
      created_at: serverTimestamp(),
    });
    return { id: docRef.id, event_title, event_theme, event_date };
  }
);

/* -------------------------------------------------
    DELETE EVENT
    ------------------------------------------------- */
export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (id) => {
    await deleteDoc(doc(db, "Events", id));
    return id;
  }
);

/* -------------------------------------------------
    SLICE
    ------------------------------------------------- */
const eventSlice = createSlice({
  name: "events",
  initialState: {
    list: [],
    loading: false,
  },
  reducers: {
    setEvents(state, action) {
      state.list = action.payload;
      state.loading = false; // Reset loading when data is successfully received
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listenToEvents.pending, (state) => {
        state.loading = true; // Set loading when we start listening
      })
      // Optional: Optimistic update for deletion
      .addCase(deleteEvent.fulfilled, (state, action) => {
          state.list = state.list.filter(event => event.id !== action.payload);
      })
  },
  
});

export const { setEvents } = eventSlice.actions;
export default eventSlice.reducer;