import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { Spin, Typography } from "antd";

const { Text } = Typography;

const userRoles = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ACCOUNT_ADMIN: "ACCOUNT_ADMIN",
  AUDIT_ADMIN: "AUDIT_ADMIN",
};

const ProtectedRoute = ({ roles }) => {
  const { user, loading } = useAuth();

  // console.log("User:", user);
  // console.log("Roles required:", roles);

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

  const hasRequiredRole =
    user?.role === userRoles.SUPER_ADMIN || roles.includes(user?.role);

  console.log("Has required role:", hasRequiredRole);

  return user && hasRequiredRole ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
};

export const SuperAdminRoute = () => <ProtectedRoute roles={[]} />;
export const AccountAdminRoute = () => (
  <ProtectedRoute roles={[userRoles.ACCOUNT_ADMIN]} />
);
export const AuditAdminRoute = () => (
  <ProtectedRoute roles={[userRoles.AUDIT_ADMIN]} />
);
