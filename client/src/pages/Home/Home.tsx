/**
 * Home Page Component
 * 
 * Main landing page for the application that displays the search interface.
 */
import React from 'react';
import './Home.css';
import SearchBar from '../../components/common/SearchBar/SearchBar';

/**
 * Props interface for the Home component
 * @property {function} onSearch - Callback function that receives the search query
 */
interface HomeProps {
  onSearch: (query: string) => void;
}

/**
 * Home component - Main landing page
 * Manages search functionality and displays the hero section
 * 
 * @param {HomeProps} props - Component props
 * @returns {JSX.Element} - Rendered home page
 */
function Home({ onSearch }: HomeProps) {
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
          <SearchBar onSearch={onSearch} />
        </div>
      </main>
    </div>
  );
}

export default Home;