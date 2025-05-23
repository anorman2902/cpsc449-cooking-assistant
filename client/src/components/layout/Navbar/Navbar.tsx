/**
 * Navbar Component
 * 
 * A responsive navigation bar that displays the application logo, navigation links,
 * and conditionally renders authentication-related links based on user login status.
 */
import React from 'react';
import './Navbar.css';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthContext';

/**
 * Props interface for the Navbar component
 * @property {function} onNavigate - Callback function for navigation events
 * @property {string} currentPage - Currently active page
*/

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

/**
 * Navbar component for site-wide navigation
 * 
 * @param {NavbarProps} props - Component props
 * @returns {JSX.Element} - Rendered navigation bar
 */
const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  // Get theme context
  const { theme, toggleTheme } = useTheme();

  // Get authentication context
  const { isAuthenticated, logout } = useAuth();
  
  // Handler for navigation links
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, page: string) => {
    e.preventDefault();
    onNavigate(page);
  };

  // Handle logout click
  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    logout();
    onNavigate('home');
  };
  
  return (
    <nav className="navbar">
      {/* Application logo and brand name */}
      <div className="navbar-logo" onClick={(e) => handleNavClick(e as any, 'home')} style={{ cursor: 'pointer' }}>
        <span className="logo-icon">🍴</span> Name Here
      </div>
      
      {/* Navigation links section */}
      <div className="navbar-links">
        {/* Theme toggle button */}
        <button 
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        
        {/* Common navigation links */}
        <a 
          href="/" 
          className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
          onClick={(e) => handleNavClick(e, 'home')}
        >
          Home
        </a>
        
        <a 
          href="/about" 
          className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
          onClick={(e) => handleNavClick(e, 'about')}
        >
          About
        </a>
        
        {/* Conditional rendering based on authentication status */}
        {!isAuthenticated ? (
          // Login/Signup link for unauthenticated users
          <a href="/auth" className={`nav-link login-link ${currentPage === 'auth' ? 'active' : ''}`}
          onClick={(e) => handleNavClick(e, 'auth')}>Login/Signup</a>
        ) : (
          // Additional links for authenticated users
          <>
            <a href="/favorites" className={`nav-link ${currentPage === 'favorites' ? 'active' : ''}`}
              onClick={(e) => handleNavClick(e, 'favorites')}>My Recipes</a>
            <a href="/profile" className={`nav-link profile-link ${currentPage === 'profile' ? 'active' : ''}`}
              onClick={(e) => handleNavClick(e, 'profile')}>Profile</a>
            <a href="/logout" className="nav-link logout-link" onClick={handleLogout}>Logout</a>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 