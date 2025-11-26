// src/context/AuthContext.jsx (STITCHED/FINAL VERSION)
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 💡 NEW HELPER: Central function to store token and redirect.
  const handleAuthSuccess = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
    navigate('/dashboard');
  };

  // 🔄 FIX (State Persistence logic)
  const fetchProfile = async () => {
    try {
      // 💡 Calls the new protected endpoint, api.js automatically adds the token
      const response = await api.get('/auth/profile');
      setUser(response.data.user); 
    } catch (error) {
      // If token fails validation/expiry check, log out (prevents forced logout on good token)
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Runs on initial load to check for existing session (FIXES LOGOUT ON REFRESH)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  // Original Login function (used by LoginPage)
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    handleAuthSuccess(token, user); 
  };

  // 🚀 Auto Sign In (Used by RegisterPage)
  const autoSignInAfterRegistration = (token, user) => {
    handleAuthSuccess(token, user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const value = { 
    user, 
    loading, 
    login, 
    logout, 
    autoSignInAfterRegistration,
    isAuthenticated: !!user 
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div className="min-h-screen flex items-center justify-center text-xl text-indigo-600">Checking Session...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);