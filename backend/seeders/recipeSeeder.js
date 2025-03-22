const { v4: uuidv4 } = require('uuid');
const { Recipe, Ingredient, RecipeIngredient, sequelize } = require('../src/models');

async function seedData() {
  try {
    // Start transaction
    const transaction = await sequelize.transaction();

    try {
      console.log('🌱 Starting seed process...');

      // Create ingredients
      console.log('Creating ingredients...');
      const ingredients = [
        { id: uuidv4(), name: 'Chicken', unit: 'lb', calories: 200 },
        { id: uuidv4(), name: 'Rice', unit: 'cup', calories: 150 },
        { id: uuidv4(), name: 'Tomato', unit: 'whole', calories: 30 },
        { id: uuidv4(), name: 'Onion', unit: 'whole', calories: 40 },
        { id: uuidv4(), name: 'Garlic', unit: 'clove', calories: 5 },
        { id: uuidv4(), name: 'Bell Pepper', unit: 'whole', calories: 25 },
        { id: uuidv4(), name: 'Pasta', unit: 'oz', calories: 200 },
        { id: uuidv4(), name: 'Ground Beef', unit: 'lb', calories: 250 },
        { id: uuidv4(), name: 'Cheese', unit: 'oz', calories: 100 },
        { id: uuidv4(), name: 'Egg', unit: 'whole', calories: 70 },
        { id: uuidv4(), name: 'Bread', unit: 'slice', calories: 80 },
        { id: uuidv4(), name: 'Lettuce', unit: 'cup', calories: 15 },
      ];

      const createdIngredients = await Ingredient.bulkCreate(ingredients, { transaction });
      console.log(`✅ Created ${createdIngredients.length} ingredients`);

      // Create recipes
      console.log('Creating recipes...');
      const recipes = [
        {
          id: uuidv4(),
          title: 'Classic Spaghetti',
          description: 'A simple, delicious pasta dish',
          steps: 'Cook pasta. Make sauce. Combine.',
          user_id: null
        },
        {
          id: uuidv4(),
          title: 'Chicken Rice Bowl',
          description: 'Healthy and filling rice bowl with chicken',
          steps: 'Cook rice. Cook chicken. Combine with veggies.',
          user_id: null
        },
        {
          id: uuidv4(),
          title: 'Beef Tacos',
          description: 'Spicy, flavorful beef tacos',
          steps: 'Cook beef with spices. Warm tortillas. Assemble tacos.',
          user_id: null
        },
        {
          id: uuidv4(),
          title: 'Veggie Omelette',
          description: 'Quick and easy breakfast',
          steps: 'Beat eggs. Cook vegetables. Add eggs and cook.',
          user_id: null
        },
        {
          id: uuidv4(),
          title: 'Grilled Cheese Sandwich',
          description: 'Classic comfort food',
          steps: 'Butter bread. Add cheese. Grill until golden.',
          user_id: null
        },
        {
          id: uuidv4(),
          title: 'Chicken Stir Fry',
          description: 'Quick and healthy stir fry',
          steps: 'Cook chicken. Add vegetables. Stir fry together.',
          user_id: null
        }
      ];

      const createdRecipes = await Recipe.bulkCreate(recipes, { transaction });
      console.log(`✅ Created ${createdRecipes.length} recipes`);

      // Create recipe-ingredient relationships
      console.log('Creating recipe-ingredient relationships...');
      
      // Map ingredient names to their ids for easy reference
      const ingredientMap = createdIngredients.reduce((map, ingredient) => {
        map[ingredient.name] = ingredient.id;
        return map;
      }, {});

      // Set up recipe ingredients
      const recipeIngredients = [
        // Classic Spaghetti
        {
          id: uuidv4(),
          recipe_id: createdRecipes[0].id,
          ingredient_id: ingredientMap['Pasta'],
          quantity: 8
        },
        {
          id: uuidv4(),
          recipe_id: createdRecipes[0].id,
          ingredient_id: ingredientMap['Tomato'],
          quantity: 3
        },
        {
          id: uuidv4(),
          recipe_id: createdRecipes[0].id,
          ingredient_id: ingredientMap['Garlic'],
          quantity: 2
        },
        {
          id: uuidv4(),
          recipe_id: createdRecipes[0].id,
          ingredient_id: ingredientMap['Onion'],
          quantity: 1
        },
        
        // Chicken Rice Bowl
        {
          id: uuidv4(),
          recipe_id: createdRecipes[1].id,
          ingredient_id: ingredientMap['Chicken'],
          quantity: 1
        },
        {
          id: uuidv4(),
          recipe_id: createdRecipes[1].id,
          ingredient_id: ingredientMap['Rice'],
          quantity: 2
        },
        {
          id: uuidv4(),
          recipe_id: createdRecipes[1].id,
          ingredient_id: ingredientMap['Bell Pepper'],
          quantity: 1
        },
        
        // Beef Tacos
        {
          id: uuidv4(),
          recipe_id: createdRecipes[2].id,
          ingredient_id: ingredientMap['Ground Beef'],
          quantity: 1
        },
        {
          id: uuidv4(),
          recipe_id: createdRecipes[2].id,
          ingredient_id: ingredientMap['Tomato'],
          quantity: 2
        },
        {
          id: uuidv4(),
          recipe_id: createdRecipes[2].id,
          ingredient_id: ingredientMap['Lettuce'],
          quantity: 1
        },
        {
          id: uuidv4(),
          recipe_id: createdRecipes[2].id,
          ingredient_id: ingredientMap['Cheese'],
          quantity: 4
        },
        
        // Veggie Omelette
        {
          id: uuidv4(),
          recipe_id: createdRecipes[3].id,
          ingredient_id: ingredientMap['Egg'],
          quantity: 3
        },
        {
          id: uuidv4(),
          recipe_id: createdRecipes[3].id,
          ingredient_id: ingredientMap['Bell Pepper'],
          quantity: 0.5
        },
        {
          id: uuidv4(),
          recipe_id: createdRecipes[3].id,
          ingredient_id: ingredientMap['Onion'],
          quantity: 0.5
        },
        {
          id: uuidv4(),
          recipe_id: createdRecipes[3].id,
          ingredient_id: ingredientMap['Cheese'],
          quantity: 2
        },
        
        // Grilled Cheese Sandwich
        {
          id: uuidv4(),
          recipe_id: createdRecipes[4].id,
          ingredient_id: ingredientMap['Bread'],
          quantity: 2
        },
        {
          id: uuidv4(),
          recipe_id: createdRecipes[4].id,
          ingredient_id: ingredientMap['Cheese'],
          quantity: 2
        },
        
        // Chicken Stir Fry
        {
          id: uuidv4(),
          recipe_id: createdRecipes[5].id,
          ingredient_id: ingredientMap['Chicken'],
          quantity: 1
        },
        {
          id: uuidv4(),
          recipe_id: createdRecipes[5].id,
          ingredient_id: ingredientMap['Bell Pepper'],
          quantity: 1
        },
        {
          id: uuidv4(),
          recipe_id: createdRecipes[5].id,
          ingredient_id: ingredientMap['Onion'],
          quantity: 1
        },
        {
          id: uuidv4(),
          recipe_id: createdRecipes[5].id,
          ingredient_id: ingredientMap['Garlic'],
          quantity: 2
        }
      ];

      await RecipeIngredient.bulkCreate(recipeIngredients, { transaction });
      console.log(`✅ Created ${recipeIngredients.length} recipe-ingredient relationships`);

      // Commit transaction
      await transaction.commit();
      console.log('✅ Seed data created successfully!');
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('❌ Error seeding data:', error);
    }
  } catch (error) {
    console.error('❌ Transaction error:', error);
  } finally {
    process.exit();
  }
}

// Run seeder
seedData(); 