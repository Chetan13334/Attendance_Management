import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import attendanceReducer from "./slices/attendanceSlice";
import employeeReducer from "./slices/employeeSlice";
// 🆕 Import the eventReducer (assuming its file path)
import eventReducer from "./slices/eventSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    attendance: attendanceReducer,
    employees: employeeReducer,
    // ✅ ADDED: The events reducer is now available in the store state
    events: eventReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // This is often needed when dealing with Firebase Timestamps
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});