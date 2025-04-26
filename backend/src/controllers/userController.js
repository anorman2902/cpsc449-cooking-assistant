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


exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; // From verifyToken middleware
        const { username } = req.body;

        if (!username || username.trim() === '') {
            return res.status(400).json({ message: 'Username cannot be empty' });
        }

        const trimmedUsername = username.trim();

        // Optional: Check if the new username is already taken by ANOTHER user
        const existingUser = await User.findOne({
             where: {
                username: trimmedUsername,
                id: { [Op.ne]: userId } 
             }
        });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        // Update username
        const [updatedCount] = await User.update({ username: trimmedUsername }, {
            where: { id: userId }
        });

        if (updatedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch the updated user data to return (excluding password)
        const updatedUser = await User.findByPk(userId, {
             attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
        });

        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });

    } catch (error) {
        console.error('Error updating profile:', error);
        // Check for validation errors from the model (like unique constraint if not handled above)
        if (error.name === 'SequelizeUniqueConstraintError') {
             return res.status(400).json({ message: 'Username already taken.' });
        }
        res.status(500).json({ message: 'Server error updating profile' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId, {
            // Exclude password field!
            attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
        });

        if (!user) {
             // Should not happen if verifyToken middleware ran successfully
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user); // Return the user object directly
    } catch (error) {
        console.error('Error getting profile:', error);
        res.status(500).json({ message: 'Server error getting profile' });
    }
};