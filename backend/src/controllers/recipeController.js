const { Recipe, Ingredient, RecipeIngredient, UserFavorite } = require('../models');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../config/db');

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
      where: { source_recipe_id: null }, // Only get original recipes
      attributes: ['id', 'title', 'image_url', 'source_recipe_id', 'user_id'],
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
      attributes: ['id', 'title', 'image_url', 'source_recipe_id', 'user_id'],
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
                  'total_time', 'difficulty', 'servings', 'meal_type', 'best_time', 'image_url', 'source_recipe_id', 'user_id'],
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

// Copy Recipe for User
exports.copyRecipe = async (req, res) => {
  const originalRecipeId = req.params.id;
  const userId = req.user.id; // From verifyToken middleware
  const transaction = await sequelize.transaction(); // Use transaction for multi-step operation

  try {
      // 1. Find the original recipe and its ingredients
      const originalRecipe = await Recipe.findByPk(originalRecipeId, {
          include: [{
              model: Ingredient,
              as: 'Ingredients', // Use alias
              attributes: ['id'], 
              through: { attributes: ['quantity'] } // Get quantity from junction table
          }],
          transaction
      });

      if (!originalRecipe) {
          await transaction.rollback();
          return res.status(404).json({ message: 'Original recipe not found' });
      }

      // 2. Create the new recipe copy
      const newRecipeData = {
          ...originalRecipe.get({ plain: true }), // Copy data from original
          id: uuidv4(), // Generate NEW UUID for the copy
          user_id: userId, // Assign to the current user
          source_recipe_id: originalRecipeId, // Link back to the original
          title: `${originalRecipe.title} (My Copy)`, // Indicate it's a copy
          createdAt: new Date(), // Reset timestamps
          updatedAt: new Date(),
      };
      delete newRecipeData.Ingredients;
      delete newRecipeData.UserFavorite; // If UserFavorite gets included somehow
      delete newRecipeData.RecipeIngredients; // If this gets included somehow

      const newRecipe = await Recipe.create(newRecipeData, { transaction });

      // 3. Copy the ingredient associations
      if (originalRecipe.Ingredients && originalRecipe.Ingredients.length > 0) {
          const newRecipeIngredients = originalRecipe.Ingredients.map(ing => ({
              id: uuidv4(), // New ID for the junction table entry
              recipe_id: newRecipe.id, // Link to the NEW recipe
              ingredient_id: ing.id, // Link to the ORIGINAL ingredient
              quantity: ing.RecipeIngredient?.quantity ?? 1, // Copy quantity, default if missing
              // Timestamps for RecipeIngredient are often false or handled by DB default
          }));
          await RecipeIngredient.bulkCreate(newRecipeIngredients, { transaction });
      }

      await UserFavorite.findOrCreate({
        where: { userId: userId, recipeId: newRecipe.id },
        transaction // Make sure it's part of the transaction
      });

      // 4. Commit transaction
      await transaction.commit();

      // 5. Respond with the new recipe's ID (or the full object)
      res.status(201).json({ message: 'Recipe copied successfully', newRecipeId: newRecipe.id });

  } catch (error) {
      await transaction.rollback(); // Rollback on any error
      console.error('Error copying recipe:', error);
      res.status(500).json({ message: 'Server error copying recipe' });
  }
};

// Update User's Own Recipe
exports.updateRecipe = async (req, res) => {
  const recipeIdToUpdate = req.params.id;
  const userId = req.user.id;
  // Allow updating title, description, steps for now
  const { title, description, steps, prep_time, cook_time, total_time, difficulty, servings, meal_type, best_time } = req.body;

  // Basic validation
  if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Recipe title cannot be empty' });
  }

  try {
      const recipe = await Recipe.findByPk(recipeIdToUpdate);

      if (!recipe) {
          return res.status(404).json({ message: 'Recipe not found' });
      }

      // Verify ownership! User can only update their own copies/creations
      if (recipe.user_id !== userId) {
          return res.status(403).json({ message: 'You can only edit your own recipes' });
      }

      // Update the recipe
      const [updatedCount] = await Recipe.update({
          title: title.trim(),
          description: description ?? recipe.description, // Use existing if not provided
          steps: steps ?? recipe.steps,
          prep_time: prep_time ?? recipe.prep_time,
          cook_time: cook_time ?? recipe.cook_time,
          total_time: total_time ?? recipe.total_time,
          difficulty: difficulty ?? recipe.difficulty,
          servings: servings ?? recipe.servings,
          meal_type: meal_type ?? recipe.meal_type,
          best_time: best_time ?? recipe.best_time,
          // Not updating ingredients here yet
      }, {
          where: { id: recipeIdToUpdate, user_id: userId } // Redundant user_id check for safety
      });

      if (updatedCount === 0) {
           // Should only happen in a race condition or if findByPk failed somehow
           return res.status(404).json({ message: 'Recipe not found or update failed' });
      }

       // Fetch updated recipe data to return
       const updatedRecipe = await Recipe.findByPk(recipeIdToUpdate, {
          include: [{ model: Ingredient, as: 'Ingredients', through: {attributes: []}, attributes: ['id', 'name']}]
       });

      res.status(200).json({ message: 'Recipe updated successfully', recipe: updatedRecipe });

  } catch (error) {
      console.error('Error updating recipe:', error);
      res.status(500).json({ message: 'Server error updating recipe' });
  }
};

// Delete User's Own Recipe
exports.deleteRecipe = async (req, res) => {
  const recipeIdToDelete = req.params.id;
  const userId = req.user.id; // From verifyToken middleware

  try {
      const recipe = await Recipe.findByPk(recipeIdToDelete);

      if (!recipe) {
          return res.status(404).json({ message: 'Recipe not found' });
      }

      // Verify ownership, User can only delete their own copies/creations
      if (recipe.user_id !== userId) {
          return res.status(403).json({ message: 'Forbidden: You can only delete your own recipes' });
      }

      // Proceed with deletion
      await Recipe.destroy({
          where: {
              id: recipeIdToDelete,
              user_id: userId
          }
      });

      // Also remove any favorites pointing to this deleted recipe
      await UserFavorite.destroy({ where: { recipeId: recipeIdToDelete }});

      res.status(200).json({ message: 'Recipe deleted successfully' });

  } catch (error) {
      console.error('Error deleting recipe:', error);
      res.status(500).json({ message: 'Server error deleting recipe' });
  }
};