import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as authApi from '../services/auth.api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = useCallback(async () => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await authApi.getMe();
      if (data && data.success) {
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('isLoggedIn');
      }
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('isLoggedIn');
      if (err.message !== 'Unauthorized') {
        console.warn('Authentication check failed:', err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login handler
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authApi.loginUser({ email, password });
      if (data && data.success) {
        localStorage.setItem('isLoggedIn', 'true');
        setUser(data.user);
        setIsAuthenticated(true);
        return data;
      } else {
        throw new Error(data?.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler
  const register = async (username, email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authApi.registerUser({ username, email, password });
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    setUser(null);
    setIsAuthenticated(false);
    // Attempt client-side token cookie clearance
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  };

  // Verify email handler
  const verifyEmail = async (token) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authApi.verifyEmailToken(token);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Resend verification email handler
  const resendVerification = async (email) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authApi.resendVerificationToken(email);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        checkAuth,
        verifyEmail,
        resendVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
