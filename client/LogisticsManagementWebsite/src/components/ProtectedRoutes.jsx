import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  
  const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

  if (!token) {

    return <Navigate to="/auth/register" replace />;
  }

  
  return <Outlet />;
};

export default ProtectedRoute;
