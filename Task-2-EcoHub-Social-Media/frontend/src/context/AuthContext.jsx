import React, { createContext, useState, useEffect, useContext } from "react";
import { login as loginApi, register as registerApi, getProfile } from "../api/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("ecohub_token"));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sync profile if token exists
  const syncProfile = async () => {
    try {
      setIsLoading(true);
      const res = await getProfile();
      if (res.success && res.data) {
        setUser(res.data);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } catch (err) {
      console.error("Failed to load user profile:", err);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      syncProfile();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  // Listen for auth-expired events dispatched from Axios interceptor
  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    };

    window.addEventListener("auth-expired", handleAuthExpired);
    return () => {
      window.removeEventListener("auth-expired", handleAuthExpired);
    };
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await loginApi({ email, password });
      if (res.success && res.token) {
        localStorage.setItem("ecohub_token", res.token);
        setToken(res.token);
        setUser(res.data);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: res.message || "Login failed" };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Invalid credentials",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const res = await registerApi(userData);
      // Properly check the server's success flag
      if (res.success) {
        return { success: true, message: res.message };
      } else {
        return { success: false, message: res.message || "Registration failed" };
      }
    } catch (err) {
      return {
        success: false,
        message:
          err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("ecohub_token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUserInfoInContext = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateUser: updateUserInfoInContext,
        reloadProfile: syncProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
