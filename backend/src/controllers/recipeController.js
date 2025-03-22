const { Recipe, Ingredient, RecipeIngredient } = require('../models');
const { Op } = require('sequelize');

// Get all recipes
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      attributes: ['id', 'title'],
      include: [{
        model: Ingredient,
        through: { attributes: [] }, // Don't include junction table fields
        attributes: ['id', 'name']
      }]
    });
    
    return res.status(200).json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Search recipes by name or ingredient
exports.searchRecipes = async (req, res) => {
  try {
    const { query } = req.params;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Search by recipe name
    const recipesByName = await Recipe.findAll({
      where: {
        title: {
          [Op.iLike]: `%${query}%` // Case-insensitive search
        }
      },
      attributes: ['id', 'title'],
      include: [{
        model: Ingredient,
        through: { attributes: [] },
        attributes: ['id', 'name']
      }]
    });

    // Search by ingredient name
    const recipesByIngredient = await Recipe.findAll({
      attributes: ['id', 'title'],
      include: [{
        model: Ingredient,
        through: { attributes: [] },
        where: {
          name: {
            [Op.iLike]: `%${query}%`
          }
        },
        attributes: ['id', 'name']
      }]
    });

    // Combine results and remove duplicates
    const allRecipes = [...recipesByName, ...recipesByIngredient];
    const uniqueRecipeIds = new Set();
    const uniqueRecipes = allRecipes.filter(recipe => {
      if (uniqueRecipeIds.has(recipe.id)) {
        return false;
      }
      uniqueRecipeIds.add(recipe.id);
      return true;
    });

    return res.status(200).json(uniqueRecipes);
  } catch (error) {
    console.error('Error searching recipes:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}; 