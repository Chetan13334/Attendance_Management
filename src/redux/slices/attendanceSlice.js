import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

// Listen to attendance for a specific date
export const listenToAttendance = createAsyncThunk(
  "attendance/listenToAttendance",
  async (date, { dispatch, rejectWithValue }) => {
    try {
      // Format date as YYYY-MM-DD
      const dateStr = date instanceof Date ? 
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` :
        date;
      
      // Listen to attendance data from the correct Firestore structure
      // Employee_CheckIn_CheckOut/{date}/employee_records/{documentId}
      const dateDocRef = doc(db, "Employee_CheckIn_CheckOut", dateStr);
      const empRecColRef = collection(dateDocRef, "employee_records");
      
      const unsubscribe = onSnapshot(empRecColRef, (empSnapshot) => {
        const allAttendance = [];
        
        // For each employee document in employee_records
        empSnapshot.docs.forEach((empDoc) => {
          const documentId = empDoc.id; // This is the Firestore document ID
          const empData = empDoc.data();
          
          // Add the employee record with document ID as employeeId
          allAttendance.push({
            id: documentId,
            employeeId: documentId, // Using document ID to match with employees
            date: dateStr,
            ...empData,
          });
        });
        
        dispatch(setAttendance(allAttendance));
      }, (error) => {
        console.error("Attendance listener error:", error);
        dispatch(setAttendance([])); // Clear attendance on error
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

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    setAttendance(state, action) {
      // Ensure we're creating a new array reference
      state.list = [...action.payload];
    },
    clearAttendance(state) {
      state.list = [];
      state.error = null;
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
      });
  },
});

export const { setAttendance, clearAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;