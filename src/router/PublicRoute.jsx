import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);

  // If already logged in, redirect to dashboard immediately
  // Even if loading is true (e.g. background check), we can proceed if we have state
  if (user || isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show loading while checking authentication (only if not already authenticated)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Otherwise, allow access to public pages
  return children;
};

export default PublicRoute;
