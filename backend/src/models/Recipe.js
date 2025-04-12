const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

/**
 * Recipe Model
 * 
 * Represents a cooking recipe with ingredients, steps, and metadata.
 * For detailed image handling documentation, see: /docs/image-handling.md
 */
const Recipe = sequelize.define('Recipe', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    steps: { type: DataTypes.TEXT, allowNull: false },
    prep_time: { type: DataTypes.INTEGER, allowNull: false }, // in minutes
    cook_time: { type: DataTypes.INTEGER, allowNull: false }, // in minutes
    total_time: { type: DataTypes.INTEGER, allowNull: false }, // in minutes
    difficulty: { type: DataTypes.ENUM('Easy', 'Medium', 'Hard'), allowNull: false },
    servings: { type: DataTypes.INTEGER, allowNull: false },
    meal_type: { type: DataTypes.ENUM('Breakfast', 'Lunch', 'Dinner', 'Snack'), allowNull: false },
    best_time: { type: DataTypes.ENUM('Morning', 'Afternoon', 'Evening'), allowNull: false },
    image_url: { type: DataTypes.STRING, allowNull: true } // Filename only, not full path
}, { timestamps: true });

// ✅ Import User after defining Recipe
const User = require('./User');

// ✅ Set up association after importing User
User.hasMany(Recipe, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Recipe.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Recipe;
