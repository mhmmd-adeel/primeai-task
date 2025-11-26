// src/context/AuthContext.jsx
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

  // 🔄 FIX (State Persistence): Function to fetch user profile on refresh
  const fetchProfile = async () => {
    try {
      // Uses the token in localStorage to fetch user data (Protected Route)
      const response = await api.get('/auth/profile');
      // Note: Your backend profile endpoint must return the user object within data: { user: { ... } }
      setUser(response.data.user); 
    } catch (error) {
      // If fetching fails (token expired or invalid), we clear the session
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Runs only once on initial load (State Persistence)
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
    // 💡 Wires up to your POST /api/auth/login endpoint
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    handleAuthSuccess(token, user); // Use central handler
  };

  // 🚀 NEW FUNCTION: Used by RegisterPage to bypass the manual login step
  const autoSignInAfterRegistration = (token, user) => {
    handleAuthSuccess(token, user); // Use central handler
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  // Expose the new autoSignInAfterRegistration function
  const value = { 
    user, 
    loading, 
    login, 
    logout, 
    autoSignInAfterRegistration, // 👈 Exported for RegisterPage to use
    isAuthenticated: !!user 
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Show loading state while validating token on refresh */}
      {loading ? <div className="min-h-screen flex items-center justify-center text-xl text-indigo-600">Checking Session...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);