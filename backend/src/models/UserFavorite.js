const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserFavorite = sequelize.define('UserFavorite', {
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    references: { model: 'Users', key: 'id' }
  },
  recipeId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    references: { model: 'Recipes', key: 'id' }
  },
}, { timestamps: true });

module.exports = UserFavorite;