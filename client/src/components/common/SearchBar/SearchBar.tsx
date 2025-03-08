/**
 * SearchBar Component
 * 
 * A reusable search input component that allows users to enter search queries
 * for finding recipes based on ingredients. Handles form submission and keyboard
 * events for a smooth user experience.
 */
import React, { useState, useEffect } from 'react';
import './SearchBar.css';

/**
 * Props interface for the SearchBar component
 * @property {function} onSearch - Callback function that receives the search query
 * @property {string} initialQuery - Optional initial value for the search input
 */
interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

/**
 * SearchBar component for recipe ingredient search
 * 
 * @param {SearchBarProps} props - Component props
 * @returns {JSX.Element} - Rendered search bar component
 */
const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialQuery = '' }) => {
  // State to track the current search input value
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  
  // Update searchQuery when initialQuery changes
  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  /**
   * Handles form submission events
   * Prevents default form behavior and triggers the search if query is not empty
   * 
   * @param {React.FormEvent} e - The form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  /**
   * Handles keyboard events for the search input
   * Allows users to submit the search by pressing Enter
   * 
   * @param {React.KeyboardEvent<HTMLInputElement>} e - The keyboard event
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      e.preventDefault();
      onSearch(searchQuery);
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder="Enter ingredients you have (e.g., chicken, rice, tomatoes)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Search recipes"
        />
      </form>
    </div>
  );
};

export default SearchBar; 