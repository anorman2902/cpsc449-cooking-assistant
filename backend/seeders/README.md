# Database Seeders

This directory contains scripts for populating the database with test data.

## Available Seeders

### tempSeed.js (Default)

The main seeder used by the application. This seeder creates a complete set of test data:

- **Users**: Two test users with standard credentials
- **Ingredients**: Common cooking ingredients like eggs, pasta, chicken, etc.
- **Recipes**: Four complete recipes including Spaghetti Carbonara, Classic Spaghetti, Chicken Rice Bowl, and Beef Tacos
- **Recipe-Ingredient Relationships**: Links between recipes and their ingredients with quantities
- **Shopping List Items**: Sample shopping list entries

Run this seeder with:
```
npm run seed
```

## Usage Notes

- The seeders use fixed UUIDs for some entities to ensure consistent relationships
- All seeders use transactions to ensure data integrity
- After running a seeder, restart the development server for changes to take effect

## Database Structure

The seeders populate the following tables:

- `Users` - User accounts
- `Recipes` - Recipe information
- `Ingredients` - Available ingredients
- `RecipeIngredients` - Join table linking recipes and ingredients
- `ShoppingLists` - User shopping lists

## Troubleshooting

If you encounter issues with the seeders:

1. Check the PostgreSQL connection in .env file
2. Make sure all tables are properly created (run migrations if needed)
3. Check the console output for specific error messages
4. Try dropping and recreating the database if schema issues persist 