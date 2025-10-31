import { createSlice } from "@reduxjs/toolkit";

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    records: [],   // list of attendance entries
  },
  reducers: {
    setAttendance(state, action) {
      state.records = action.payload;
    },
    updateRecord(state, action) {
      const { id, data } = action.payload;
      const index = state.records.findIndex(r => r.id === id);
      if (index !== -1) state.records[index] = { ...state.records[index], ...data };
    },
  },
});

export const { setAttendance, updateRecord } = attendanceSlice.actions;
export default attendanceSlice.reducer;