const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./src/models');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const recipeRoutes = require('./src/routes/recipeRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API working!' });
});

// Start server
async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
  }
}

startServer();