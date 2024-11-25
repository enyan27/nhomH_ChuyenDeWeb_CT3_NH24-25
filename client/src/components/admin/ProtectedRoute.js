import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ requiredRole, children }) => {
  const role = localStorage.getItem("role");
  console.log("Role từ localStorage:", role);
  if (!role) {
    return <Navigate to="/login" replace />;
  }
  if (role !== requiredRole) {
    return <Navigate to="/home" replace />;
  }
  return children;
};

export default ProtectedRoute;
