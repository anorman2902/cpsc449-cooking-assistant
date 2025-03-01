const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Ingredient = require('./Ingredient');

const ShoppingList = sequelize.define('ShoppingList', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' } },
    ingredient_id: { type: DataTypes.UUID, allowNull: false, references: { model: Ingredient, key: 'id' } },
    quantity: { type: DataTypes.FLOAT, allowNull: false }
}, { timestamps: true });

// One User can have many items in their Shopping List
User.hasMany(ShoppingList, { foreignKey: 'user_id', onDelete: 'CASCADE' });
ShoppingList.belongsTo(User, { foreignKey: 'user_id' });

// One Ingredient can appear in many Users' Shopping Lists
Ingredient.hasMany(ShoppingList, { foreignKey: 'ingredient_id', onDelete: 'CASCADE' });
ShoppingList.belongsTo(Ingredient, { foreignKey: 'ingredient_id' });

module.exports = ShoppingList;
