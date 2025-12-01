import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // For guest users, we don't need token validation
        if (parsedUser.isGuest) {
          setUser(parsedUser);
        } else if (token && parsedUser && parsedUser.emailOrMobile) {
          // For registered users, validate token and user data
          setUser(parsedUser);
        } else {
          // Clear invalid user data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        // Clear corrupted user data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const loginUser = (userData, token = null) => {
    // Only store token for registered users, not guests
    if (token && !userData.isGuest) {
      localStorage.setItem('token', token);
    } else if (userData.isGuest) {
      // Clear any existing token for guest users
      localStorage.removeItem('token');
    }
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
