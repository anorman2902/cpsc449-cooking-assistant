# Recipe Framework Documentation

This document provides a comprehensive guide on how to use the recipe framework for adding new recipes to the application. The framework is designed to be reusable and supports both light and dark modes for accessibility.

## Table of Contents

1. [Overview](#overview)
2. [Component Structure](#component-structure)
3. [Adding a New Recipe](#adding-a-new-recipe)
4. [Styling and Theme Support](#styling-and-theme-support)
5. [API Integration](#api-integration)
6. [Accessibility Features](#accessibility-features)

## Overview

The recipe framework consists of several components that work together to display recipes:

- **RecipeCard**: A reusable component for displaying recipe previews on the Home and Search pages
- **RecipeDetails**: A page component for displaying detailed recipe information
- **Theme Context**: Provides dark mode support for accessibility

## Component Structure

### RecipeCard Component

Located at: `client/src/components/features/RecipeCard/RecipeCard.tsx`

The RecipeCard component is designed to be a reusable card that displays a preview of a recipe. It shows:

- Recipe image
- Title
- Brief list of ingredients
- Time estimate (if available)

It supports dark mode and is responsive across different screen sizes.

This component is used throughout the application, including:
- On the Home page under "Available Recipes"
- In the SearchResults page for displaying search matches

By centralizing this component, we ensure a consistent look and feel across the application and make future updates easier.

### RecipeDetails Page

Located at: `client/src/pages/RecipeDetails/RecipeDetails.tsx`

The RecipeDetails page displays comprehensive information about a recipe, including:

- Recipe title and image
- Metadata (difficulty, prep time, cook time, total time, servings, meal type, best time to serve)
- Description
- Ingredients list
- Step-by-step preparation instructions

It also supports dark mode for better accessibility.

## Adding a New Recipe

### Backend: Creating a New Recipe

To add a new recipe to the database:

1. Create a new recipe entry in the database with the following fields:
   ```json
   {
     "id": "unique-uuid",
     "title": "Recipe Title",
     "description": "Recipe description text",
     "steps": "Step 1: First step\nStep 2: Second step\n...",
     "prep_time": 15,
     "cook_time": 30,
     "total_time": 45,
     "difficulty": "Medium",
     "servings": 4,
     "meal_type": "Dinner",
     "best_time": "Evening",
     "image_url": "path/to/image.jpg"
   }
   ```

2. Add ingredients to the recipe:
   ```json
   [
     { "id": "ingredient-uuid-1", "name": "Ingredient 1" },
     { "id": "ingredient-uuid-2", "name": "Ingredient 2" }
   ]
   ```

### Frontend: Displaying Recipes

The recipe data will automatically be displayed in:

1. The Home page under "Available Recipes"
2. Search results when the recipe matches the search query

When a user clicks on a recipe card, they will be taken to the recipe details page.

## Styling and Theme Support

### Light Mode and Dark Mode

The recipe framework fully supports both light and dark modes. The theme is controlled by the ThemeContext and can be toggled by the user.

All components in the application support dark mode, including:

#### SearchBar Component:
- Dark input field background in dark mode
- Light text color for better readability
- Adjusted shadows and contrast

#### Home Page Hero Section:
- Dark background in dark mode
- Light text colors for better readability
- Consistent theming with the rest of the application

#### RecipeCard in Dark Mode:
- Dark background
- Light text
- Adjusted shadow for better visibility

#### RecipeDetails in Dark Mode:
- Dark background for all containers
- Light text for better readability
- Adjusted borders and shadows

### CSS Variables

The styling uses CSS variables for easy customization:

```css
/* Light mode colors (default) */
:root {
  --recipe-bg: #ffffff;
  --recipe-text: #343a40;
  --recipe-secondary-text: #495057;
  --recipe-metadata-bg: #f8f9fa;
  --recipe-border: #e9ecef;
  /* ... other variables ... */
}

/* Dark mode colors */
.theme-dark .recipe-details-page {
  --recipe-bg: #1a1a1a;
  --recipe-text: #e9ecef;
  --recipe-secondary-text: #ced4da;
  --recipe-metadata-bg: #2a2a2a;
  --recipe-border: #444444;
  /* ... other variables ... */
}
```

To customize the appearance, simply modify these variables.

## API Integration

The recipe framework integrates with the backend API to fetch and display recipe data.

### API Endpoints

- `GET /api/recipes`: Returns all recipes
- `GET /api/recipes/:id`: Returns a specific recipe by ID
- `GET /api/recipes/search/:query`: Returns recipes matching the search query

### Recipe Service

The recipe service (`client/src/services/recipeService.ts`) provides functions to interact with these endpoints:

- `getAllRecipes()`: Fetches all recipes
- `getRecipeById(id)`: Fetches a specific recipe by ID
- `searchRecipes(query)`: Searches for recipes

## Accessibility Features

The recipe framework includes several accessibility features:

1. **Dark Mode Support**: Reduces eye strain in low-light environments
2. **Responsive Design**: Works on devices of all sizes
3. **Semantic HTML**: Uses proper heading levels and semantic elements
4. **Readable Text**: Ensures good contrast between text and background
5. **Alternative Text**: Images have appropriate alt text

## Best Practices

When adding new recipes or modifying the framework, follow these best practices:

1. **Consistent Formatting**: Keep recipe data formatting consistent
2. **Image Optimization**: Optimize images for web to ensure fast loading
3. **Step Formatting**: Format steps as separate lines without numbering (the component adds numbers automatically)
4. **Responsive Testing**: Test on multiple screen sizes to ensure responsiveness
5. **Theme Testing**: Verify that both light and dark modes display correctly

## Code Maintenance

To maintain clean and efficient code:

1. **Centralized Components**: Use the shared RecipeCard component instead of creating inline recipe cards
2. **CSS Organization**: Keep component-specific CSS in its own file alongside the component
3. **Theme Variables**: Use CSS variables for theming to ensure consistent dark mode support
4. **Remove Redundancy**: Avoid duplicate code by leveraging shared components
5. **Document Changes**: Update documentation when making significant changes to the framework

When adding new recipe-related components:
- Place shared components in `client/src/components/features/`
- Place page-specific components in their respective page directory
- Make sure to support both light and dark themes
- Follow existing naming conventions and code style 