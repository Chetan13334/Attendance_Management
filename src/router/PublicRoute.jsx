import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);

  // 🚫 If already logged in, prevent showing signin/signup
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Otherwise, allow access
  return children;
};

export default PublicRoute;
