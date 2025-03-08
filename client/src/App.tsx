/**
 * Main application component for the Name Here app.
 * Serves as the entry point and manages the overall application state and layout.
 */
import React, { useState } from 'react';
import './App.css';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import { ThemeProvider } from './contexts/ThemeContext';

/**
 * App component - Main container for the Name Here application
 * Manages application state and renders the main layout
 */
function App() {
  // State management
  const [isLoggedIn] = useState(false); // User authentication state
  const [currentPage, setCurrentPage] = useState('home'); // Track current page

  // Simple routing function
  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <About />;
      case 'home':
      default:
        return <Home />;
    }
  };

  // Handle navigation clicks
  const handleNavigation = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <ThemeProvider>
      <div className="App">
        {/* Navigation bar component */}
        <Navbar isLoggedIn={isLoggedIn} onNavigate={handleNavigation} currentPage={currentPage} />
        
        {/* Render the current page based on state */}
        {renderPage()}
        
        {/* Footer component */}
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App; 