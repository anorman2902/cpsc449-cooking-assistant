'use strict';
const { v4: uuidv4 } = require('uuid');
const { Recipe, Ingredient, RecipeIngredient, User, ShoppingList, sequelize } = require('../src/models');

async function seedData() {
  try {
    // Start transaction
    const transaction = await sequelize.transaction();

    try {
      console.log('🌱 Starting enhanced seed process...');

      // Check if users exist
      const user1 = await User.findByPk('ab8f951e-bea9-40af-afcc-3e5484d526bb', { transaction });
      const user2 = await User.findByPk('bc3097aa-c5ae-4157-a7b6-bb6cb95aa997', { transaction });

      // Create users only if they don't exist
      if (!user1 || !user2) {
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
        
        const usersToCreate = [];
        if (!user1) usersToCreate.push(users[0]);
        if (!user2) usersToCreate.push(users[1]);
        
        if (usersToCreate.length > 0) {
          const createdUsers = await User.bulkCreate(usersToCreate, { transaction });
          console.log(`✅ Created ${createdUsers.length} users`);
        } else {
          console.log('✅ All users already exist');
        }
      } else {
        console.log('✅ All users already exist');
      }

      // Check if ingredients exist and create any new ones
      console.log('Checking ingredients...');
      const ingredientNames = [
        'Egg', 'Pasta', 'Pancetta', 'Parmesan Cheese', 'Black Pepper', 'Salt',
        'Bread', 'Milk', 'Vanilla Extract', 'Cinnamon', 'Butter',
        'Chicken Breast', 'Bell Pepper', 'Broccoli', 'Soy Sauce', 'Garlic',
        'Brown Sugar', 'Flour', 'Chocolate Chips', 'Baking Soda',
        'Romaine Lettuce', 'Croutons', 'Lemon Juice', 'Dijon Mustard', 'Olive Oil'
      ];
      
      // Fetch existing ingredients
      const existingIngredients = await Ingredient.findAll({
        where: {
          name: ingredientNames
        },
        transaction
      });
      
      const existingIngredientNames = existingIngredients.map(ing => ing.name);
      const newIngredientData = [
        // We'll add any new ingredients that don't exist
        ...(!existingIngredientNames.includes('Bread') ? [{ id: uuidv4(), name: 'Bread', unit: 'slice', calories: 80 }] : []),
        ...(!existingIngredientNames.includes('Milk') ? [{ id: uuidv4(), name: 'Milk', unit: 'cup', calories: 120 }] : []),
        ...(!existingIngredientNames.includes('Vanilla Extract') ? [{ id: uuidv4(), name: 'Vanilla Extract', unit: 'tsp', calories: 12 }] : []),
        ...(!existingIngredientNames.includes('Cinnamon') ? [{ id: uuidv4(), name: 'Cinnamon', unit: 'tsp', calories: 6 }] : []),
        ...(!existingIngredientNames.includes('Butter') ? [{ id: uuidv4(), name: 'Butter', unit: 'tbsp', calories: 100 }] : []),
        // New recipe ingredients
        ...(!existingIngredientNames.includes('Chicken Breast') ? [{ id: uuidv4(), name: 'Chicken Breast', unit: 'oz', calories: 165 }] : []),
        ...(!existingIngredientNames.includes('Bell Pepper') ? [{ id: uuidv4(), name: 'Bell Pepper', unit: 'whole', calories: 30 }] : []),
        ...(!existingIngredientNames.includes('Broccoli') ? [{ id: uuidv4(), name: 'Broccoli', unit: 'cup', calories: 55 }] : []),
        ...(!existingIngredientNames.includes('Soy Sauce') ? [{ id: uuidv4(), name: 'Soy Sauce', unit: 'tbsp', calories: 10 }] : []),
        ...(!existingIngredientNames.includes('Garlic') ? [{ id: uuidv4(), name: 'Garlic', unit: 'clove', calories: 4 }] : []),
        ...(!existingIngredientNames.includes('Brown Sugar') ? [{ id: uuidv4(), name: 'Brown Sugar', unit: 'cup', calories: 550 }] : []),
        ...(!existingIngredientNames.includes('Flour') ? [{ id: uuidv4(), name: 'Flour', unit: 'cup', calories: 455 }] : []),
        ...(!existingIngredientNames.includes('Chocolate Chips') ? [{ id: uuidv4(), name: 'Chocolate Chips', unit: 'cup', calories: 800 }] : []),
        ...(!existingIngredientNames.includes('Baking Soda') ? [{ id: uuidv4(), name: 'Baking Soda', unit: 'tsp', calories: 0 }] : []),
        ...(!existingIngredientNames.includes('Romaine Lettuce') ? [{ id: uuidv4(), name: 'Romaine Lettuce', unit: 'cup', calories: 8 }] : []),
        ...(!existingIngredientNames.includes('Croutons') ? [{ id: uuidv4(), name: 'Croutons', unit: 'cup', calories: 122 }] : []),
        ...(!existingIngredientNames.includes('Lemon Juice') ? [{ id: uuidv4(), name: 'Lemon Juice', unit: 'tbsp', calories: 4 }] : []),
        ...(!existingIngredientNames.includes('Dijon Mustard') ? [{ id: uuidv4(), name: 'Dijon Mustard', unit: 'tsp', calories: 5 }] : []),
        ...(!existingIngredientNames.includes('Olive Oil') ? [{ id: uuidv4(), name: 'Olive Oil', unit: 'tbsp', calories: 120 }] : [])
      ];
      
      let createdIngredients = [];
      if (newIngredientData.length > 0) {
        createdIngredients = await Ingredient.bulkCreate(newIngredientData, { transaction });
        console.log(`✅ Created ${createdIngredients.length} new ingredients`);
      } else {
        console.log('✅ All required ingredients already exist');
      }
      
      // Get all ingredients to build ingredient map
      const allIngredients = await Ingredient.findAll({ transaction });
      
      // Map ingredient names to their ids for easy reference
      const ingredientMap = allIngredients.reduce((map, ingredient) => {
        map[ingredient.name] = ingredient.id;
        return map;
      }, {});

      // Check if French Toast recipe already exists
      const frenchToastRecipeId = 'f67b4c31-ef54-425a-8cbc-9ab12d8f4b02';
      const existingFrenchToast = await Recipe.findByPk(frenchToastRecipeId, { transaction });
      
      // Check if Chicken Stir Fry recipe exists
      const chickenStirFryId = 'a2b4c6d8-e0f2-4681-9a3c-5b7d8e9f1234';
      const existingChickenStirFry = await Recipe.findByPk(chickenStirFryId, { transaction });
      
      // Check if Chocolate Chip Cookies recipe exists
      const chocolateChipCookiesId = 'b3c5d7e9-f1a3-5792-0b4d-6e8f0a1b2c3d';
      const existingChocolateChipCookies = await Recipe.findByPk(chocolateChipCookiesId, { transaction });
      
      // Check if Caesar Salad recipe exists
      const caesarSaladId = 'c4d6e8f0-a2b4-6803-1c5d-7e9f0a1b2c3d';
      const existingCaesarSalad = await Recipe.findByPk(caesarSaladId, { transaction });
      
      if (!existingFrenchToast) {
        console.log('Creating French Toast recipe...');
        // Only create the French Toast recipe
        const frenchToastRecipe = {
          id: frenchToastRecipeId,
          title: 'French Toast',
          description: 'A delicious breakfast classic made with bread soaked in an egg mixture and fried to golden perfection. Serve with maple syrup, fresh fruit, or powdered sugar for a sweet morning treat.',
          steps: `1. In a wide, shallow bowl, whisk together eggs, milk, vanilla extract, and cinnamon
2. Heat butter in a large skillet or griddle over medium heat
3. Dip each slice of bread into the egg mixture, allowing it to soak for about 30 seconds on each side
4. Place soaked bread slices onto the hot skillet
5. Cook until golden brown, about 3 minutes on each side
6. Transfer to a plate and serve immediately with maple syrup or toppings of your choice`,
          prep_time: 5, // in minutes
          cook_time: 10, // in minutes
          total_time: 15, // in minutes
          difficulty: 'Easy',
          servings: 2,
          meal_type: 'Breakfast',
          best_time: 'Morning',
          image_url: 'recipe-f67b4c31-ef54-425a-8cbc-9ab12d8f4b02.jpg',
          user_id: 'ab8f951e-bea9-40af-afcc-3e5484d526bb',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await Recipe.create(frenchToastRecipe, { transaction });
        console.log('✅ Created French Toast recipe');
        
        // Create recipe-ingredient relationships for French Toast
        console.log('Creating recipe-ingredient relationships for French Toast...');
        
        const frenchToastIngredients = [
          {
            id: uuidv4(),
            recipe_id: frenchToastRecipeId,
            ingredient_id: ingredientMap['Egg'],
            quantity: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            recipe_id: frenchToastRecipeId,
            ingredient_id: ingredientMap['Salt'],
            quantity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            recipe_id: frenchToastRecipeId,
            ingredient_id: ingredientMap['Bread'],
            quantity: 6,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            recipe_id: frenchToastRecipeId,
            ingredient_id: ingredientMap['Milk'],
            quantity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            recipe_id: frenchToastRecipeId,
            ingredient_id: ingredientMap['Vanilla Extract'],
            quantity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            recipe_id: frenchToastRecipeId,
            ingredient_id: ingredientMap['Cinnamon'],
            quantity: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            recipe_id: frenchToastRecipeId,
            ingredient_id: ingredientMap['Butter'],
            quantity: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ];

        await RecipeIngredient.bulkCreate(frenchToastIngredients, { transaction });
        console.log(`✅ Created recipe-ingredient relationships for French Toast`);
      } else {
        console.log('✅ French Toast recipe already exists');
      }

      // Create Chicken Stir Fry recipe if it doesn't exist
      if (!existingChickenStirFry) {
        console.log('Creating Chicken Stir Fry recipe...');
        
        const chickenStirFryRecipe = {
          id: chickenStirFryId,
          title: 'Chicken Stir Fry',
          description: 'A quick and healthy dinner option featuring tender chicken pieces and colorful vegetables in a savory sauce. Perfect for busy weeknights when you need a nutritious meal in minutes.',
          steps: `1. Slice chicken breast into thin strips
2. Chop bell peppers and broccoli into bite-sized pieces
3. Heat oil in a large wok or skillet over medium-high heat
4. Add chicken and cook until no longer pink, about 5-6 minutes
5. Remove chicken and set aside
6. Add vegetables to the same pan and stir-fry for 3-4 minutes until crisp-tender
7. Return chicken to the pan
8. In a small bowl, whisk together soy sauce, garlic, and brown sugar
9. Pour sauce over the chicken and vegetables
10. Stir-fry for another 2 minutes until everything is well coated and heated through`,
          prep_time: 10, // in minutes
          cook_time: 15, // in minutes
          total_time: 25, // in minutes
          difficulty: 'Easy',
          servings: 4,
          meal_type: 'Dinner',
          best_time: 'Evening',
          image_url: 'recipe-a2b4c6d8-e0f2-4681-9a3c-5b7d8e9f1234.jpg',
          user_id: 'ab8f951e-bea9-40af-afcc-3e5484d526bb',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await Recipe.create(chickenStirFryRecipe, { transaction });
        console.log('✅ Created Chicken Stir Fry recipe');
        
        // Create recipe-ingredient relationships for Chicken Stir Fry
        console.log('Creating recipe-ingredient relationships for Chicken Stir Fry...');
        
        const chickenStirFryIngredients = [
          {
            id: uuidv4(),
            recipe_id: chickenStirFryId,
            ingredient_id: ingredientMap['Chicken Breast'],
            quantity: 16,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            recipe_id: chickenStirFryId,
            ingredient_id: ingredientMap['Bell Pepper'],
            quantity: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            recipe_id: chickenStirFryId,
            ingredient_id: ingredientMap['Broccoli'],
            quantity: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            recipe_id: chickenStirFryId,
            ingredient_id: ingredientMap['Soy Sauce'],
            quantity: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            recipe_id: chickenStirFryId,
            ingredient_id: ingredientMap['Garlic'],
            quantity: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            recipe_id: chickenStirFryId,
            ingredient_id: ingredientMap['Brown Sugar'],
            quantity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            recipe_id: chickenStirFryId,
            ingredient_id: ingredientMap['Olive Oil'],
            quantity: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ];

        await RecipeIngredient.bulkCreate(chickenStirFryIngredients, { transaction });
        console.log(`✅ Created recipe-ingredient relationships for Chicken Stir Fry`);
      } else {
        console.log('✅ Chicken Stir Fry recipe already exists');
      }
      
      // Create Chocolate Chip Cookies recipe if it doesn't exist
      if (!existingChocolateChipCookies) {
        console.log('Creating Chocolate Chip Cookies recipe...');
        
        const chocolateChipCookiesRecipe = {
          id: chocolateChipCookiesId,
          title: 'Chocolate Chip Cookies',
          description: 'Classic chocolate chip cookies with a soft, chewy center and crisp edges. These homemade cookies are packed with chocolate chips for the perfect sweet treat any time of day.',
          steps: `1. Preheat oven to 375°F (190°C)
2. In a large bowl, cream together butter and brown sugar until smooth
3. Beat in eggs one at a time, then stir in vanilla extract
4. Dissolve baking soda in hot water and add to batter
5. Stir in flour and salt
6. Fold in chocolate chips
7. Drop by large spoonfuls onto ungreased baking sheets
8. Bake for 10 to 12 minutes or until edges are golden brown
9. Allow cookies to cool on baking sheet for 5 minutes
10. Transfer to wire racks to cool completely`,
          prep_time: 15, // in minutes
          cook_time: 12, // in minutes
          total_time: 27, // in minutes
          difficulty: 'Easy',
          servings: 24,
          meal_type: 'Snack',
          best_time: 'Afternoon',
          image_url: 'recipe-b3c5d7e9-f1a3-5792-0b4d-6e8f0a1b2c3d.jpg',
          user_id: 'ab8f951e-bea9-40af-afcc-3e5484d526bb',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await Recipe.create(chocolateChipCookiesRecipe, { transaction });
        console.log('✅ Created Chocolate Chip Cookies recipe');
        
        // Create recipe-ingredient relationships for Chocolate Chip Cookies
        console.log('Creating recipe-ingredient relationships for Chocolate Chip Cookies...');
        
        const chocolateChipCookiesIngredients = [
          {
            id: uuidv4(),
            recipe_id: chocolateChipCookiesId,
            ingredient_id: ingredientMap['Butter'],
            quantity: 8,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            recipe_id: chocolateChipCookiesId,
            ingredient_id: ingredientMap['Brown Sugar'],
            quantity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            recipe_id: chocolateChipCookiesId,
            ingredient_id: ingredientMap['Egg'],
            quantity: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            recipe_id: chocolateChipCookiesId,
            ingredient_id: ingredientMap['Vanilla Extract'],
            quantity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            recipe_id: chocolateChipCookiesId,
            ingredient_id: ingredientMap['Baking Soda'],
            quantity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            recipe_id: chocolateChipCookiesId,
            ingredient_id: ingredientMap['Flour'],
            quantity: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            recipe_id: chocolateChipCookiesId,
            ingredient_id: ingredientMap['Salt'],
            quantity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            recipe_id: chocolateChipCookiesId,
            ingredient_id: ingredientMap['Chocolate Chips'],
            quantity: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ];

        await RecipeIngredient.bulkCreate(chocolateChipCookiesIngredients, { transaction });
        console.log(`✅ Created recipe-ingredient relationships for Chocolate Chip Cookies`);
      } else {
        console.log('✅ Chocolate Chip Cookies recipe already exists');
      }
      
      // Create Caesar Salad recipe if it doesn't exist
      if (!existingCaesarSalad) {
        console.log('Creating Caesar Salad recipe...');
        
        const caesarSaladRecipe = {
          id: caesarSaladId,
          title: 'Classic Caesar Salad',
          description: 'A refreshing and crisp salad featuring romaine lettuce, parmesan cheese, and crunchy croutons all tossed in a creamy homemade Caesar dressing. Perfect as a side dish or add grilled chicken for a complete meal.',
          steps: `1. Wash and dry romaine lettuce, then tear into bite-sized pieces
2. In a small bowl, whisk together olive oil, lemon juice, egg, garlic, dijon mustard, and black pepper to make the dressing
3. Place lettuce in a large salad bowl
4. Pour dressing over lettuce and toss until well coated
5. Add parmesan cheese and toss again
6. Top with croutons
7. Serve immediately for maximum freshness and crunch`,
          prep_time: 15, // in minutes
          cook_time: 0, // in minutes
          total_time: 15, // in minutes
          difficulty: 'Easy',
          servings: 4,
          meal_type: 'Lunch',
          best_time: 'Afternoon',
          image_url: 'recipe-c4d6e8f0-a2b4-6803-1c5d-7e9f0a1b2c3d.jpg',
          user_id: 'ab8f951e-bea9-40af-afcc-3e5484d526bb',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await Recipe.create(caesarSaladRecipe, { transaction });
        console.log('✅ Created Caesar Salad recipe');
        
        // Create recipe-ingredient relationships for Caesar Salad
        console.log('Creating recipe-ingredient relationships for Caesar Salad...');
        
        const caesarSaladIngredients = [
          {
            id: uuidv4(),
            recipe_id: caesarSaladId,
            ingredient_id: ingredientMap['Romaine Lettuce'],
            quantity: 8,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            recipe_id: caesarSaladId,
            ingredient_id: ingredientMap['Parmesan Cheese'],
            quantity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            recipe_id: caesarSaladId,
            ingredient_id: ingredientMap['Croutons'],
            quantity: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            recipe_id: caesarSaladId,
            ingredient_id: ingredientMap['Olive Oil'],
            quantity: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            recipe_id: caesarSaladId,
            ingredient_id: ingredientMap['Lemon Juice'],
            quantity: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            recipe_id: caesarSaladId,
            ingredient_id: ingredientMap['Egg'],
            quantity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            recipe_id: caesarSaladId,
            ingredient_id: ingredientMap['Garlic'],
            quantity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            recipe_id: caesarSaladId,
            ingredient_id: ingredientMap['Dijon Mustard'],
            quantity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            recipe_id: caesarSaladId,
            ingredient_id: ingredientMap['Black Pepper'],
            quantity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ];

        await RecipeIngredient.bulkCreate(caesarSaladIngredients, { transaction });
        console.log(`✅ Created recipe-ingredient relationships for Caesar Salad`);
      } else {
        console.log('✅ Caesar Salad recipe already exists');
      }

      // Commit transaction
      await transaction.commit();
      console.log('🎉 Seed completed successfully!');
      
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      console.error('❌ Error seeding data:', error);
    }
  } catch (error) {
    console.error('❌ Transaction error:', error);
  } finally {
    process.exit(0);
  }
}

seedData(); 