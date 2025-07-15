import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFullImageUrl } from '../utils/getFullImageUrl';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access'));
  const [user, setUser] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('user'));
      if (stored) {
        return {
          ...stored,
          profile_picture: getFullImageUrl(stored.profile_picture),
        };
      }
      return null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('access'));
    try {
      const stored = JSON.parse(localStorage.getItem('user'));
      if (stored) {
        setUser({
          ...stored,
          profile_picture: getFullImageUrl(stored.profile_picture),
        });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
    const handleStorage = () => {
      setIsLoggedIn(!!localStorage.getItem('access'));
      try {
        const stored = JSON.parse(localStorage.getItem('user'));
        if (stored) {
          setUser({
            ...stored,
            profile_picture: getFullImageUrl(stored.profile_picture),
          });
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = (userData) => {
    const processedUser = {
      ...userData,
      profile_picture: getFullImageUrl(userData.profile_picture),
    };
    setIsLoggedIn(true);
    setUser(processedUser);
    localStorage.setItem('user', JSON.stringify(processedUser)); // persist user
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('user'); // clear user
    localStorage.removeItem('access'); // optional: clear tokens
    localStorage.removeItem('refresh'); // optional: clear tokens
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 