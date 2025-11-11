import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

export const listenToAttendance = createAsyncThunk(
  "attendance/listenToAttendance",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      onSnapshot(collection(db, "attendance"), (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch(setAttendance(data));
      });
    } catch (err) {
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
      state.list = action.payload;
    },
    clearAttendance(state) {
      state.list = [];
      state.error = null;
    },
  },
});

export const { setAttendance, clearAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;
