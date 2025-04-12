const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// GET all recipes
router.get('/', recipeController.getAllRecipes);

// GET search recipes by query (name or ingredient)
router.get('/search/:query', recipeController.searchRecipes);

// GET recipe by ID
router.get('/:id', recipeController.getRecipeById);

module.exports = router; 