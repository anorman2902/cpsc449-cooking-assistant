/**
 * Main application component for the Name Here app.
 * Serves as the entry point and manages the overall application state and layout.
 */
import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import SearchResults from './pages/SearchResults';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Content component to handle conditional rendering based on auth state
const AppContent = () => {
  // State management
  const [currentPage, setCurrentPage] = useState('home'); // Track current page
  const [searchQuery, setSearchQuery] = useState(''); // Store the current search query

  // Get auth context
  const { isAuthenticated, loading } = useAuth();
  
  // Effect to redirect from auth page when authenticated
  useEffect(() => {
    if (isAuthenticated && currentPage === 'auth') {
      setCurrentPage('home');
    }
    
    // Redirect from protected pages if not authenticated
    if (!isAuthenticated && ['profile', 'favorites'].includes(currentPage)) {
      setCurrentPage('auth');
    }
  }, [isAuthenticated, currentPage]);

  // Handle search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage('search-results'); // Navigate to search results page
    console.log('Searching for:', query);
    // In a real app, this would make an API call to the backend
  };

  // Simple routing function
  const renderPage = () => {
    // Show loading indicator during initial auth check
    if (loading && ['profile', 'favorites'].includes(currentPage)) {
      return <div className="loading-container">Loading...</div>;
    }

    switch (currentPage) {
      case 'about':
        return <About />;
      case 'search-results':
        return <SearchResults query={searchQuery} onSearch={handleSearch} />;
      case 'auth':
        return <Auth />;
      case 'profile':
        return isAuthenticated ? <Profile /> : <Auth />;
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
    <div className="App">
      {/* Navigation bar component */}
      <Navbar onNavigate={handleNavigation} currentPage={currentPage} />
      
      {/* Render the current page based on state */}
      {renderPage()}
      
      {/* Footer component */}
      <Footer />
    </div>
  );
}

/**
 * App component - Main container for the Name Here application
 */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;