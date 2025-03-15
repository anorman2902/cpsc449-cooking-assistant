/**
 * Theme Context
 * 
 * Provides theme management functionality across the application.
 * Handles theme toggling between light and dark modes and persists user preference.
 */
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// Define theme types
type Theme = 'light' | 'dark';

// Interface for the context value
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Props for the ThemeProvider component
interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * ThemeProvider component
 * 
 * Manages theme state and provides theme toggling functionality to all child components.
 * Uses localStorage to persist user theme preference across sessions.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize theme state from localStorage or default to 'light'
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as Theme) || 'light';
  });

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  // Apply theme class to document body when theme changes
  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  // Provide theme context to children
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to use the theme context
 * 
 * Provides easy access to theme state and toggle function
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 