import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);

  // ❌ Not logged in → redirect to Sign In
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // ✅ Logged in → render the protected page
  return children;
};

export default ProtectedRoute;
