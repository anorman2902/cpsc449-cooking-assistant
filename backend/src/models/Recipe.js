const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

/**
 * Recipe Model
 * 
 * Represents a cooking recipe with ingredients, steps, and metadata.
 * For detailed image handling documentation, see: /docs/image-handling.md
 */

const User = require('./User');
const UserFavorite = require('./UserFavorite'); // junction

const Recipe = sequelize.define('Recipe', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    steps: { type: DataTypes.TEXT, allowNull: false },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Users', key: 'id' }
    },
    prep_time: { type: DataTypes.INTEGER, allowNull: false }, // in minutes
    cook_time: { type: DataTypes.INTEGER, allowNull: false }, // in minutes
    total_time: { type: DataTypes.INTEGER, allowNull: false }, // in minutes
    difficulty: { type: DataTypes.ENUM('Easy', 'Medium', 'Hard'), allowNull: false },
    servings: { type: DataTypes.INTEGER, allowNull: false },
    meal_type: { type: DataTypes.ENUM('Breakfast', 'Lunch', 'Dinner', 'Snack'), allowNull: false },
    best_time: { type: DataTypes.ENUM('Morning', 'Afternoon', 'Evening'), allowNull: false },
    image_url: { type: DataTypes.STRING, allowNull: true } // Filename only, not full path
}, { timestamps: true });


module.exports = Recipe;
