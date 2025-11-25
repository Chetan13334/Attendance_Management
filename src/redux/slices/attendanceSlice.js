import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, onSnapshot, doc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";


const unsubscribeFunctions = {};

const attendanceByDate = {};


export const listenToAttendance = createAsyncThunk(
  "attendance/listenToAttendance",
  async (date, { dispatch, rejectWithValue }) => {
    try {

      const dateStr = date instanceof Date ?
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` :
        date;

      console.log("Setting up attendance listener for date:", dateStr, "from input date:", date);


      
      if (unsubscribeFunctions[dateStr]) {
        console.log("Listener already exists for date:", dateStr, "- skipping setup");
        

        
        if (attendanceByDate[dateStr]) {
          console.log("Dispatching cached data for existing listener:", dateStr);
          const combinedAttendance = Object.values(attendanceByDate).flat();
          dispatch(setAttendance(combinedAttendance));
        }

        return () => { };
      }


      if (attendanceByDate[dateStr]) {
        console.log("Removing existing attendance data for date:", dateStr);
        delete attendanceByDate[dateStr];
      }


      const dateDocRef = doc(db, "Employee_CheckIn_CheckOut", dateStr);
      const empRecColRef = collection(dateDocRef, "employee_records");

      const unsubscribe = onSnapshot(empRecColRef, (empSnapshot) => {
        console.log(`Received attendance snapshot with ${empSnapshot.docs.length} documents for date:`, dateStr);
        const allAttendance = [];


        empSnapshot.docs.forEach((empDoc) => {
          const documentId = empDoc.id;
          const empData = empDoc.data();

          console.log(`Processing attendance for employee ${documentId} on date ${dateStr}:`, empData);


          allAttendance.push({
            id: documentId,
            employeeId: documentId,
            date: dateStr,
            ...empData,
          });
        });


        attendanceByDate[dateStr] = allAttendance;


        const combinedAttendance = Object.values(attendanceByDate).flat();

        console.log("Dispatching combined attendance data:", combinedAttendance.length, "records");
        console.log("Attendance by date:", attendanceByDate);
        console.log("Today's attendance data:", allAttendance);
        dispatch(setAttendance(combinedAttendance));
      }, (error) => {
        console.error("Attendance listener error for date:", dateStr, error);

        delete attendanceByDate[dateStr];

        const combinedAttendance = Object.values(attendanceByDate).flat();
        dispatch(setAttendance(combinedAttendance));
      });


      unsubscribeFunctions[dateStr] = unsubscribe;


      return () => {
        console.log("Cleaning up attendance listener for date:", dateStr);
        if (unsubscribeFunctions[dateStr]) {
          unsubscribeFunctions[dateStr]();
          delete unsubscribeFunctions[dateStr];
        }

        delete attendanceByDate[dateStr];

        const combinedAttendance = Object.values(attendanceByDate).flat();
        dispatch(setAttendance(combinedAttendance));
      };
    } catch (err) {
      console.error("Attendance listener setup error:", err);
      return rejectWithValue(err.message);
    }
  }
);


export const fetchCalendarAttendance = createAsyncThunk(
  "attendance/fetchCalendarAttendance",
  async (dates, { rejectWithValue }) => {
    try {
      const attendanceData = {};


      for (const dateKey of dates) {
        try {

          const dateDocRef = doc(db, "Employee_CheckIn_CheckOut", dateKey);
          const empRecColRef = collection(dateDocRef, "employee_records");


          const empSnap = await getDocs(empRecColRef);


          empSnap.forEach((empDoc) => {
            const empIdFromDoc = empDoc.id;
            const data = empDoc.data();


            if (!attendanceData[empIdFromDoc]) {
              attendanceData[empIdFromDoc] = {};
            }


            const processedData = {
              ...data,
              CheckIn: data.CheckIn?.toDate ? data.CheckIn.toDate().toISOString() : data.CheckIn,
              CheckOut: data.CheckOut?.toDate ? data.CheckOut.toDate().toISOString() : data.CheckOut,
            };


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
    calendarData: {},
    loading: false,
    calendarLoading: false,
    error: null,
  },
  reducers: {
    setAttendance(state, action) {
      console.log("Setting attendance in Redux:", action.payload.length, "records");
      console.log("Attendance data:", action.payload);

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
        state.list = [];
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