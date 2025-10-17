import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';
import DashboardPage from '../pages/DashboardPage';
import CalenderPage from '../pages/CalenderPage';
import EmployeeFormPage from '../pages/EmployeeFormPage';
import EmployeeDetailsPage from '../pages/EmployeeDetailsPage';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/calendar" element={<CalenderPage />} />
        <Route path="/add-employee" element={<EmployeeFormPage />} />
        <Route path="/employee_details" element={<EmployeeDetailsPage/>} />
        
      </Routes>
    </Router>
  );
};

export default AppRouter;
