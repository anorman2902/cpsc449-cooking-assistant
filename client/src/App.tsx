/**
 * Main application component for the Name Here app.
 * Serves as the entry point and manages the overall application state and layout.
 */
import React, { useState } from 'react';
import './App.css';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';

/**
 * App component - Main container for the Name Here application
 * Manages application state and renders the main layout
 */
function App() {
  // State management
  const [isLoggedIn] = useState(false); // User authentication state

  return (
    <div className="App">
      {/* Navigation bar component */}
      <Navbar isLoggedIn={isLoggedIn} />
      
      {/* Main content - currently just the home page */}
      <Home />
      
      {/* Footer component */}
      <Footer />
    </div>
  );
}

export default App; 