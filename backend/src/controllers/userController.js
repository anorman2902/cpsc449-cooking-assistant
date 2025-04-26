const { User, Recipe, UserFavorite } = require('../models');
const { Op } = require('sequelize');

// Get user's favorite recipes
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id; 
    const user = await User.findByPk(userId, {
      include: [{
        model: Recipe,
        as: 'FavoriteRecipes', // Use alias defined in the association
        attributes: ['id', 'title', 'image_url'],
        through: { attributes: [] } // Don't include junction table attributes
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add full image URLs
    const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
    const favorites = user.FavoriteRecipes.map(recipe => {
        const plainRecipe = recipe.get({ plain: true });
        if (plainRecipe.image_url) {
            plainRecipe.image_url = `${BASE_URL}/images/recipes/${plainRecipe.image_url.replace(/^\/images\/recipes\//, '')}`;
        }
        return plainRecipe;
    });

    res.status(200).json(favorites);
  } catch (error) {
    console.error('Error getting favorites:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add recipe to favorites
exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { recipeId } = req.body;

    if (!recipeId) {
      return res.status(400).json({ message: 'Recipe ID is required' });
    }

    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // findOrCreate prevents duplicates and doesn't throw an error if it already exists
    await UserFavorite.findOrCreate({
      where: { userId, recipeId }
    });

    res.status(201).json({ message: 'Recipe added to favorites' });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove recipe from favorites
exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { recipeId } = req.params; // Get recipeId from URL parameter

    const result = await UserFavorite.destroy({
      where: { userId, recipeId }
    });

    if (result === 0) {
      return res.status(404).json({ message: 'Favorite not found or already removed' });
    }

    res.status(200).json({ message: 'Recipe removed from favorites' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- Add updateProfile method later in Phase 2 ---
// (Code for updateProfile from previous response goes here later)
// --- Add getProfile method later in Phase 2 ---
// (Code for getProfile from previous response goes here later)