'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // ✅ Insert Users First
    await queryInterface.bulkInsert('Users', [
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
    ], {});

    // ✅ Insert Recipes AFTER Users
    await queryInterface.bulkInsert('Recipes', [
      {
        id: 'e45a6b20-dc93-414a-b9a5-8a9b3f5dcfa1',  // New valid UUID
        title: 'Spaghetti Carbonara',
        description: 'Classic Italian pasta with eggs, cheese, pancetta, and pepper.',
        steps: '1. Cook pasta. 2. Fry pancetta. 3. Mix with eggs and cheese. 4. Serve.',
        user_id: 'ab8f951e-bea9-40af-afcc-3e5484d526bb',  // ✅ Matches an existing User ID
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});

    // ✅ Insert Ingredients
    await queryInterface.bulkInsert('Ingredients', [
      {
        id: '89d0b31f-6404-4eb7-9531-937ee0c82d7a', // New valid UUID
        name: 'Egg',
        unit: 'pcs',
        calories: 70,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4a9f5d80-2e44-4a87-8ff9-0e3832f5e689', // New valid UUID
        name: 'Pasta',
        unit: 'grams',
        calories: 200,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});

    // ✅ Insert Recipe-Ingredients Relationship (Ensure IDs exist)
    await queryInterface.bulkInsert('RecipeIngredients', [
      {
        id: 'b290f8b9-2b7e-4f6b-aaf5-0c6dcdf4a2a5', // New valid UUID
        recipe_id: 'e45a6b20-dc93-414a-b9a5-8a9b3f5dcfa1',  // ✅ Matches Recipe ID
        ingredient_id: '89d0b31f-6404-4eb7-9531-937ee0c82d7a', // ✅ Matches Ingredient ID (Egg)
        quantity: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});

    // ✅ Insert Shopping List (Ensure IDs exist)
    await queryInterface.bulkInsert('ShoppingLists', [
      {
        id: 'a4f9d6b8-91fc-4b2c-a02a-7f92b15368b1', // New valid UUID
        user_id: 'ab8f951e-bea9-40af-afcc-3e5484d526bb',  // ✅ Matches User ID
        ingredient_id: '4a9f5d80-2e44-4a87-8ff9-0e3832f5e689', // ✅ Matches Ingredient ID (Pasta)
        quantity: 500,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('ShoppingLists', null, {});
    await queryInterface.bulkDelete('RecipeIngredients', null, {});
    await queryInterface.bulkDelete('Ingredients', null, {});
    await queryInterface.bulkDelete('Recipes', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
