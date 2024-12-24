import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { Spin, Typography } from "antd";
import { jwtDecode } from "jwt-decode";

const { Text } = Typography;

const userRoles = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ACCOUNT_ADMIN: "ACCOUNT_ADMIN",
  AUDIT_ADMIN: "AUDIT_ADMIN",
  AUDITOR: "AUDITOR",
};

// Function to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
};

const ProtectedRoute = ({ roles }) => {
  const { user, loading, token } = useAuth();  // Make sure to fetch the token from context or storage

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      // Handle token expiry (e.g., log out the user or redirect)
      window.location.href = "/";  // Redirect to home page or login
    }
  }, [token]);

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
    user?.role === userRoles.SUPER_ADMIN || user?.role === userRoles.AUDITOR || roles.includes(user?.role);

  return user && hasRequiredRole ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
};

// Dynamic role-based route component generator
export const createRoleRoute = (roles) => () => <ProtectedRoute roles={roles} />;

// Define your routes
export const SuperAdminRoute = createRoleRoute([]); // SUPER_ADMIN has access to all routes
export const AccountAdminRoute = createRoleRoute([userRoles.ACCOUNT_ADMIN]);
export const AuditAdminRoute = createRoleRoute([userRoles.AUDIT_ADMIN]);
export const AuditorRoute = createRoleRoute([userRoles.AUDITOR]);
