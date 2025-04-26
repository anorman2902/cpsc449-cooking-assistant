/**
 * RecipeCard Component
 * 
 * Reusable component for displaying recipe cards throughout the application.
 * Used in both Home and SearchResults pages.
 */
import React, { useState, useEffect } from 'react';
import './RecipeCard.css';
import { Recipe } from '../../../services/recipeService';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthContext';
import { favoriteApi } from '../../../services/userService';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (recipeId: string) => void;
}

/**
 * RecipeCard component - Displays a preview of a recipe in a card format
 * 
 * Features:
 * - Responsive design
 * - Dark mode support
 * - Clickable to view recipe details
 * - Displays recipe image, title and ingredients
 */
const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  const { theme } = useTheme();
  const { token, isAuthenticated, favoriteIds, addFavoriteId, removeFavoriteId, user } = useAuth();

  // Local state to track if current card is currently favorited
  const [isFavorited, setIsFavorited] = useState(false);
  // Local state for loading status of the favorite action
  const [favLoading, setFavLoading] = useState(false);

  // Update local isFavorited state whenever the global favoriteIds set changes
  useEffect(() => {
    if (isAuthenticated && favoriteIds) {
      setIsFavorited(favoriteIds.has(recipe.id));
    } else {
      setIsFavorited(false); // Not favorited if not logged in
    }
  }, [favoriteIds, recipe.id, isAuthenticated]);

  const handleCardClick = () => {
    onClick(recipe.id);
  };

  // --- Updated Favorite Click Handler ---
  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click navigation

    // Use App.tsx's navigation for consistency if redirect needed
    // (Need to get the navigation function passed down or use React Router)
    // For now, we'll stick to alerting, but ideally redirect via a passed prop
     if (!isAuthenticated || !token || !user) {
       alert('Please log in to manage favorites.'); // Placeholder
       // Example redirect if onNavigate was passed: onNavigate('auth');
       return;
     }

    setFavLoading(true);

    try {
      if (isFavorited) {
        // --- Remove from Favorites ---
        await favoriteApi.removeFavorite(token, recipe.id);
        removeFavoriteId(recipe.id);
      } else {
        // --- Add to Favorites ---
        await favoriteApi.addFavorite(token, recipe.id);
        addFavoriteId(recipe.id);
      }
    } catch (error) {
      console.error('Failed to toggle favorite', error);
      alert('Could not update favorite status. Please try again.');
    } finally {
      setFavLoading(false); // Finish loading state
    }
  };
  
  return (
    <div
      className={`recipe-card ${theme === "dark" ? "recipe-card-dark" : ""}`}
      onClick={handleCardClick}
    >
      {recipe.image_url ? (
        <div className="recipe-card-image">
          <img src={recipe.image_url} alt={recipe.title} />
        </div>
      ) : (
        <div className="recipe-card-image-placeholder"></div>
      )}
      <div className="recipe-card-info">
        <h3 className="recipe-card-title">{recipe.title}</h3>
        {recipe.Ingredients && recipe.Ingredients.length > 0 && (
          <div className="recipe-card-ingredients">
            <p className="ingredients-label">Ingredients:</p>
            <p className="ingredients-list">
              {recipe.Ingredients.map((i) => i.name).join(", ")}
            </p>
          </div>
        )}
        {recipe.prep_time && recipe.cook_time && (
          <div className="recipe-card-time">
            <span>{recipe.total_time} min</span>
          </div>
        )}
        {/*Favorite Button*/}
        {isAuthenticated && ( // Only if logged in
          <button
            onClick={handleFavoriteToggle}
            style={{
              marginTop: "10px",
              cursor: favLoading ? "wait" : "pointer",
              alignSelf: "flex-start",
              background: "none",
              border: 'none', 
              padding: '5px', 
              fontSize: '1.5rem', 
              lineHeight: '1', 
              color: isFavorited ? 'red' : 'grey'
            }}
            disabled={favLoading} 
            aria-label={isFavorited ? `Remove ${recipe.title} from favorites` : `Add ${recipe.title} to favorites`}
          >
            {isFavorited ? '❤️' : '♡'}
          </button>
        )}
      </div>
    </div>
  );
};

export default RecipeCard; 