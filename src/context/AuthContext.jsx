import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStorageData, setStorageData, removeStorageData, STORAGE_KEYS } from '../utils/storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStorageData(STORAGE_KEYS.CURRENT_USER);
    if (storedUser) {
      setCurrentUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const users = getStorageData(STORAGE_KEYS.USERS) || [];
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
      
      setCurrentUser(userWithoutPassword);
      setStorageData(STORAGE_KEYS.CURRENT_USER, userWithoutPassword);
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    removeStorageData(STORAGE_KEYS.CURRENT_USER);
  };

  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  const isPatient = () => {
    return currentUser?.role === 'patient';
  };

  const value = {
    currentUser,
    login,
    logout,
    isAdmin,
    isPatient,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};