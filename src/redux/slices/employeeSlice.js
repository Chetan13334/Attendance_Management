import { createSlice } from "@reduxjs/toolkit";

const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    list: [],   // List of employees fetched from Firebase
  },
  reducers: {
    setEmployees(state, action) {
      state.list = action.payload;
    },
    addEmployee(state, action) {
      state.list.push(action.payload);
    },
    updateEmployee(state, action) {
      const { id, data } = action.payload;
      const index = state.list.findIndex(emp => emp.id === id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...data };
      }
    },
    deleteEmployee(state, action) {
      state.list = state.list.filter(emp => emp.id !== action.payload);
    }
  }
});

export const { setEmployees, addEmployee, updateEmployee, deleteEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;
