import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

// ✅ Fetch Events from Firestore (UPDATED FOR DATE CONVERSION)
export const fetchEvents = createAsyncThunk("events/fetchEvents", async () => {
  const querySnapshot = await getDocs(collection(db, "Events"));
  let eventsList = [];
  querySnapshot.forEach((docItem) => {
    const data = docItem.data();

    const eventDate = data.event_date?.toDate ? data.event_date.toDate().toISOString() : data.event_date;
    const createdAt = data.created_at?.toDate ? data.created_at.toDate().toISOString() : data.created_at;

    eventsList.push({ 
      id: docItem.id, 
      ...data, 
      event_date: eventDate,
      created_at: createdAt,
    });
  });
  return eventsList;
});

// ✅ Delete Event (No Change)
export const deleteEvent = createAsyncThunk("events/deleteEvent", async (id) => {
  await deleteDoc(doc(db, "Events", id));
  return id;
});

const eventSlice = createSlice({
  name: "events",
  initialState: {
    list: [],
    loading: false,
    // You might want to add an error state here: error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.list = state.list.filter((event) => event.id !== action.payload);
      });
      // 💡 Suggestion: Consider adding .addCase(fetchEvents.rejected, ...) to handle errors
  },
});

export default eventSlice.reducer;