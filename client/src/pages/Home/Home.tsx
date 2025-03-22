/**
 * Home Page Component
 * 
 * Main landing page for the application that displays the search interface.
 */
import React, { useState, useEffect } from 'react';
import './Home.css';
import SearchBar from '../../components/common/SearchBar/SearchBar';
import { getAllRecipes, Recipe } from '../../services/recipeService';

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
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="home-page">
      <main className="main-content">
        {/* Simple search interface with hero section */}
        <div className="hero-section">
          <h1 className="hero-title">Recipe Finder</h1>
          <p className="hero-subtitle">
            Enter ingredients you have, and we'll show you what you can cook!
          </p>
          
          {/* Simple search bar component */}
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
                <div key={recipe.id} className="recipe-card">
                  <div className="recipe-image-placeholder"></div>
                  <div className="recipe-info">
                    <h3 className="recipe-title">{recipe.title}</h3>
                    {recipe.Ingredients && recipe.Ingredients.length > 0 && (
                      <div className="recipe-ingredients">
                        <p className="ingredients-label">Ingredients:</p>
                        <p className="ingredients-list">{recipe.Ingredients.map(i => i.name).join(', ')}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;