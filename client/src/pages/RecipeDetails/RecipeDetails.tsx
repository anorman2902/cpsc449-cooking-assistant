/**
 * Recipe Details Page Component
 */
import React, { useState, useEffect } from 'react';
import './RecipeDetails.css';
import { getRecipeById, Recipe, deleteMyRecipe } from '../../services/recipeService';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { favoriteApi } from '../../services/userService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as fasHeart, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';

interface RecipeDetailsProps {
  recipeId: string;
  onBack: () => void;
  //onNavigate: (page: string) => void;
}

/**
 * RecipeDetails component - Displays detailed information about a recipe
 * 
 * Shows comprehensive recipe information including ingredients, steps, cook time, etc.
 * Supports dark mode for better accessibility
 */
const RecipeDetails: React.FC<RecipeDetailsProps> = ({ recipeId, onBack /*, onNavigate */}) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  const { token, isAuthenticated, favoriteIds, addFavoriteId, removeFavoriteId, user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch recipe details when component mounts or recipeId changes
  useEffect(() => {
    const fetchRecipeDetails = async () => {
      setLoading(true);
      setError(null);
      setRecipe(null); 
      setIsFavorited(false);
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
  }, [recipeId]); // Depend only on recipeId

  // Sync local isFavorited state when global favoriteIds or the loaded recipe changes
  useEffect(() => {
    if (isAuthenticated && favoriteIds && recipe) {
      setIsFavorited(favoriteIds.has(recipe.id));
    } else {
      setIsFavorited(false); // Reset if not logged in or recipe not loaded
    }
  }, [favoriteIds, recipe, isAuthenticated]);

  // --- Favorite Toggle Handler ---
  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Just in case it's somehow nested

    // Redirect or alert if not logged in
    if (!isAuthenticated || !token || !user) {
      alert('Please log in to manage favorites.');
      // Optionally redirect: onNavigate('auth');
      return;
    }

    if (!recipe) return; 

    setFavLoading(true);

    try {
      if (isFavorited) {
        // Remove from Favorites
        await favoriteApi.removeFavorite(token, recipe.id);
        removeFavoriteId(recipe.id); // Update context immediately
      } else {
        // Add to Favorites
        await favoriteApi.addFavorite(token, recipe.id);
        addFavoriteId(recipe.id); // Update context immediately
      }
    } catch (error) {
      console.error('Failed to toggle favorite on details page', error);
      alert('Could not update favorite status. Please try again.');
    } finally {
      setFavLoading(false);
    }
  };

  // --- Delete Click Handler ---
  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated || !token || !user || !recipe || user.id !== recipe.user_id) {
      alert('You can only delete your own recipes.');
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete "${recipe.title}"? This cannot be undone.`);
    if (!confirmDelete) return;

    setDeleteLoading(true);
    try {
      await deleteMyRecipe(recipe.id, token);
      alert('Recipe deleted successfully.');
      removeFavoriteId(recipe.id); // Remove from context favorites if it was there
      onBack(); // Go back to the previous page (e.g., Home or Favorites)
    } catch (error) {
      console.error('Failed to delete recipe', error);
      alert('Could not delete recipe. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Helper function to format time in minutes to a readable format
  const formatTime = (minutes: number | undefined): string => {
    if (minutes === undefined || minutes === null) return 'N/A'; // Handle null too
    if (minutes === 0) return '0 min'; // Handle 0 minutes explicitly
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
        return `${hours} hr${mins > 0 ? ` ${mins} min` : ''}`;
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
      {/* Header */}
      <div className="recipe-header">
        <button className="back-button" onClick={onBack}>← Back</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' }}> {/* Wrapper for title + buttons */}
          <h1 className="recipe-title" style={{ margin: 0 }}>{recipe.title}</h1>

          {/* Action Buttons Container */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Favorite Button */}
            {isAuthenticated && (
              <button
                onClick={handleFavoriteToggle}
                style={{ ...buttonBaseStyles, color: isFavorited ? 'red' : 'grey' }}
                disabled={favLoading}
                aria-label={isFavorited ? `Remove ${recipe.title} from favorites` : `Add ${recipe.title} to favorites`}
              >
                <FontAwesomeIcon icon={isFavorited ? fasHeart : farHeart} />
              </button>
            )}
            {!isAuthenticated && (
               <button style={{ ...buttonBaseStyles, color: 'grey' }} onClick={() => alert('Please log in to favorite.')}><FontAwesomeIcon icon={farHeart} /></button>
            )}

            {/* Delete Button (Show for *owned* recipes when logged in) */}
            {isAuthenticated && user?.id === recipe.user_id && (
              <button
                onClick={handleDeleteClick}
                style={{ ...buttonBaseStyles, color: 'var(--danger-color)', opacity: deleteLoading ? 0.5 : 1 }}
                disabled={deleteLoading}
                aria-label={`Delete ${recipe.title}`}
              >
                <FontAwesomeIcon icon={faTrash} title="Delete this recipe"/>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="recipe-content">
        <div className="recipe-main-info">
          {recipe.image_url && (
            <div className="recipe-image-container">
              <img src={recipe.image_url} alt={recipe.title} className="recipe-image" />
            </div>
          )}

          {/* Metadata Section */}
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

        {recipe.ai_insight && (
          <div className="recipe-ai-insight">
            <h2>AI Chef Insights</h2>
            <p className="ai-insight-text">{recipe.ai_insight}</p>
            <div className="ai-badge">Generated by AI</div>
          </div>
        )}

        <div className="recipe-ingredients">
          <h2>Ingredients</h2>
          {recipe.Ingredients && recipe.Ingredients.length > 0 ? (
            <ul className="ingredients-list">
              {/* Check if ingredient has a name before rendering */}
              {recipe.Ingredients.filter(ing => ing && ing.name).map(ingredient => (
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
              {recipe.steps.split(',').map((step, index) => {
                const cleanedStep = step.trim();
                return cleanedStep ? <li key={index} className="step-item">{cleanedStep}</li> : null;
              })}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

const buttonBaseStyles: React.CSSProperties = {
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  padding: '0',
  fontSize: '1.8rem', 
  lineHeight: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

export default RecipeDetails;