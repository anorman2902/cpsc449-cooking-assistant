/**
 * Home Page Component
 */
import React, { useState, useEffect } from 'react';
import './Home.css';
import SearchBar from '../../components/common/SearchBar/SearchBar';
import RecipeCard from '../../components/features/RecipeCard';
import { getAllRecipes, Recipe } from '../../services/recipeService';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Props interface for the Home component
 */
interface HomeProps {
  onSearch: (query: string) => void;
  onRecipeSelect: (recipeId: string) => void;
}

/**
 * Home component - Main landing page
 * 
 * Displays the search interface and available recipes.
 * Uses the shared RecipeCard component for consistent recipe display.
 * Supports dark mode for better accessibility.
 */
function Home({ onSearch, onRecipeSelect }: HomeProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  // Fetch all recipes on component mount
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getAllRecipes();
        setRecipes(data);
      } catch (err) {
        setError('Failed to fetch recipes. Please try again.');
        console.error('Error fetching recipes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className={`home-page ${theme === 'dark' ? 'theme-dark' : ''}`}>
      <main className="main-content">
        {/* Simple search interface with hero section */}
        <div className="hero-section">
          <h1 className="hero-title">Name Here</h1>
          <p className="hero-subtitle">
            Enter ingredients you have, and we'll show you what you can cook!
          </p>
          
          <SearchBar onSearch={onSearch} />
        </div>

        {/* Display all available recipes */}
        <div className="available-recipes">
          <h2 className="section-title">Available Recipes</h2>
          
          {loading ? (
            <div className="loading-indicator">Loading recipes...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : recipes.length === 0 ? (
            <div className="no-recipes">
              <p>No recipes available yet.</p>
            </div>
          ) : (
            <div className="recipes-grid">
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
      </main>
    </div>
  );
}

export default Home;