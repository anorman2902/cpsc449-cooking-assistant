const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware'); // Import auth middleware

// Protect all user routes - user must be logged in
router.use(verifyToken);

// Favorite routes
router.get('/me/favorites', userController.getFavorites); // GET current user's favorites
router.post('/me/favorites', userController.addFavorite); // POST add a favorite (body: {recipeId: "..."})
router.delete('/me/favorites/:recipeId', userController.removeFavorite); // DELETE remove a favorite by recipeId

// --- Add profile routes later in Phase 2 ---
// router.put('/me', userController.updateProfile);
// router.get('/me', userController.getProfile);

module.exports = router;