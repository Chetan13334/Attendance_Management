import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, onSnapshot, doc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

// Store multiple unsubscribe functions
const unsubscribeFunctions = {};
// Store attendance data by date
const attendanceByDate = {};

// Listen to attendance for a specific date
export const listenToAttendance = createAsyncThunk(
  "attendance/listenToAttendance",
  async (date, { dispatch, rejectWithValue }) => {
    try {
      // Format date as YYYY-MM-DD
      const dateStr = date instanceof Date ? 
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` :
        date;
      
      console.log("Setting up attendance listener for date:", dateStr, "from input date:", date);
      
      // If we already have a listener for this date, clean it up first
      if (unsubscribeFunctions[dateStr]) {
        console.log("Cleaning up existing listener for date:", dateStr);
        unsubscribeFunctions[dateStr]();
        delete unsubscribeFunctions[dateStr];
      }
      
      // Also clean up data for this date if it exists
      if (attendanceByDate[dateStr]) {
        console.log("Removing existing attendance data for date:", dateStr);
        delete attendanceByDate[dateStr];
      }
      
      // Listen to attendance data from the correct Firestore structure
      // Employee_CheckIn_CheckOut/{date}/employee_records/{documentId}
      const dateDocRef = doc(db, "Employee_CheckIn_CheckOut", dateStr);
      const empRecColRef = collection(dateDocRef, "employee_records");
      
      const unsubscribe = onSnapshot(empRecColRef, (empSnapshot) => {
        console.log(`Received attendance snapshot with ${empSnapshot.docs.length} documents for date:`, dateStr);
        const allAttendance = [];
        
        // For each employee document in employee_records
        empSnapshot.docs.forEach((empDoc) => {
          const documentId = empDoc.id; // This is the Firestore document ID
          const empData = empDoc.data();
          
          console.log(`Processing attendance for employee ${documentId} on date ${dateStr}:`, empData);
          
          // Add the employee record with document ID as employeeId
          allAttendance.push({
            id: documentId,
            employeeId: documentId, // Using document ID to match with employees
            date: dateStr,
            ...empData,
          });
        });
        
        // Store attendance data for this specific date
        attendanceByDate[dateStr] = allAttendance;
        
        // Combine all attendance data from all dates
        const combinedAttendance = Object.values(attendanceByDate).flat();
        
        console.log("Dispatching combined attendance data:", combinedAttendance.length, "records");
        console.log("Attendance by date:", attendanceByDate);
        console.log("Today's attendance data:", allAttendance);
        dispatch(setAttendance(combinedAttendance));
      }, (error) => {
        console.error("Attendance listener error for date:", dateStr, error);
        // Don't clear the entire attendance list, just remove data for this date
        delete attendanceByDate[dateStr];
        // Combine remaining attendance data
        const combinedAttendance = Object.values(attendanceByDate).flat();
        dispatch(setAttendance(combinedAttendance));
      });
      
      // Store the unsubscribe function
      unsubscribeFunctions[dateStr] = unsubscribe;
      
      // Return a cleanup function
      return () => {
        console.log("Cleaning up attendance listener for date:", dateStr);
        if (unsubscribeFunctions[dateStr]) {
          unsubscribeFunctions[dateStr]();
          delete unsubscribeFunctions[dateStr];
        }
        // Also remove data for this date
        delete attendanceByDate[dateStr];
        // Update the combined attendance
        const combinedAttendance = Object.values(attendanceByDate).flat();
        dispatch(setAttendance(combinedAttendance));
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
      console.log("Setting attendance in Redux:", action.payload.length, "records");
      console.log("Attendance data:", action.payload);
      // Ensure we're creating a new array reference
      state.list = [...action.payload];
    },
    setCalendarAttendance(state, action) {
      state.calendarData = action.payload;
    },
    clearAttendance(state) {
      console.log("Clearing attendance data from Redux store");
      state.list = [];
      state.calendarData = {};
      state.error = null;
      // Clean up all unsubscribe functions
      Object.values(unsubscribeFunctions).forEach(unsubscribe => {
        if (typeof unsubscribe === 'function') {
          console.log("Cleaning up unsubscribe function");
          unsubscribe();
        }
      });
      Object.keys(unsubscribeFunctions).forEach(key => {
        console.log("Deleting unsubscribe function for date:", key);
        delete unsubscribeFunctions[key];
      });
      // Clear attendance data by date
      Object.keys(attendanceByDate).forEach(key => {
        console.log("Deleting attendance data for date:", key);
        delete attendanceByDate[key];
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listenToAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listenToAttendance.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(listenToAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.list = []; // Clear list on error
      })
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