import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists on mount
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // You could verify token here if needed
    }
    setLoading(false);
  }, []);

  const signin = async (email, password) => {
    try {
      const data = await authAPI.signin(email, password);
      if (data.error) {
        throw new Error(data.error);
      }
      const newToken = data.access_token;
      setToken(newToken);
      setUser({ id: data.user_id });
      localStorage.setItem('token', newToken);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Sign in failed' };
    }
  };

  const signup = async (username, email, password) => {
    try {
      const data = await authAPI.signup(username, email, password);
      if (data.error) {
        throw new Error(data.error);
      }
      const newToken = data.access_token;
      setToken(newToken);
      setUser({ id: data.user_id });
      localStorage.setItem('token', newToken);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Sign up failed' };
    }
  };

  const signout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    signin,
    signup,
    signout,
    isAuthenticated: !!token,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
        <div className="flex items-center gap-3 text-sm">
          <span className="h-3 w-3 rounded-full bg-indigo-500 animate-pulse" />
          <span>Loading your workspace...</span>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

