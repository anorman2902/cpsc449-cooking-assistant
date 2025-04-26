const sequelize = require('../config/db');
const User = require('./User');
const Recipe = require('./Recipe');
const Ingredient = require('./Ingredient');
const RecipeIngredient = require('./RecipeIngredient');
const ShoppingList = require('./ShoppingList');
const UserFavorite = require('./UserFavorite');

// Define associations after loading models
const setupAssociations = () => {
    User.hasMany(Recipe, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    Recipe.belongsTo(User, { foreignKey: 'user_id' });

    // Recipe <-> Ingredient Relationship
    Recipe.belongsToMany(Ingredient, { through: RecipeIngredient, foreignKey: 'recipe_id', as: 'Ingredients' });
    Ingredient.belongsToMany(Recipe, { through: RecipeIngredient, foreignKey: 'ingredient_id' });

    // User <-> Recipe Favorite Relationship
    User.belongsToMany(Recipe, {
        through: UserFavorite,
        foreignKey: 'userId',
        otherKey: 'recipeId',
        as: 'FavoriteRecipes'
      });
      Recipe.belongsToMany(User, {
        through: UserFavorite,
        foreignKey: 'recipeId',
        otherKey: 'userId',
        as: 'FavoritedByUsers'
      });

    // Recipe self reference for copied/customized recipes
    Recipe.belongsTo(Recipe, { foreignKey: 'source_recipe_id', as: 'sourceRecipe' });
    Recipe.hasMany(Recipe, { foreignKey: 'source_recipe_id', as: 'copiedRecipes' });

    // Shopping List Relationships
    User.hasMany(ShoppingList, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    ShoppingList.belongsTo(User, { foreignKey: 'user_id' });

    Ingredient.hasMany(ShoppingList, { foreignKey: 'ingredient_id', onDelete: 'CASCADE' });
    ShoppingList.belongsTo(Ingredient, { foreignKey: 'ingredient_id' });
};

setupAssociations();

// Sync database
const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true }); // Or { force: false } in prod
        console.log("✅ Database synced successfully!");
    } catch (error) {
        console.error("❌ Error syncing database:", error);
    }
};

module.exports = { sequelize, User, Recipe, Ingredient, RecipeIngredient, ShoppingList, UserFavorite, syncDatabase };
