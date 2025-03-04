import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem("authToken"); // Verifica si hay un token guardado

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
