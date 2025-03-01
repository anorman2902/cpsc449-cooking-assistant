const sequelize = require('../config/db');
const User = require('./User');
const Recipe = require('./Recipe');
const Ingredient = require('./Ingredient');
const RecipeIngredient = require('./RecipeIngredient');
const ShoppingList = require('./ShoppingList');

// ✅ Define associations after loading models
const setupAssociations = () => {
    User.hasMany(Recipe, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    Recipe.belongsTo(User, { foreignKey: 'user_id' });

    Recipe.belongsToMany(Ingredient, { through: RecipeIngredient, foreignKey: 'recipe_id' });
    Ingredient.belongsToMany(Recipe, { through: RecipeIngredient, foreignKey: 'ingredient_id' });

    User.hasMany(ShoppingList, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    ShoppingList.belongsTo(User, { foreignKey: 'user_id' });

    Ingredient.hasMany(ShoppingList, { foreignKey: 'ingredient_id', onDelete: 'CASCADE' });
    ShoppingList.belongsTo(Ingredient, { foreignKey: 'ingredient_id' });
};

// ✅ Sync database
const syncDatabase = async () => {
    setupAssociations(); // Ensure relationships are set first
    await sequelize.sync({ alter: true }); // Use `force: true` for a fresh start
    console.log("✅ Database synced successfully!");
};

module.exports = { sequelize, User, Recipe, Ingredient, RecipeIngredient, ShoppingList, syncDatabase };
