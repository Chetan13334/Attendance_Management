import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listenToEmployees } from "../../../redux/slices/employeeSlice";
import { useLeaveRequests } from "./useLeaveRequests";
import LeaveRequestUI from "./LeaveRequest.ui";

/**
 * Container component for Leave Request List page
 * 
 * Real-time behavior:
 * - useLeaveRequests() sets up Firestore listener for ALL leave requests
 * - When ANY leave is added/modified/deleted (from web OR mobile):
 *   1. Firestore triggers onSnapshot callback
 *   2. Redux state updates via setLeaveRequests action
 *   3. This component re-renders with new data
 *   4. UI updates automatically - NO manual refresh needed!
 */
const LeaveRequestContainer = () => {
  const dispatch = useDispatch();

  const employees = useSelector((state) => state.employees.list);
  const employeesLoading = useSelector((state) => state.employees.loading);

  // 🔥 Get leave requests with real-time updates
  // The listener is set up inside useLeaveRequests hook
  const { requests, loading } = useLeaveRequests();

  // Set up employee listener (separate from leave requests)
  useEffect(() => {
    const promise = dispatch(listenToEmployees());

    return () => {
      promise.then((unsubscribe) => {
        if (typeof unsubscribe === "function") unsubscribe();
      });
    };
  }, [dispatch]);

  return (
    <LeaveRequestUI
      requests={requests}
      loading={loading || employeesLoading}
    />
  );
};

export default LeaveRequestContainer;
