import React, { createContext, useState, useContext, useEffect } from 'react';
import API_URL from '../api/config';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount (verify token with backend)
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('netlabs_token');
      const savedUser = localStorage.getItem('netlabs_user');

      if (token && savedUser) {
        try {
          const res = await fetch(`${API_URL}/api/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();

          if (data.success) {
            setUser(data.user);
            localStorage.setItem('netlabs_user', JSON.stringify(data.user));
          } else {
            localStorage.removeItem('netlabs_token');
            localStorage.removeItem('netlabs_user');
          }
        } catch (err) {
          // Fall back to saved user if backend unreachable
          try { setUser(JSON.parse(savedUser)); } catch (e) {}
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Register
  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();

      if (!data.success) return { success: false, message: data.message };

      localStorage.setItem('netlabs_token', data.token);
      localStorage.setItem('netlabs_user', JSON.stringify(data.user));
      setUser(data.user);

      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!data.success) return { success: false, message: data.message };

      localStorage.setItem('netlabs_token', data.token);
      localStorage.setItem('netlabs_user', JSON.stringify(data.user));
      setUser(data.user);

      return {
        success: true,
        user: data.user,
        redirect: data.redirect || (data.user.role === 'admin' ? '/admin' : '/dashboard')
      };
    } catch (error) {
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('netlabs_token');
    localStorage.removeItem('netlabs_user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};