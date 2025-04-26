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
import RecipeDetails from './pages/RecipeDetails';
import Favorites from './pages/Favorites';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Content component to handle conditional rendering based on auth state
const AppContent = () => {
  // State management
  const [currentPage, setCurrentPage] = useState('home'); // Track current page
  const [searchQuery, setSearchQuery] = useState(''); // Store the current search query
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null); // Store selected recipe ID

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
  };

  // Handle recipe selection
  const handleRecipeSelect = (recipeId: string) => {
    setSelectedRecipeId(recipeId);
    setCurrentPage('recipe-details'); // Navigate to recipe details page
  };

  // Handle back navigation from recipe details
  const handleBackFromRecipeDetails = () => {
    setCurrentPage('home'); // Or keep track of previous page and go back there
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
        return <SearchResults query={searchQuery} onSearch={handleSearch} onRecipeSelect={handleRecipeSelect} />;
      case 'auth':
        return <Auth />;
      case 'profile':
        return isAuthenticated ? <Profile /> : <Auth />;
      case 'favorites':
        return isAuthenticated ? <Favorites onRecipeSelect={handleRecipeSelect} /> : <Auth />;
      case 'recipe-details':
        return selectedRecipeId ? 
          <RecipeDetails recipeId={selectedRecipeId} onBack={handleBackFromRecipeDetails} /> : 
          <Home onSearch={handleSearch} onRecipeSelect={handleRecipeSelect} />;
      case 'home':
      default:
        return <Home onSearch={handleSearch} onRecipeSelect={handleRecipeSelect} />;
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