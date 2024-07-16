import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const login = async (token, userId, role) => {
    try {
      localStorage.setItem("authToken", token);
      setUser({ userId, role });
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await checkAuth();
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message);
    }
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
        const response = await axios.get("/api/auth/protected");
        console.log("this is response",response);
        setUser({
          userId: response.data.user.userId,
          role: response.data.user.role,
          userName: response.data.user.userName,
        });
        setError(null);
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
        setError("Authentication check failed. Please log in again.");
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
