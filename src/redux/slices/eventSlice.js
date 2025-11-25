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


export const listenToEvents = createAsyncThunk(
  "events/listenToEvents",
  async (_, { dispatch }) => {
    
    if (unsubscribe) unsubscribe();

    const colRef = collection(db, "Events");
    
    return new Promise((resolve, reject) => {
        unsubscribe = onSnapshot(colRef, 
            (snapshot) => {
                const list = snapshot.docs.map((d) => {
                    const data = d.data();
                    
                    const event_date = data.event_date?.toDate ? data.event_date.toDate().toISOString() : 
                                     data.event_date ? new Date(data.event_date).toISOString() : null;
                    const created_at = data.created_at?.toDate ? data.created_at.toDate().toISOString() : 
                                     data.created_at ? new Date(data.created_at).toISOString() : null;

                    return {
                        id: d.id,
                        ...data,
                        event_date: event_date, 
                        created_at: created_at, 
                    };
                });
                
                
                dispatch(setEvents(list));
                
                
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
    
    return { 
      id: docRef.id, 
      event_title, 
      event_theme, 
      event_date: event_date instanceof Date ? event_date.toISOString() : event_date 
    };
  }
);


export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (id) => {
    await deleteDoc(doc(db, "Events", id));
    return id;
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
      .addCase(listenToEvents.fulfilled, (state) => {
        state.loading = false; 
      })
     
      .addCase(deleteEvent.fulfilled, (state, action) => {
          state.list = state.list.filter(event => event.id !== action.payload);
      })
  },
  
});

export const { setEvents } = eventSlice.actions;
export default eventSlice.reducer;