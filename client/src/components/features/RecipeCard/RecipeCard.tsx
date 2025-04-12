/**
 * RecipeCard Component
 * 
 * Reusable component for displaying recipe cards throughout the application.
 * Used in both Home and SearchResults pages.
 */
import React from 'react';
import './RecipeCard.css';
import { Recipe } from '../../../services/recipeService';
import { useTheme } from '../../../contexts/ThemeContext';

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
  
  const handleClick = () => {
    onClick(recipe.id);
  };
  
  return (
    <div 
      className={`recipe-card ${theme === 'dark' ? 'recipe-card-dark' : ''}`} 
      onClick={handleClick}
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
            <p className="ingredients-list">{recipe.Ingredients.map(i => i.name).join(', ')}</p>
          </div>
        )}
        {recipe.prep_time && recipe.cook_time && (
          <div className="recipe-card-time">
            <span>{recipe.total_time} min</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard; 