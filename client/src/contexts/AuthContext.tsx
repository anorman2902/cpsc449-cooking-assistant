/**
 * Authentication Context
 * 
 * Provides authentication state management across the application.
 * Handles user login, signup, logout, and token storage.
 */
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { authApi, ApiError } from '../services/api';

// Define User type
interface User {
  id: string;
  username: string;
  email: string;
  // additional properties
}

// Define authentication context value type
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  authError: string | null;
  clearAuthError: () => void;
  loading: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider component
 * 
 * Manages authentication state and provides auth functions to all child components.
 * Uses localStorage to persist user session across page reloads.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Check for existing token on initial load
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('auth_token');
      
      if (!storedToken) {
        setLoading(false);
        return;
      }
      
      try {
        // Verify token with backend
        const data = await authApi.verifyToken(storedToken);
        
        // Set authentication state
        setToken(storedToken);
        setUser(data.user);
        setIsAuthenticated(true);
      } catch (error) {
        // Token is invalid or expired
        console.error('Token verification failed:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      } finally {
        setLoading(false);
      }
    };
    
    verifyToken();
  }, []);
  
  // Clear authentication error
  const clearAuthError = () => {
    setAuthError(null);
  };
  
  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      // Call API login endpoint
      const data = await authApi.login(email, password);
      
      // Store in localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      
      // Update state
      setUser(data.user);
      setToken(data.token);
      setIsAuthenticated(true);
      setAuthError(null);
      
      return true;
    } catch (error) {
      // Handle API errors
      if (error instanceof ApiError) {
        setAuthError(error.message);
      } else {
        setAuthError('An unexpected error occurred during login');
      }
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Signup function
  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      // Call API signup endpoint
      const data = await authApi.signup(username, email, password);
      
      // Store in localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      
      // Update state
      setUser(data.user);
      setToken(data.token);
      setIsAuthenticated(true);
      setAuthError(null);
      
      return true;
    } catch (error) {
      // Handle API errors
      if (error instanceof ApiError) {
        setAuthError(error.message);
      } else {
        setAuthError('An unexpected error occurred during signup');
      }
      console.error('Signup error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    // Remove from localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    // Update state
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };
  
  // Provide auth context to children
  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      token,
      login,
      signup,
      logout,
      authError,
      clearAuthError,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the auth context
 * 
 * Provides easy access to auth state and functions
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};