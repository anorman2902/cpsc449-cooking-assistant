/**
 * Authentication Context
 * 
 * Provides authentication state management across the application.
 * Handles user login, signup, logout, and token storage.
 */
import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { authApi, ApiError } from '../services/api';
import { favoriteApi } from '../services/userService';
import { Recipe } from '../services/recipeService';

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
  favoriteIds: Set<string>;
  addFavoriteId: (recipeId: string) => void;
  removeFavoriteId: (recipeId: string) => void;
  fetchUserFavorites: () => Promise<void>;
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
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  
  // Function to fetch favorite IDs
  const fetchUserFavorites = useCallback(async () => { // Use useCallback
    const currentToken = localStorage.getItem('auth_token'); // Check token again
    if (!currentToken) {
      setFavoriteIds(new Set()); // Clear favorites if no token
      return;
    }
    try {
      // Fetch full favorite recipe objects
      const favoritesData = await favoriteApi.getFavorites(currentToken);
      // Extract only IDs and store in the Set
      const ids = favoritesData.map(recipe => recipe.id);
      setFavoriteIds(new Set(ids));
    } catch (error) {
      console.error('Failed to fetch favorites in context:', error);
      // Don't clear favorites on error, maybe loaded previously
    }
  }, []); // Dependency array empty, uses localStorage directly

  // Initial token verification and favorite fetching 
  useEffect(() => {
    const verifyAndFetch = async () => {
      const storedToken = localStorage.getItem('auth_token');
      setLoading(true); // Start loading
      setFavoriteIds(new Set()); // Reset favorites initially

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await authApi.verifyToken(storedToken);
        setToken(storedToken);
        setUser(data.user);
        setIsAuthenticated(true);
        // Fetch favorites *after* successful token verification
        await fetchUserFavorites();
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setIsAuthenticated(false); // Ensure state is cleared on error
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    verifyAndFetch();
  }, [fetchUserFavorites]);
  
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
      await fetchUserFavorites(); // Fetch favorites after login
      return true;
    } catch (error) {
      // Handle API errors
      if (error instanceof ApiError) {
        setAuthError(error.message);
      } else {
        setAuthError('An unexpected error occurred during login');
      }
      console.error('Login error:', error);
      setFavoriteIds(new Set());
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
      setFavoriteIds(new Set());
      return true;
    } catch (error) {
      // Handle API errors
      if (error instanceof ApiError) {
        setAuthError(error.message);
      } else {
        setAuthError('An unexpected error occurred during signup');
      }
      console.error('Signup error:', error);
      setFavoriteIds(new Set());
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
    setFavoriteIds(new Set());
  };
  
  // Functions to update local favorite state
  const addFavoriteId = (recipeId: string) => {
    setFavoriteIds(prevIds => new Set(prevIds).add(recipeId));
  };

  const removeFavoriteId = (recipeId: string) => {
    setFavoriteIds(prevIds => {
      const newIds = new Set(prevIds);
      newIds.delete(recipeId);
      return newIds;
    });
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
      favoriteIds,
      addFavoriteId,
      removeFavoriteId, 
      fetchUserFavorites 
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