const { Recipe, Ingredient, RecipeIngredient, UserFavorite } = require('../models');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../config/db');
const aiService = require('../ai'); // Updated to use our new AI service
const path = require('path');
const fs = require('fs');

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

    // Split the query by comma and trim whitespace
    const searchTerms = query.split(',').map(term => term.trim()).filter(term => term.length > 0);
    
    // Initialize arrays to store results
    let recipesByName = [];
    let recipesByIngredient = [];

    // If we have multiple terms, assume they're ingredients
    if (searchTerms.length > 1) {
      // Search for recipes that contain ALL of the ingredients (AND condition)
      // We need to query differently for the AND relationship
      
      // First get all recipes
      const allRecipes = await Recipe.findAll({
        attributes: ['id', 'title', 'image_url', 'source_recipe_id', 'user_id', 'prep_time', 'cook_time', 'total_time'],
        include: [{
          model: Ingredient,
          as: 'Ingredients',
          through: { attributes: [] },
          attributes: ['id', 'name']
        }]
      });
      
      // Then filter for those that have ALL the search terms
      recipesByIngredient = allRecipes.filter(recipe => {
        const recipeIngredients = recipe.Ingredients.map(ing => ing.name.toLowerCase());
        // Check if ALL search terms are included in this recipe's ingredients
        return searchTerms.every(term => 
          recipeIngredients.some(ingName => ingName.includes(term.toLowerCase()))
        );
      });
    } else {
      // Single term - could be recipe name or ingredient
      const singleTerm = searchTerms[0];
      
      // Search by recipe name
      recipesByName = await Recipe.findAll({
        where: {
          title: {
            [Op.iLike]: `%${singleTerm}%`
          }
        },
        attributes: ['id', 'title', 'image_url', 'source_recipe_id', 'user_id', 'prep_time', 'cook_time', 'total_time'],
        include: [{
          model: Ingredient,
          as: 'Ingredients',
          through: { attributes: [] },
          attributes: ['id', 'name']
        }]
      });

      // Search by ingredient name
      recipesByIngredient = await Recipe.findAll({
        attributes: ['id', 'title', 'image_url', 'source_recipe_id', 'user_id', 'prep_time', 'cook_time', 'total_time'],
        include: [{
          model: Ingredient,
          as: 'Ingredients',
          through: { attributes: [] },
          where: {
            name: {
              [Op.iLike]: `%${singleTerm}%`
            }
          },
          attributes: ['id', 'name']
        }]
      });
    }

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

    // For each recipe, fetch all ingredients (not just the matching ones)
    const recipesWithAllIngredients = await Promise.all(
      uniqueRecipes.map(async (recipe) => {
        // Get the complete recipe with all ingredients
        const completeRecipe = await Recipe.findByPk(recipe.id, {
          attributes: ['id', 'title', 'image_url', 'source_recipe_id', 'user_id', 'prep_time', 'cook_time', 'total_time'],
          include: [{
            model: Ingredient,
            as: 'Ingredients',
            through: { attributes: [] },
            attributes: ['id', 'name']
          }]
        });
        
        const plainRecipe = completeRecipe.get({ plain: true });
        if (plainRecipe.image_url) {
          plainRecipe.image_url = `${BASE_URL}/images/recipes/${plainRecipe.image_url.replace(/^\/images\/recipes\//, '')}`;
        }
        return plainRecipe;
      })
    );

    return res.status(200).json(recipesWithAllIngredients);
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
                  'total_time', 'difficulty', 'servings', 'meal_type', 'best_time', 'image_url', 'source_recipe_id', 'user_id', 'ai_insight'],
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
    
    // If recipe doesn't have an AI insight yet, generate one and update the recipe
    if (!plainRecipe.ai_insight) {
      try {
        const ingredientsText = recipe.Ingredients ? 
          recipe.Ingredients.map(ing => ing.name).join(', ') : '';
        
        const insight = await aiService.generateRecipeInsight(
          recipe.title,
          recipe.description,
          ingredientsText,
          recipe.difficulty,
          recipe.meal_type
        );
        
        // Update recipe with the new insight
        await Recipe.update(
          { ai_insight: insight },
          { where: { id: recipe.id } }
        );
        
        // Add the insight to the response
        plainRecipe.ai_insight = insight;
      } catch (insightError) {
        console.error('Error generating recipe insight:', insightError);
        // Continue without insight if generation fails
      }
    }
    
    return res.status(200).json(plainRecipe);
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    return res.status(500).json({ message: 'Server error' });
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

      // Get the image filename before deleting the recipe
      const imageFilename = recipe.image_url;

      // Proceed with recipe deletion
      await Recipe.destroy({
          where: {
              id: recipeIdToDelete,
              user_id: userId
          }
      });

      // Also remove any favorites pointing to this deleted recipe
      await UserFavorite.destroy({ where: { recipeId: recipeIdToDelete }});

      // Delete the image file if it exists
      if (imageFilename) {
          const imagePath = path.join(__dirname, '../../public/images/recipes', imageFilename);
          try {
              await fs.promises.unlink(imagePath);
              console.log('Successfully deleted image file:', imageFilename);
          } catch (fsError) {
              console.error('Error deleting image file:', fsError);
              // Continue even if image deletion fails - the recipe is already deleted
          }
      }

      res.status(200).json({ message: 'Recipe deleted successfully' });

  } catch (error) {
      console.error('Error deleting recipe:', error);
      res.status(500).json({ message: 'Server error deleting recipe' });
  }
};

// Create a new recipe
exports.createRecipe = async (req, res) => {
  const userId = req.user.id; // From verifyToken middleware
  const { 
    title, 
    description, 
    ingredients, // comma-separated string
    steps, // comma-separated string for simplicity
    prep_time, 
    cook_time, 
    total_time, 
    difficulty, 
    servings, 
    meal_type, 
    best_time,
    image_data // Base64 encoded image
  } = req.body;

  // Basic validation
  if (!title || title.trim() === '') {
    return res.status(400).json({ message: 'Recipe title is required' });
  }

  if (!ingredients || !ingredients.trim()) {
    return res.status(400).json({ message: 'Ingredients are required' });
  }

  if (!steps || !steps.trim()) {
    return res.status(400).json({ message: 'Preparation steps are required' });
  }

  const transaction = await sequelize.transaction();

  try {
    // 1. Create the new recipe
    const recipeId = uuidv4();
    
    // 2. Handle image upload if provided
    let image_url = null;
    if (image_data) {
      try {
        // Extract image data from base64 string
        const matches = image_data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        
        if (matches && matches.length === 3) {
          const imageType = matches[1].split('/')[1];
          const imageBuffer = Buffer.from(matches[2], 'base64');
          
          // Validate file size - max 3MB
          if (imageBuffer.length > 3 * 1024 * 1024) {
            console.warn('Image too large, exceeding 3MB limit');
            // Continue without image if it's too large
          } else {
            // Create filename based on recipe ID
            const filename = `recipe-${recipeId}.${imageType === 'jpeg' ? 'jpg' : imageType}`;
            
            // Directory for recipe images
            const imageDir = path.join(__dirname, '../../public/images/recipes');
            const imagePath = path.join(imageDir, filename);
            
            console.log('Saving image to path:', imagePath);
            
            try {
              // Ensure directory exists
              await fs.promises.mkdir(imageDir, { recursive: true });
              
              // Save image to filesystem
              await fs.promises.writeFile(imagePath, imageBuffer);
              
              // Log success
              console.log('Image successfully saved to', filename);
              
              // Set image URL to be stored in the database (just the filename)
              image_url = filename;
            } catch (fsError) {
              console.error('Filesystem error when saving image:', fsError);
              // Continue without image
            }
          }
        }
      } catch (imageError) {
        console.error('Error processing image:', imageError);
        // Continue without image if there's an error
      }
    }
    
    // Process steps - ensure they're clean and comma-separated
    let processedSteps = steps.trim();
    // If steps already contain newlines, replace them with commas
    if (processedSteps.includes('\n')) {
      processedSteps = processedSteps
        .split('\n')
        .map(step => step.replace(/^\d+\.\s*/, '').trim()) // Remove numbering
        .filter(step => step) // Remove empty steps
        .join(', ');
    }
    // Ensure proper comma formatting - no extra spaces around commas
    processedSteps = processedSteps
      .split(',')
      .map(step => step.trim())
      .filter(step => step)
      .join(', ');

    // 3. Create the recipe in the database
    const newRecipe = await Recipe.create({
      id: recipeId,
      title: title.trim(),
      description: description || '',
      steps: processedSteps,
      prep_time: prep_time || 0,
      cook_time: cook_time || 0,
      total_time: total_time || 0,
      difficulty: difficulty || 'Medium',
      servings: servings || 2,
      meal_type: meal_type || 'Dinner',
      best_time: best_time || 'Evening',
      user_id: userId,
      source_recipe_id: null, // This is an original recipe
      image_url: image_url, // Add the image URL
      createdAt: new Date(),
      updatedAt: new Date()
    }, { transaction });

    // 4. Process ingredients (simple comma-separated for now)
    const ingredientsList = ingredients.split(',').map(item => item.trim()).filter(item => item);
    
    for (const ingredientName of ingredientsList) {
      // Find or create the ingredient
      const [ingredient] = await Ingredient.findOrCreate({
        where: { name: ingredientName },
        defaults: { 
          id: uuidv4(), 
          name: ingredientName,
          unit: 'unit', // Add default unit
          calories: 0    // Add default calories 
        },
        transaction
      });

      // Associate ingredient with recipe
      await RecipeIngredient.create({
        id: uuidv4(),
        recipe_id: recipeId,
        ingredient_id: ingredient.id,
        quantity: 1 // Default quantity
      }, { transaction });
    }

    // 5. Generate AI insight
    try {
      const ingredientsText = ingredientsList.join(', ');
      
      // Use our new AI service that has built-in fallbacks
      const insight = await aiService.generateRecipeInsight(
        title.trim(),
        description || '',
        ingredientsText,
        difficulty || 'Medium',
        meal_type || 'Dinner'
      );
      
      // Update recipe with the insight
      await Recipe.update(
        { ai_insight: insight },
        { 
          where: { id: recipeId },
          transaction
        }
      );
      
      // Add the insight to the newRecipe object
      newRecipe.ai_insight = insight;
    } catch (insightError) {
      console.error('Error generating recipe insight:', insightError);
      // Continue without insight if generation fails - our AI service should already handle fallbacks
    }

    // 6. Commit transaction
    await transaction.commit();

    // 7. Respond with the new recipe ID
    res.status(201).json({ 
      message: 'Recipe created successfully', 
      recipeId: recipeId 
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating recipe:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    res.status(500).json({ message: 'Server error creating recipe' });
  }
};

// Get user's own recipes
exports.getUserRecipes = async (req, res) => {
  try {
    const userId = req.user.id; // From verifyToken middleware
    
    const recipes = await Recipe.findAll({
      where: { user_id: userId },
      attributes: ['id', 'title', 'description', 'image_url', 'source_recipe_id', 'user_id', 'createdAt'],
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
    console.error('Error fetching user recipes:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};