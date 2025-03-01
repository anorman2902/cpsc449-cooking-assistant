/**
 * Home Page Component
 * 
 * Main landing page for the application that displays the search interface.
 */
import React, { useState } from 'react';
import './Home.css';
import SearchBar from '../../components/common/SearchBar/SearchBar';

/**
 * Home component - Main landing page
 * Manages search functionality and displays the hero section
 */
function Home() {
  // State management
  const [searchQuery, setSearchQuery] = useState(''); // Current search query

  /**
   * Handles basic search queries
   * @param {string} query - The search query entered by the user
   */
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Searching for:', query);
    // In a real app, this would make an API call to the backend
  };

  return (
    <div className="home-page">
      <main className="main-content">
        {/* Simple search interface with hero section */}
        <div className="hero-section">
          <h1 className="hero-title">Name Here</h1>
          <p className="hero-subtitle">
            Enter ingredients you have, and we'll show you what you can cook!
          </p>
          
          {/* Simple search bar component */}
          <SearchBar onSearch={handleSearch} />
        </div>
      </main>
    </div>
  );
}

export default Home; 