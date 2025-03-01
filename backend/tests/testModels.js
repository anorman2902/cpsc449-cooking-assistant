const { syncDatabase, User, Recipe, Ingredient, RecipeIngredient, ShoppingList } = require('../src/models');

(async () => {
    try {
        await syncDatabase();

        // ✅ Check if the user already exists before creating
        let user = await User.findOne({ where: { username: 'testuser' } });

        if (!user) {
            user = await User.create({
                username: 'testuser',
                email: 'test@example.com',
                password: 'securepassword'
            });
            console.log('✅ Test user created:', user.toJSON());
        } else {
            console.log('⚠️ Test user already exists:', user.toJSON());
        }

        // ✅ Check if recipe exists before creating
        let recipe = await Recipe.findOne({ where: { title: 'Spaghetti Carbonara', user_id: user.id } });

        if (!recipe) {
            recipe = await Recipe.create({
                title: 'Spaghetti Carbonara',
                description: 'A classic Italian pasta dish.',
                steps: 'Boil pasta, cook bacon, mix with eggs and cheese.',
                user_id: user.id
            });
            console.log('✅ Test recipe created:', recipe.toJSON());
        } else {
            console.log('⚠️ Test recipe already exists:', recipe.toJSON());
        }

        // ✅ Check if ingredients exist before creating
        let egg = await Ingredient.findOne({ where: { name: 'Egg' } });
        if (!egg) egg = await Ingredient.create({ name: 'Egg', unit: 'pcs', calories: 70 });

        let pasta = await Ingredient.findOne({ where: { name: 'Pasta' } });
        if (!pasta) pasta = await Ingredient.create({ name: 'Pasta', unit: 'grams', calories: 200 });

        console.log('✅ Test ingredients created:', egg.toJSON(), pasta.toJSON());

        // ✅ Link ingredients to the recipe only if they’re not linked already
        const existingRecipeIngredient1 = await RecipeIngredient.findOne({ where: { recipe_id: recipe.id, ingredient_id: egg.id } });
        if (!existingRecipeIngredient1) {
            await RecipeIngredient.create({ recipe_id: recipe.id, ingredient_id: egg.id, quantity: 2 });
        }

        const existingRecipeIngredient2 = await RecipeIngredient.findOne({ where: { recipe_id: recipe.id, ingredient_id: pasta.id } });
        if (!existingRecipeIngredient2) {
            await RecipeIngredient.create({ recipe_id: recipe.id, ingredient_id: pasta.id, quantity: 100 });
        }

        console.log('✅ Ingredients linked to recipe');

        // ✅ Add ingredient to shopping list only if not already added
        const existingShoppingList = await ShoppingList.findOne({ where: { user_id: user.id, ingredient_id: pasta.id } });
        if (!existingShoppingList) {
            await ShoppingList.create({ user_id: user.id, ingredient_id: pasta.id, quantity: 200 });
            console.log('✅ Ingredient added to shopping list');
        } else {
            console.log('⚠️ Ingredient already in shopping list');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
})();
