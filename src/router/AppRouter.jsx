// src/router/AppRouter.jsx
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { listenToAuthState } from "../redux/slices/authSlice"; // ✅ sync Redux with Firebase

// ✅ Pages
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import DashboardPage from "../pages/AttendancePage";
import CalenderPage from "../pages/CalenderPage";
import EmployeeFormPage from "../pages/EmployeeFormPage";
import EmployeeDetailsPage from "../pages/EmployeeDetailsPage";
import CalenderComPage from "../pages/CalenderComPage";
import EditEmployeePage from "../pages/EditEmployeePage";

// ✅ Route Wrappers
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const AppRouter = () => {
  const dispatch = useDispatch();

  // 🧠 Start listening to Firebase auth state on mount
  useEffect(() => {
    dispatch(listenToAuthState());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/signin" replace />} />

        {/* Public Routes (for non-authenticated users only) */}
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignInPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUpPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes (requires login) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <CalenderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendarcom"
          element={
            <ProtectedRoute>
              <CalenderComPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-employee"
          element={
            <ProtectedRoute>
              <EmployeeFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee_details"
          element={
            <ProtectedRoute>
              <EmployeeDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-employee/:id"
          element={
            <ProtectedRoute>
              <EditEmployeePage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;