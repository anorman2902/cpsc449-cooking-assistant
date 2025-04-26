const { Recipe, Ingredient } = require('../models');
const { Op } = require('sequelize');

// Base URL for images
const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

/**
 * Recipe Controller
 * 
 * Handles API endpoints for recipe data.
 * For detailed image handling documentation, see: /docs/image-handling.md
 */

// Get all recipes
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      attributes: ['id', 'title', 'image_url'],
      include: [{
        model: Ingredient,
        as: 'Ingredients',
        through: { attributes: [] },
        attributes: ['id', 'name']
      }]
    });
    
    // Add full URL to images
    const recipesWithFullImageUrls = recipes.map(recipe => {
      const plainRecipe = recipe.get({ plain: true });
      if (plainRecipe.image_url) {
        plainRecipe.image_url = `${BASE_URL}/images/recipes/${plainRecipe.image_url.replace(/^\/images\/recipes\//, '')}`;
      }
      return plainRecipe;
    });
    
    return res.status(200).json(recipesWithFullImageUrls);
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
          [Op.iLike]: `%${query}%`
        }
      },
      attributes: ['id', 'title', 'image_url'],
      include: [{
        model: Ingredient,
        as: 'Ingredients',
        through: { attributes: [] },
        attributes: ['id', 'name']
      }]
    });

    // Search by ingredient name
    const recipesByIngredient = await Recipe.findAll({
      attributes: ['id', 'title', 'image_url'],
      include: [{
        model: Ingredient,
        as: 'Ingredients',
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
    }).map(recipe => {
      const plainRecipe = recipe.get({ plain: true });
      if (plainRecipe.image_url) {
        plainRecipe.image_url = `${BASE_URL}/images/recipes/${plainRecipe.image_url.replace(/^\/images\/recipes\//, '')}`;
      }
      return plainRecipe;
    });

    return res.status(200).json(uniqueRecipes);
  } catch (error) {
    console.error('Error searching recipes:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get recipe by ID
exports.getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'Recipe ID is required' });
    }

    const recipe = await Recipe.findByPk(id, {
      attributes: ['id', 'title', 'description', 'steps', 'prep_time', 'cook_time', 
                  'total_time', 'difficulty', 'servings', 'meal_type', 'best_time', 'image_url'],
      include: [{
        model: Ingredient,
        as: 'Ingredients',
        through: { attributes: [] },
        attributes: ['id', 'name']
      }]
    });

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    const plainRecipe = recipe.get({ plain: true });
    if (plainRecipe.image_url) {
      plainRecipe.image_url = `${BASE_URL}/images/recipes/${plainRecipe.image_url.replace(/^\/images\/recipes\//, '')}`;
    }
    
    return res.status(200).json(plainRecipe);
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}; 