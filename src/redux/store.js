import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import attendanceReducer from "./slices/attendanceSlice";
import employeeReducer from "./slices/employeeSlice";

import eventReducer from "./slices/eventSlice";
import leaveReducer from "./slices/leaveSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    attendance: attendanceReducer,
    employees: employeeReducer,
    leaves: leaveReducer,
    events: eventReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({

      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});