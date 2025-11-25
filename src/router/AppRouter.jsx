// src/router/AppRouter.jsx
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { listenToAuthState } from "../redux/slices/authSlice"; 


import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import DashboardPage from "../pages/AttendancePage";
import CalenderPage from "../pages/CalenderPage";
import EmployeeFormPage from "../pages/EmployeeFormPage";
import EmployeeDetailsPage from "../pages/EmployeeDetailsPage";
import CalenderComPage from "../pages/CalenderComPage";
import EditEmployeePage from "../pages/EditEmployeePage";
import EmployeeCalendarComPage from "../pages/EmployeeCalendarComPage";


import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import { PopupProvider } from "../components/common/popups/PopupProvider";

const AppRouter = () => {
  const dispatch = useDispatch();

 
  useEffect(() => {
    dispatch(listenToAuthState());
  }, [dispatch]);

  return (
    <Router>
      <PopupProvider>
        <Routes>
          
          <Route path="/" element={<Navigate to="/signin" replace />} />

        
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
         
          <Route
            path="/employee-calendarcom"
            element={
              <ProtectedRoute>
                <EmployeeCalendarComPage />
              </ProtectedRoute>
            }
          />


          
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </PopupProvider>
    </Router>
  );
};

export default AppRouter;