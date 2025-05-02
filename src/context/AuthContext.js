
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getProfile, login, register, logout } from '../api/ecowattAPI';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('ecowattToken');
    if (token) {
      getProfile()
        .then(data => {
          setUser(data);
        })
        .catch(err => {
          console.error('Error fetching profile:', err);
          // If token is invalid, remove it
          localStorage.removeItem('ecowattToken');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const loginUser = async (email, password) => {
    setError(null);
    try {
      const data = await login(email, password);
      localStorage.setItem('ecowattToken', data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to login');
      throw err;
    }
  };

  const registerUser = async (username, email, password) => {
    setError(null);
    try {
      const data = await register(username, email, password);
      localStorage.setItem('ecowattToken', data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to register');
      throw err;
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('ecowattToken');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        isLoading,
        error,
        login: loginUser,
        register: registerUser,
        logout: logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
