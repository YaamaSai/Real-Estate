import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('bridl360_token');
    if (token) {
      try {
        const savedUser = localStorage.getItem('bridl360_user');
        if (savedUser && savedUser !== 'undefined') {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Error parsing saved user", error);
        localStorage.removeItem('bridl360_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      const { token, ...userData } = res.data;
      console.log("Login Success, User Data:", userData);
      localStorage.setItem('bridl360_token', token);
      localStorage.setItem('bridl360_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('bridl360_token');
    localStorage.removeItem('bridl360_user');
    setUser(null);
  };

  const updateProfileData = async (updatedData) => {
    try {
      const res = await API.put('/auth/update', updatedData);
      const { token, ...userData } = res.data;
      if (token) {
        localStorage.setItem('bridl360_token', token);
      }
      localStorage.setItem('bridl360_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update profile' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfileData, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
