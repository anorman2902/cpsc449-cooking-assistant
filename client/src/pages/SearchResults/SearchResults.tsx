/**
 * Search Results Page Component
 * 
 * Displays search results based on user queries for ingredients and dietary restrictions.
 * This is a template page that will be populated with actual data when the backend is implemented.
 */
import React, { useState, useEffect } from 'react';
import './SearchResults.css';
import SearchBar from '../../components/common/SearchBar/SearchBar';
import { searchRecipes, Recipe } from '../../services/recipeService';

interface SearchResultsProps {
  query?: string;
  onSearch: (query: string) => void;
}

/**
 * SearchResults component - Displays recipe search results
 * 
 * @param {SearchResultsProps} props - Component props
 * @returns {JSX.Element} - Rendered search results page
 */
const SearchResults: React.FC<SearchResultsProps> = ({ query = '', onSearch }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch recipes when query changes
  useEffect(() => {
    const fetchRecipes = async () => {
      if (!query.trim()) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await searchRecipes(query);
        setRecipes(data);
      } catch (err) {
        setError('Failed to fetch recipes. Please try again.');
        console.error('Error fetching recipes:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipes();
  }, [query]);

  const handleNewSearch = (newQuery: string) => {
    onSearch(newQuery);
  };

  return (
    <div className="search-results-page">
      <div className="search-results-header">
        <h1 className="search-results-title">Search Results</h1>
        <div className="search-bar-container">
          <SearchBar onSearch={handleNewSearch} initialQuery={query} />
        </div>
        <div className="search-query-summary">
          <p>Showing results for: <span className="query-text">{query}</span></p>
        </div>
      </div>

      <div className="search-results-content">
        {loading ? (
          <div className="loading-indicator">Loading recipes...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : recipes.length === 0 ? (
          <div className="no-results">
            <p>No recipes found matching "{query}"</p>
          </div>
        ) : (
          <div className="results-grid">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="recipe-card">
                <div className="recipe-image-placeholder"></div>
                <div className="recipe-info">
                  <h3 className="recipe-title">{recipe.title}</h3>
                  {recipe.Ingredients && recipe.Ingredients.length > 0 && (
                    <div className="recipe-ingredients">
                      <p>Ingredients: {recipe.Ingredients.map(i => i.name).join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="search-results-filters">
        <h3>Future Filter Options</h3>
        <div className="filter-section">
          <h4>Dietary Restrictions</h4>
          <ul className="filter-options">
            <li>Vegetarian</li>
            <li>Vegan</li>
            <li>Gluten-Free</li>
            <li>Dairy-Free</li>
            <li>Nut-Free</li>
          </ul>
        </div>
        <div className="filter-section">
          <h4>Meal Type</h4>
          <ul className="filter-options">
            <li>Breakfast</li>
            <li>Lunch</li>
            <li>Dinner</li>
            <li>Snack</li>
            <li>Dessert</li>
          </ul>
        </div>
        <div className="filter-section">
          <h4>Cooking Time</h4>
          <ul className="filter-options">
            <li>Under 15 minutes</li>
            <li>15-30 minutes</li>
            <li>30-60 minutes</li>
            <li>Over 60 minutes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;