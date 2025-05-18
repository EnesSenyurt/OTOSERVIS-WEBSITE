import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="p-6 text-center">Yükleniyor...</div>; 
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
