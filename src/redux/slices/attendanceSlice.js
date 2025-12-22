import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
let socket;

// Helper function to normalize attendance data
// Backend format: checkInTime (ISO), checkOutTime (ISO), _id
// Frontend expected format: CheckIn (ISO string), CheckOut (ISO string), id
const normalizeAttendance = (record) => {
  return {
    ...record,
    id: record._id || record.id || record.employeeId, // Mappings
    CheckIn: record.checkInTime || record.CheckIn, // Map checkInTime to CheckIn
    CheckOut: record.checkOutTime || record.CheckOut, // Map checkOutTime to CheckOut
    date: record.date || (record.checkInTime ? record.checkInTime.split('T')[0] : null) // Ensure date field exists
  };
};

export const listenToAttendance = createAsyncThunk(
  "attendance/listenToAttendance",
  async (dateInput, { dispatch, rejectWithValue }) => {
    try {
      // Ensure dateInput is a valid string YYYY-MM-DD
      let dateStr = dateInput;
      if (dateInput instanceof Date) {
        dateStr = dateInput.toISOString().split("T")[0];
      }

      // 1. Initial Fetch via REST API
      const response = await fetch(`${API_BASE_URL}/attendance?date=${dateStr}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error("Failed to fetch initial attendance data");
      }
      const data = await response.json();

      const normalizedData = data.map(normalizeAttendance);

      // We assume this returns the data which will be used by the fulfilled reducer
      // We pass the date as well so the reducer knows which date bucket to update
      return { date: dateStr, records: normalizedData };

    } catch (error) {
      console.error("Error fetching attendance:", error);
      return rejectWithValue(error.message);
    }
  }
);


export const fetchCalendarAttendance = createAsyncThunk(
  "attendance/fetchCalendarAttendance",
  async (_, { rejectWithValue }) => {
    try {
      // Fetching attendance for calendar. Current backend supports limit.
      const response = await fetch(`${API_BASE_URL}/attendance?limit=500`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error("Failed to fetch calendar data");
      }
      const data = await response.json();
      // Group by date for the calendar
      const calendarData = {};
      data.forEach(record => {
        const norm = normalizeAttendance(record);
        if (!calendarData[norm.date]) {
          calendarData[norm.date] = [];
        }
        calendarData[norm.date].push(norm);
      });

      return calendarData;

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Subscribe to real-time updates for a date
export const subscribeToAttendanceUpdates = (dateStr) => (dispatch) => {
  // Setup Socket.io listener
  if (!socket) {
    socket = io(API_BASE_URL.replace('/api', ''), {
      withCredentials: true
    });
  }

  // Join room for this date
  socket.emit("subscribeToAttendance", dateStr);

  socket.off("attendanceUpdated");
  socket.on("attendanceUpdated", (updatedRecord) => {
    // Only update if it matches the current date being viewed or logic? 
    // Actually best to just update store and let selectors filter.
    dispatch(updateAttendanceRecord(normalizeAttendance(updatedRecord)));
  });

  return () => {
    if (socket) {
      socket.off("attendanceUpdated");
    }
  };
};


const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    list: [], // List of ALL loaded attendance records (flat)
    calendarData: {}, // Map of date -> attendance list
    loading: false,
    error: null,
  },
  reducers: {
    setAttendance(state, action) {
      // Payload expected: { date, records }
      const { date, records } = action.payload;
      if (date) {
        // Remove old records for this date
        state.list = state.list.filter(r => r.date !== date);
        // Add new records
        state.list.push(...records);
      } else if (Array.isArray(action.payload)) {
        // Fallback
        state.list = action.payload;
      }
      state.loading = false;
    },
    updateAttendanceRecord(state, action) {
      const updatedRecord = action.payload;
      // Update in data list
      const index = state.list.findIndex(item => item.id === updatedRecord.id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...updatedRecord };
      } else {
        state.list.push(updatedRecord);
      }
    },
    clearAttendance(state) {
      state.list = [];
      if (socket) {
        socket.off("attendanceUpdated");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listenToAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(listenToAttendance.fulfilled, (state, action) => {
        state.loading = false;
        const { date, records } = action.payload;
        if (date) {
          state.list = state.list.filter(r => r.date !== date);
          state.list.push(...records);
        } else if (Array.isArray(action.payload)) {
          state.list = action.payload;
        }
      })
      .addCase(listenToAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCalendarAttendance.fulfilled, (state, action) => {
        state.calendarData = action.payload;
      });
  },
});

export const { setAttendance, updateAttendanceRecord, clearAttendance } = attendanceSlice.actions;

export default attendanceSlice.reducer;