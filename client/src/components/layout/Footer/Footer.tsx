/**
 * Footer Component
 * 
 * A simple footer component that displays copyright information.
 */
import React from 'react';
import './Footer.css';

/**
 * Footer component for site-wide footer
 * 
 * @returns {JSX.Element} - Rendered footer
 */
const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Name Here. All rights reserved.</p>
    </footer>
  );
};

export default Footer; 