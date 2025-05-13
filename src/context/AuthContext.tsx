
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { getProfile, login, register, logout } from '../api/ecowattAPI';

// Define types for our context
type User = {
  id?: number;
  username?: string;
  email?: string;
  points?: number;
  [key: string]: any;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<any>;
  register: (username: string, email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  error: null,
  login: async () => ({}),
  register: async () => ({}),
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const loginUser = async (email: string, password: string) => {
    setError(null);
    try {
      const data = await login(email, password);
      localStorage.setItem('ecowattToken', data.token);
      setUser(data.user);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      throw err;
    }
  };

  const registerUser = async (username: string, email: string, password: string) => {
    setError(null);
    try {
      const data = await register(username, email, password);
      localStorage.setItem('ecowattToken', data.token);
      setUser(data.user);
      return data;
    } catch (err: any) {
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
