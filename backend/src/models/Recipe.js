const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Recipe = sequelize.define('Recipe', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    steps: { type: DataTypes.TEXT, allowNull: false }
}, { timestamps: true });

// ✅ Import User after defining Recipe
const User = require('./User');

// ✅ Set up association after importing User
User.hasMany(Recipe, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Recipe.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Recipe;
