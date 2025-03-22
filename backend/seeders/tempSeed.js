'use strict';
const { v4: uuidv4 } = require('uuid');
const { Recipe, Ingredient, RecipeIngredient, User, ShoppingList, sequelize } = require('../src/models');

async function seedData() {
  try {
    // Start transaction
    const transaction = await sequelize.transaction();

    try {
      console.log('🌱 Starting enhanced seed process...');

      // Create users
      console.log('Creating users...');
      const users = [
        {
          id: 'ab8f951e-bea9-40af-afcc-3e5484d526bb',
          username: 'testuser1',
          email: 'test1@example.com',
          password: 'securepassword1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'bc3097aa-c5ae-4157-a7b6-bb6cb95aa997',
          username: 'testuser2',
          email: 'test2@example.com',
          password: 'securepassword2',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      const createdUsers = await User.bulkCreate(users, { transaction });
      console.log(`✅ Created ${createdUsers.length} users`);

      // Create ingredients with fixed IDs for reference
      console.log('Creating ingredients...');
      const ingredients = [
        { id: '89d0b31f-6404-4eb7-9531-937ee0c82d7a', name: 'Egg', unit: 'whole', calories: 70 },
        { id: '4a9f5d80-2e44-4a87-8ff9-0e3832f5e689', name: 'Pasta', unit: 'oz', calories: 200 },
        { id: uuidv4(), name: 'Chicken', unit: 'lb', calories: 200 },
        { id: uuidv4(), name: 'Rice', unit: 'cup', calories: 150 },
        { id: uuidv4(), name: 'Tomato', unit: 'whole', calories: 30 },
        { id: uuidv4(), name: 'Onion', unit: 'whole', calories: 40 },
        { id: uuidv4(), name: 'Garlic', unit: 'clove', calories: 5 },
        { id: uuidv4(), name: 'Bell Pepper', unit: 'whole', calories: 25 },
        { id: uuidv4(), name: 'Ground Beef', unit: 'lb', calories: 250 },
        { id: uuidv4(), name: 'Cheese', unit: 'oz', calories: 100 },
        { id: uuidv4(), name: 'Bread', unit: 'slice', calories: 80 },
        { id: uuidv4(), name: 'Lettuce', unit: 'cup', calories: 15 },
      ];

      const createdIngredients = await Ingredient.bulkCreate(ingredients, { transaction });
      console.log(`✅ Created ${createdIngredients.length} ingredients`);

      // Map ingredient names to their ids for easy reference
      const ingredientMap = createdIngredients.reduce((map, ingredient) => {
        map[ingredient.name] = ingredient.id;
        return map;
      }, {});

      // Create recipes
      console.log('Creating recipes...');
      const recipes = [
        {
          id: 'e45a6b20-dc93-414a-b9a5-8a9b3f5dcfa1',
          title: 'Spaghetti Carbonara',
          description: 'Classic Italian pasta with eggs, cheese, pancetta, and pepper.',
          steps: '1. Cook pasta. 2. Fry pancetta. 3. Mix with eggs and cheese. 4. Serve.',
          user_id: 'ab8f951e-bea9-40af-afcc-3e5484d526bb',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          title: 'Classic Spaghetti',
          description: 'A simple, delicious pasta dish',
          steps: 'Cook pasta. Make sauce. Combine.',
          user_id: 'ab8f951e-bea9-40af-afcc-3e5484d526bb',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          title: 'Chicken Rice Bowl',
          description: 'Healthy and filling rice bowl with chicken',
          steps: 'Cook rice. Cook chicken. Combine with veggies.',
          user_id: 'bc3097aa-c5ae-4157-a7b6-bb6cb95aa997',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          title: 'Beef Tacos',
          description: 'Spicy, flavorful beef tacos',
          steps: 'Cook beef with spices. Warm tortillas. Assemble tacos.',
          user_id: 'ab8f951e-bea9-40af-afcc-3e5484d526bb',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      const createdRecipes = await Recipe.bulkCreate(recipes, { transaction });
      console.log(`✅ Created ${createdRecipes.length} recipes`);

      // Create recipe-ingredient relationships
      console.log('Creating recipe-ingredient relationships...');
      
      const recipeIngredients = [];
      
      // Add fixed relationship for Spaghetti Carbonara
      recipeIngredients.push({
        id: 'b290f8b9-2b7e-4f6b-aaf5-0c6dcdf4a2a5',
        recipe_id: 'e45a6b20-dc93-414a-b9a5-8a9b3f5dcfa1',
        ingredient_id: '89d0b31f-6404-4eb7-9531-937ee0c82d7a', // Egg
        quantity: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      recipeIngredients.push({
        id: uuidv4(),
        recipe_id: 'e45a6b20-dc93-414a-b9a5-8a9b3f5dcfa1',
        ingredient_id: '4a9f5d80-2e44-4a87-8ff9-0e3832f5e689', // Pasta
        quantity: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      // Add relationships for Classic Spaghetti
      recipeIngredients.push({
        id: uuidv4(),
        recipe_id: createdRecipes[1].id,
        ingredient_id: ingredientMap['Pasta'],
        quantity: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      recipeIngredients.push({
        id: uuidv4(),
        recipe_id: createdRecipes[1].id,
        ingredient_id: ingredientMap['Tomato'],
        quantity: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      // Add relationships for Chicken Rice Bowl
      recipeIngredients.push({
        id: uuidv4(),
        recipe_id: createdRecipes[2].id,
        ingredient_id: ingredientMap['Chicken'],
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      recipeIngredients.push({
        id: uuidv4(),
        recipe_id: createdRecipes[2].id,
        ingredient_id: ingredientMap['Rice'],
        quantity: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Add relationships for Beef Tacos
      recipeIngredients.push({
        id: uuidv4(),
        recipe_id: createdRecipes[3].id,
        ingredient_id: ingredientMap['Ground Beef'],
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      recipeIngredients.push({
        id: uuidv4(),
        recipe_id: createdRecipes[3].id,
        ingredient_id: ingredientMap['Cheese'],
        quantity: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await RecipeIngredient.bulkCreate(recipeIngredients, { transaction });
      console.log(`✅ Created ${recipeIngredients.length} recipe-ingredient relationships`);

      // Add shopping list items
      console.log('Creating shopping list items...');
      const shoppingLists = [
        {
          id: 'a4f9d6b8-91fc-4b2c-a02a-7f92b15368b1',
          user_id: 'ab8f951e-bea9-40af-afcc-3e5484d526bb',
          ingredient_id: '4a9f5d80-2e44-4a87-8ff9-0e3832f5e689', // Pasta
          quantity: 500,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      await ShoppingList.bulkCreate(shoppingLists, { transaction });
      console.log(`✅ Created ${shoppingLists.length} shopping list items`);

      // Commit transaction
      await transaction.commit();
      console.log('✅ Seed data created successfully!');
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('❌ Error seeding data:', error);
      console.error(error.stack);
    }
  } catch (error) {
    console.error('❌ Transaction error:', error);
    console.error(error.stack);
  } finally {
    process.exit();
  }
}

// Run seeder
seedData(); 