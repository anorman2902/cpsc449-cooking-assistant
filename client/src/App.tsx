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
import SearchResults from './pages/SearchResults';
import Auth from './pages/Auth';
import { ThemeProvider } from './contexts/ThemeContext';

/**
 * App component - Main container for the Name Here application
 * Manages application state and renders the main layout
 */
function App() {
  // State management
  const [isLoggedIn] = useState(false); // User authentication state
  const [currentPage, setCurrentPage] = useState('home'); // Track current page
  const [searchQuery, setSearchQuery] = useState(''); // Store the current search query

  // Handle search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage('search-results'); // Navigate to search results page
    console.log('Searching for:', query);
    // In a real app, this would make an API call to the backend
  };

  // Simple routing function
  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <About />;
      case 'search-results':
        return <SearchResults query={searchQuery} onSearch={handleSearch} />;
        case 'auth':
        return <Auth />;
      case 'home':
      default:
        return <Home onSearch={handleSearch} />;
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