import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use the Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (username, password) => {
    // Replace with your authentication logic
    const response = await axios.post("/api/login", { username, password });
    setUser(response.data.user);
  };

  const logout = () => {
    // Replace with your logout logic
    setUser(null);
  };

  const checkAuth = async () => {
    // Replace with your authentication status check logic
    const response = await axios.get("/api/check-auth");
    setUser(response.data.user);
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
