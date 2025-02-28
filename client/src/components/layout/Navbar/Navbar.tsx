/**
 * Navbar Component
 * 
 * A responsive navigation bar that displays the application logo, navigation links,
 * and conditionally renders authentication-related links based on user login status.
 */
import React from 'react';
import './Navbar.css';

/**
 * Props interface for the Navbar component
 * @property {boolean} isLoggedIn - Flag indicating whether a user is currently logged in
 */
interface NavbarProps {
  isLoggedIn: boolean;
}

/**
 * Navbar component for site-wide navigation
 * 
 * @param {NavbarProps} props - Component props
 * @returns {JSX.Element} - Rendered navigation bar
 */
const Navbar: React.FC<NavbarProps> = ({ isLoggedIn }) => {
  return (
    <nav className="navbar">
      {/* Application logo and brand name */}
      <div className="navbar-logo">
        <span className="logo-icon">🍴</span> Name Here
      </div>
      
      {/* Navigation links section */}
      <div className="navbar-links">
        {/* Common navigation links */}
        <a href="/" className="nav-link">Home</a>
        <a href="/about" className="nav-link">About</a>
        
        {/* Conditional rendering based on authentication status */}
        {!isLoggedIn ? (
          // Login/Signup link for unauthenticated users
          <a href="/login" className="nav-link login-link">Login/Signup</a>
        ) : (
          // Additional links for authenticated users
          <>
            <a href="/favorites" className="nav-link">My Favorites</a>
            <a href="/profile" className="nav-link profile-link">Profile</a>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 