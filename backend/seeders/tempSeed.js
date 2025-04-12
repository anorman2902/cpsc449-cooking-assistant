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
        { id: uuidv4(), name: 'Pancetta', unit: 'oz', calories: 150 },
        { id: uuidv4(), name: 'Parmesan Cheese', unit: 'oz', calories: 110 },
        { id: uuidv4(), name: 'Black Pepper', unit: 'tsp', calories: 5 },
        { id: uuidv4(), name: 'Salt', unit: 'tsp', calories: 0 }
      ];

      const createdIngredients = await Ingredient.bulkCreate(ingredients, { transaction });
      console.log(`✅ Created ${createdIngredients.length} ingredients`);

      // Map ingredient names to their ids for easy reference
      const ingredientMap = createdIngredients.reduce((map, ingredient) => {
        map[ingredient.name] = ingredient.id;
        return map;
      }, {});

      // Create single detailed recipe
      console.log('Creating recipe...');
      const recipes = [
        {
          id: 'e45a6b20-dc93-414a-b9a5-8a9b3f5dcfa1',
          title: 'Spaghetti Carbonara',
          description: 'A classic Italian pasta dish made with eggs, cheese, pancetta, and black pepper. This creamy, comforting dish is perfect for a quick dinner or special occasion.',
          steps: `1. Bring a large pot of salted water to boil
2. While water is heating, cut pancetta into small cubes
3. In a bowl, whisk together eggs, grated Parmesan, and black pepper
4. Cook pasta according to package instructions until al dente
5. Meanwhile, cook pancetta in a large pan until crispy
6. Drain pasta, reserving some pasta water
7. Working quickly, add hot pasta to the pan with pancetta
8. Remove from heat and add egg mixture, stirring constantly
9. Add pasta water as needed to create a creamy sauce
10. Serve immediately with extra Parmesan and black pepper`,
          prep_time: 15, // in minutes
          cook_time: 20, // in minutes
          total_time: 35, // in minutes
          difficulty: 'Medium',
          servings: 4,
          meal_type: 'Dinner',
          best_time: 'Evening',
          image_url: 'recipe-e45a6b20-dc93-414a-b9a5-8a9b3f5dcfa1.jpg',
          user_id: 'ab8f951e-bea9-40af-afcc-3e5484d526bb',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      const createdRecipes = await Recipe.bulkCreate(recipes, { transaction });
      console.log(`✅ Created ${createdRecipes.length} recipes`);

      // Create recipe-ingredient relationships
      console.log('Creating recipe-ingredient relationships...');
      
      const recipeIngredients = [
        {
          id: 'b290f8b9-2b7e-4f6b-aaf5-0c6dcdf4a2a5',
          recipe_id: 'e45a6b20-dc93-414a-b9a5-8a9b3f5dcfa1',
          ingredient_id: '89d0b31f-6404-4eb7-9531-937ee0c82d7a', // Egg
          quantity: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          recipe_id: 'e45a6b20-dc93-414a-b9a5-8a9b3f5dcfa1',
          ingredient_id: '4a9f5d80-2e44-4a87-8ff9-0e3832f5e689', // Pasta
          quantity: 16,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          recipe_id: 'e45a6b20-dc93-414a-b9a5-8a9b3f5dcfa1',
          ingredient_id: ingredientMap['Pancetta'],
          quantity: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          recipe_id: 'e45a6b20-dc93-414a-b9a5-8a9b3f5dcfa1',
          ingredient_id: ingredientMap['Parmesan Cheese'],
          quantity: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          recipe_id: 'e45a6b20-dc93-414a-b9a5-8a9b3f5dcfa1',
          ingredient_id: ingredientMap['Black Pepper'],
          quantity: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          recipe_id: 'e45a6b20-dc93-414a-b9a5-8a9b3f5dcfa1',
          ingredient_id: ingredientMap['Salt'],
          quantity: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

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