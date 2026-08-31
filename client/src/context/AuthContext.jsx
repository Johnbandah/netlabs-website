import React, { createContext, useState, useContext, useEffect } from 'react';

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

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('netlabs_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('netlabs_user');
      }
    }
    setLoading(false);
  }, []);

  // Register function
  const register = async (name, email, password) => {
    try {
      if (!name || !email || !password) {
        return { success: false, message: 'Please fill in all fields' };
      }

      if (password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters' };
      }

      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('netlabs_users') || '[]');
      if (existingUsers.find(u => u.email === email)) {
        return { success: false, message: 'User with this email already exists' };
      }

      const newUser = {
        id: 'user_' + Date.now(),
        name: name,
        email: email,
        role: 'user',
        createdAt: new Date().toISOString()
      };

      // Save to users list
      existingUsers.push(newUser);
      localStorage.setItem('netlabs_users', JSON.stringify(existingUsers));

      // Set as current user
      localStorage.setItem('netlabs_user', JSON.stringify(newUser));
      setUser(newUser);
      
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      if (!email || !password) {
        return { success: false, message: 'Please enter email and password' };
      }

      // Check admin login
      if (email === 'admin@netlabs.com' && password === 'admin123') {
        const adminUser = {
          id: 'admin_001',
          name: 'Administrator',
          email: email,
          role: 'admin',
          createdAt: new Date().toISOString()
        };
        localStorage.setItem('netlabs_user', JSON.stringify(adminUser));
        setUser(adminUser);
        return { success: true, user: adminUser, redirect: '/admin' };
      }

      // Check if user exists in registered users
      const existingUsers = JSON.parse(localStorage.getItem('netlabs_users') || '[]');
      const foundUser = existingUsers.find(u => u.email === email);
      
      if (foundUser) {
        // For demo, any password works for existing users
        localStorage.setItem('netlabs_user', JSON.stringify(foundUser));
        setUser(foundUser);
        return { success: true, user: foundUser, redirect: '/dashboard' };
      }

      // If user doesn't exist, create a new one (for demo)
      if (email && password) {
        const newUser = {
          id: 'user_' + Date.now(),
          name: email.split('@')[0] || 'User',
          email: email,
          role: 'user',
          createdAt: new Date().toISOString()
        };
        // Save to users list
        const allUsers = JSON.parse(localStorage.getItem('netlabs_users') || '[]');
        allUsers.push(newUser);
        localStorage.setItem('netlabs_users', JSON.stringify(allUsers));
        
        localStorage.setItem('netlabs_user', JSON.stringify(newUser));
        setUser(newUser);
        return { success: true, user: newUser, redirect: '/dashboard' };
      }

      return { success: false, message: 'Invalid credentials' };
    } catch (error) {
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};