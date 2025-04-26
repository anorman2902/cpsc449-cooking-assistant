const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

// Protect all user routes - user must be logged in
router.use(verifyToken);

// Favorite routes
router.get('/me/favorites', userController.getFavorites); // GET current user's favorites
router.post('/me/favorites', userController.addFavorite); // POST add a favorite (body: {recipeId: "..."})
router.delete('/me/favorites/:recipeId', userController.removeFavorite); // DELETE remove a favorite by recipeId

// Profile routes
router.put('/me', userController.updateProfile);
router.get('/me', userController.getProfile);

module.exports = router;