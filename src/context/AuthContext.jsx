import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email, password) => {
    // Demo credentials
    const demoUsers = {
      'admin@studio.com': { id: '1', name: 'Admin User', email: 'admin@studio.com', role: 'admin' },
      'instructor@studio.com': { id: '2', name: 'Instructor User', email: 'instructor@studio.com', role: 'instructor' },
      'student@studio.com': { id: '3', name: 'Student User', email: 'student@studio.com', role: 'student' }
    };

    if (password === 'password' && demoUsers[email]) {
      const userData = demoUsers[email];
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
