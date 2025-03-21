const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { User } = require('../models');

// Environment variable for JWT secret, fallback to a default for development
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// User registration
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      id: uuidv4(),
      username,
      email,
      password: hashedPassword
    });

    // Generate JWT token
    const token = generateToken(newUser);

    // Return user data and token (exclude password)
    const userData = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email
    };

    res.status(201).json({
      message: 'User registered successfully',
      user: userData,
      token
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Return user data and token (exclude password)
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email
    };

    res.status(200).json({
      message: 'Login successful',
      user: userData,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Verify token
exports.verifyToken = async (req, res) => {
  try {
    const { id } = req.user; // Assuming req.user is set by auth middleware

    // Find user by id
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data (exclude password)
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email
    };

    res.status(200).json({
      user: userData
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'Server error during token verification' });
  }
};