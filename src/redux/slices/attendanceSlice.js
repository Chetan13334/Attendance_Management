import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, onSnapshot, doc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

let unsubscribe = null;

export const listenToAttendance = createAsyncThunk(
  "attendance/listenToAttendance",
  async (date, { dispatch, rejectWithValue }) => {
    try {
      // Stop previous listener if any
      if (unsubscribe) unsubscribe();

      // Listen to the main attendance collection
      unsubscribe = onSnapshot(collection(db, "attendance"), (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch(setAttendance(data));
      });
      
      // Return a cleanup function
      return () => {
        unsubscribe();
      };
    } catch (err) {
      console.error("Attendance listener setup error:", err);
      return rejectWithValue(err.message);
    }
  }
);

// New action to fetch calendar attendance data
export const fetchCalendarAttendance = createAsyncThunk(
  "attendance/fetchCalendarAttendance",
  async (dates, { rejectWithValue }) => {
    try {
      const attendanceData = {};
      
      // Process each date to fetch attendance data
      for (const dateKey of dates) {
        try {
          // Create date document reference
          const dateDocRef = doc(db, "Employee_CheckIn_CheckOut", dateKey);
          const empRecColRef = collection(dateDocRef, "employee_records");

          // Get all employee records for this date
          const empSnap = await getDocs(empRecColRef);
          
          // Process each employee record for this date
          empSnap.forEach((empDoc) => {
            const empIdFromDoc = empDoc.id;
            const data = empDoc.data();
            
            // Initialize attendance data for this employee if not exists
            if (!attendanceData[empIdFromDoc]) {
              attendanceData[empIdFromDoc] = {};
            }
            
            // Convert Firebase Timestamps to ISO strings for Redux serialization
            const processedData = {
              ...data,
              CheckIn: data.CheckIn?.toDate ? data.CheckIn.toDate().toISOString() : data.CheckIn,
              CheckOut: data.CheckOut?.toDate ? data.CheckOut.toDate().toISOString() : data.CheckOut,
            };
            
            // Store the processed data for this date
            attendanceData[empIdFromDoc][dateKey] = processedData;
          });
        } catch (dateError) {
          console.warn(`Error fetching attendance for ${dateKey}:`, dateError);
        }
      }
      
      return attendanceData;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    list: [],
    calendarData: {}, // New field for calendar-specific data
    loading: false,
    calendarLoading: false, // Separate loading state for calendar data
    error: null,
  },
  reducers: {
    setAttendance(state, action) {
      // Ensure we're creating a new array reference
      state.list = [...action.payload];
    },
    setCalendarAttendance(state, action) {
      state.calendarData = action.payload;
    },
    clearAttendance(state) {
      state.list = [];
      state.calendarData = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalendarAttendance.pending, (state) => {
        state.calendarLoading = true;
        state.error = null;
      })
      .addCase(fetchCalendarAttendance.fulfilled, (state, action) => {
        state.calendarLoading = false;
        state.calendarData = action.payload;
      })
      .addCase(fetchCalendarAttendance.rejected, (state, action) => {
        state.calendarLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setAttendance, setCalendarAttendance, clearAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;