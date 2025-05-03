/**
 * Search Results Page Component
 */
import React, { useState, useEffect } from 'react';
import './SearchResults.css';
import SearchBar from '../../components/common/SearchBar/SearchBar';
import RecipeCard from '../../components/features/RecipeCard';
import { searchRecipes, Recipe } from '../../services/recipeService';
import { useTheme } from '../../contexts/ThemeContext';

interface SearchResultsProps {
  query?: string;
  onSearch: (query: string) => void;
  onRecipeSelect: (recipeId: string) => void;
}

/**
 * SearchResults component - Displays recipe search results
 * 
 * Shows filtered recipes based on search query.
 * Uses the shared RecipeCard component for consistent recipe display.
 */
const SearchResults: React.FC<SearchResultsProps> = ({ query = '', onSearch, onRecipeSelect }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

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
    <div className={`search-results-page ${theme === 'dark' ? 'theme-dark' : ''}`}>
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
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={onRecipeSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;