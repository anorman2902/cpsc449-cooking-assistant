/**
 * Authentication Context
 * 
 * Provides authentication state management across the application.
 * Handles user login, signup, logout, and token storage.
 */
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

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
  
  // Check for existing token on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);
  
  // Clear authentication error
  const clearAuthError = () => {
    setAuthError(null);
  };
  
  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // TODO: Replace with actual API call
      // placeholder
      console.log('Logging in with:', { email, password });
      
      // Simulate successful login
      if (email === 'test@example.com' && password === 'password') {
        // Mock user and token response
        const mockUser: User = {
          id: '123456',
          username: 'testuser',
          email: email
        };
        const mockToken = 'mock-jwt-token';
        
        // Store in localStorage
        localStorage.setItem('auth_token', mockToken);
        localStorage.setItem('auth_user', JSON.stringify(mockUser));
        
        // Update state
        setUser(mockUser);
        setToken(mockToken);
        setIsAuthenticated(true);
        setAuthError(null);
        
        return true;
      } else {
        // Simulate failed login
        setAuthError('Invalid email or password');
        return false;
      }
    } catch (error) {
      setAuthError('An error occurred during login');
      console.error('Login error:', error);
      return false;
    }
  };
  
  // Signup function
  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      // TODO: Replace with actual API call
      // This is a placeholder for demonstration purposes
      console.log('Signing up with:', { username, email, password });
      
      // Simulate successful signup
      // In a real app, this would make an API call to create the user
      const mockUser: User = {
        id: '123456',
        username: username,
        email: email
      };
      const mockToken = 'mock-jwt-token';
      
      // Store in localStorage
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      
      // Update state
      setUser(mockUser);
      setToken(mockToken);
      setIsAuthenticated(true);
      setAuthError(null);
      
      return true;
    } catch (error) {
      setAuthError('An error occurred during signup');
      console.error('Signup error:', error);
      return false;
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
      clearAuthError
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