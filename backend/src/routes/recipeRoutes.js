const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const { verifyToken } = require('../middleware/authMiddleware');

// GET all recipes
router.get('/', recipeController.getAllRecipes);

// GET search recipes by query (name or ingredient)
router.get('/search/:query', recipeController.searchRecipes);

// GET recipe by ID
router.get('/:id', recipeController.getRecipeById);

// Protected routes (require login)
router.post('/:id/copy', verifyToken, recipeController.copyRecipe); // POST copy a recipe
router.put('/:id', verifyToken, recipeController.updateRecipe);     // PUT update a recipe owned by user
router.delete('/:id', verifyToken, recipeController.deleteRecipe); // DELETE a recipe owned by user

module.exports = router; 