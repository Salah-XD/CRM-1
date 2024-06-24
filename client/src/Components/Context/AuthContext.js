import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initialize loading state

  const login = (token, userId, role) => {
    localStorage.setItem("authToken", token);
    // Optionally, you can store userId and role in localStorage or state if needed
    setUser({ userId, role });
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    checkAuth();
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const checkAuth = async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const response = await axios.get("/auth/protected");
        setUser({ userId: response.data.userId, role: response.data.role });
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false); // Set loading to false once authentication check is complete
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    loading, // Make loading state available in context
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
