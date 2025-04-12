/**
 * Recipe Details Page Component
 */
import React, { useState, useEffect } from 'react';
import './RecipeDetails.css';
import { getRecipeById, Recipe } from '../../services/recipeService';
import { useTheme } from '../../contexts/ThemeContext';

interface RecipeDetailsProps {
  recipeId: string;
  onBack: () => void;
}

/**
 * RecipeDetails component - Displays detailed information about a recipe
 * 
 * Shows comprehensive recipe information including ingredients, steps, cook time, etc.
 * Supports dark mode for better accessibility
 */
const RecipeDetails: React.FC<RecipeDetailsProps> = ({ recipeId, onBack }) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  // Fetch recipe details when component mounts
  useEffect(() => {
    const fetchRecipeDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getRecipeById(recipeId);
        setRecipe(data);
      } catch (err) {
        setError('Failed to fetch recipe details. Please try again.');
        console.error('Error fetching recipe details:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipeDetails();
  }, [recipeId]);

  // Helper function to format time in minutes to a readable format
  const formatTime = (minutes: number | undefined): string => {
    if (!minutes) return 'N/A';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours} hr ${mins > 0 ? `${mins} min` : ''}`;
    }
    return `${mins} min`;
  };

  // Render loading state
  if (loading) {
    return <div className="loading-indicator">Loading recipe details...</div>;
  }

  // Render error state
  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button className="back-button" onClick={onBack}>Back to Recipes</button>
      </div>
    );
  }

  // Render not found state
  if (!recipe) {
    return (
      <div className="not-found-container">
        <div className="not-found-message">Recipe not found</div>
        <button className="back-button" onClick={onBack}>Back to Recipes</button>
      </div>
    );
  }

  return (
    <div className={`recipe-details-page ${theme === 'dark' ? 'theme-dark' : ''}`}>
      <div className="recipe-header">
        <button className="back-button" onClick={onBack}>&larr; Back to Recipes</button>
        <h1 className="recipe-title">{recipe.title}</h1>
      </div>

      <div className="recipe-content">
        <div className="recipe-main-info">
          {recipe.image_url && (
            <div className="recipe-image-container">
              <img src={recipe.image_url} alt={recipe.title} className="recipe-image" />
            </div>
          )}

          <div className="recipe-metadata">
            <div className="metadata-item">
              <span className="metadata-label">Difficulty:</span>
              <span className="metadata-value">{recipe.difficulty || 'N/A'}</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Prep Time:</span>
              <span className="metadata-value">{formatTime(recipe.prep_time)}</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Cook Time:</span>
              <span className="metadata-value">{formatTime(recipe.cook_time)}</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Total Time:</span>
              <span className="metadata-value">{formatTime(recipe.total_time)}</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Servings:</span>
              <span className="metadata-value">{recipe.servings || 'N/A'}</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Meal Type:</span>
              <span className="metadata-value">{recipe.meal_type || 'N/A'}</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Best Time to Serve:</span>
              <span className="metadata-value">{recipe.best_time || 'N/A'}</span>
            </div>
          </div>
        </div>

        {recipe.description && (
          <div className="recipe-description">
            <h2>Description</h2>
            <p>{recipe.description}</p>
          </div>
        )}

        <div className="recipe-ingredients">
          <h2>Ingredients</h2>
          {recipe.Ingredients && recipe.Ingredients.length > 0 ? (
            <ul className="ingredients-list">
              {recipe.Ingredients.map(ingredient => (
                <li key={ingredient.id} className="ingredient-item">{ingredient.name}</li>
              ))}
            </ul>
          ) : (
            <p>No ingredients listed for this recipe.</p>
          )}
        </div>

        {recipe.steps && (
          <div className="recipe-steps">
            <h2>Preparation Steps</h2>
            <ol className="steps-list">
              {recipe.steps.split('\n').map((step, index) => {
                // Remove the leading number and period pattern (e.g., "1. ")
                const cleanedStep = step.replace(/^\d+\.\s*/, '');
                return (
                  <li key={index} className="step-item">{cleanedStep}</li>
                );
              })}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetails; 