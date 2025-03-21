const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Registration route
router.post('/signup', authController.signup);

// Login route
router.post('/login', authController.login);

// Token verification route
router.get('/verify', verifyToken, authController.verifyToken);

module.exports = router;