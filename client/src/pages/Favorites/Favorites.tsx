import React, { useState, useEffect} from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { favoriteApi } from '../../services/userService';
import { Recipe } from '../../services/recipeService';
import RecipeCard from '../../components/features/RecipeCard'; 
import './Favorites.css';

interface FavoritesProps {
    // Props needed for RecipeCard onClick navigation if necessary
     onRecipeSelect: (recipeId: string) => void;
}

const Favorites: React.FC<FavoritesProps> = ({ onRecipeSelect }) => {
  const { token, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token || !isAuthenticated) {
        setLoading(false);
        // Redirect or show login message if accessed directly
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await favoriteApi.getFavorites(token);
        setFavorites(data);
      } catch (err) {
        console.error("Failed to fetch favorites", err);
        setError('Failed to load your favorite recipes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token, isAuthenticated]); // Re-fetch if token changes

  const handleRecipeDeleted = (deletedRecipeId: string) => {
    setFavorites(prevFavorites => prevFavorites.filter(recipe => recipe.id !== deletedRecipeId));
  };

  // Decide what to render based on state
  let content;
  if (loading) {
    content = <div className="loading-indicator">Loading favorites...</div>;
  } else if (error) {
    content = <div className="error-message">{error}</div>;
  } else if (favorites.length === 0) {
    content = <div className="no-favorites">You haven't added any recipes to your favorites yet.</div>;
  } else {
    content = (
      <div className="favorites-grid">
        {favorites.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onClick={onRecipeSelect} // Use the passed prop
            pageContext="my-recipes"
            onRecipeDeleted={handleRecipeDeleted}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <h1 className="favorites-title">My Favorite Recipes</h1>
      {content}
    </div>
  );
};

export default Favorites;