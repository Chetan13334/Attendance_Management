import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import attendanceReducer from "./slices/attendanceSlice";
import employeeReducer from "./slices/employeeSlice";

import eventReducer from "./slices/eventSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    attendance: attendanceReducer,
    employees: employeeReducer,
    
    events: eventReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});