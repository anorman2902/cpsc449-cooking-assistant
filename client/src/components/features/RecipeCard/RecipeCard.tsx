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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as fasHeart, faTrash } from '@fortawesome/free-solid-svg-icons'; // Removed faPencilAlt
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { deleteMyRecipe } from '../../../services/recipeService'; // Removed copyRecipeForUser

interface RecipeCardProps {
  recipe: Recipe & { user_id?: string; source_recipe_id?: string | null }; 
  onClick: (recipeId: string) => void;
  pageContext?: 'home' | 'search' | 'my-recipes' | 'details';
  onRecipeDeleted?: (recipeId: string) => void; // callback for delete
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
const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick, pageContext = 'home', onRecipeDeleted }) => {
  const { theme } = useTheme();
  const { token, isAuthenticated, favoriteIds, addFavoriteId, removeFavoriteId, user } = useAuth();

  // Local state to track if current card is currently favorited
  const [isFavorited, setIsFavorited] = useState(false);
  // Local state for loading status of the favorite action
  const [favLoading, setFavLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  // Favorite Click Handler
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

  // Handle Delete Click
  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click

    if (!isAuthenticated || !token || !user || user.id !== recipe.user_id) {
        alert('You can only delete your own recipes.');
        return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete "${recipe.title}"? This cannot be undone.`);
    if (!confirmDelete) {
        return;
    }

    setDeleteLoading(true);
    try {
        await deleteMyRecipe(recipe.id, token);
        // Alert user
        alert('Recipe deleted successfully.');
        // Remove from local favorite state if it was favorited
        removeFavoriteId(recipe.id);
        // Tell the parent page (MyRecipes) to remove this card from its list
        if (onRecipeDeleted) {
            onRecipeDeleted(recipe.id);
        }
    } catch (error) {
        console.error('Failed to delete recipe', error);
        alert('Could not delete recipe. Please try again.');
    } finally {
        setDeleteLoading(false);
    }
  };

  // Determine if the delete button should be shown (owned by user, on My Recipes page)
  const showDelete = pageContext === 'my-recipes' && isAuthenticated && user?.id === recipe.user_id;
  
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
        {recipe.total_time ? (
          <div className="recipe-card-time">
            <span>{recipe.total_time} min</span>
          </div>
        ) : recipe.prep_time || recipe.cook_time ? (
          <div className="recipe-card-time">
            <span>{(recipe.prep_time || 0) + (recipe.cook_time || 0)} min</span>
          </div>
        ) : null}
        {/* --- Wrapper for Action Buttons --- */}
        <div
          style={{
            display: "flex", // Use flexbox for horizontal layout
            gap: "10px", // Space between buttons
            marginTop: "auto", // Push buttons to the bottom
            paddingTop: "10px", // Add some space above buttons
            alignItems: "center", // Vertically align icons
          }}
        >
          {/*Favorite Button*/}
          {isAuthenticated && ( // Only if logged in
            <button
              onClick={handleFavoriteToggle}
              style={{
                cursor: favLoading ? "wait" : "pointer",
                alignSelf: "flex-start",
                background: "none",
                border: "none",
                padding: "5px",
                fontSize: "1.5rem",
                lineHeight: "1",
                color: isFavorited ? "red" : "grey",
              }}
              disabled={favLoading}
              aria-label={
                isFavorited
                  ? `Remove ${recipe.title} from favorites`
                  : `Add ${recipe.title} to favorites`
              }
            >
              <FontAwesomeIcon
                icon={isFavorited ? fasHeart : farHeart}
                color={isFavorited ? "red" : "grey"}
              />
            </button>
          )}
          {/* Delete Button */}
          {showDelete && (
            <button
              onClick={handleDeleteClick}
              style={{
                ...buttonBaseStyles,
                color: "var(--danger-color)",
                opacity: deleteLoading ? 0.5 : 1,
              }}
              disabled={deleteLoading}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
          {/* --- Placeholder buttons if NOT authenticated --- */}
          {!isAuthenticated && (
            <>
              <button
                style={{ ...buttonBaseStyles, color: "grey" }}
                onClick={() => alert("Please log in to favorite recipes.")}
              >
                <FontAwesomeIcon icon={farHeart} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Define base styles for buttons 
const buttonBaseStyles: React.CSSProperties = {
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  padding: '0',
  fontSize: '1.5rem',
  lineHeight: '1',
  marginLeft: '0.5rem' // Consistent spacing
};

export default RecipeCard; 