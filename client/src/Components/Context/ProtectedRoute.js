import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { Spin, Typography } from "antd";

const { Text } = Typography;

const ProtectedRoute = ({ roles }) => {
  const { user, loading } = useAuth();

  // If authentication check is in progress, display a loading spinner
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
        <Text strong style={{ marginTop: "16px", fontSize: "24px" }}>
          Checking authentication...
        </Text>
      </div>
    );
  }

  // Check if user is authenticated and has required role
  const hasRequiredRole = roles ? roles.includes(user?.role) : true;

  return user && hasRequiredRole ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

export default ProtectedRoute;
