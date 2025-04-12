# Recipe Image Handling Guide

This document provides complete instructions for managing recipe images in the application.

## Overview

This application uses a standardized approach for recipe images:

- Images are stored in `/backend/public/images/recipes/`
- Images are named using the recipe's UUID: `recipe-[uuid].jpg`
- Images are served from `http://[domain]/images/recipes/[filename]`
- Only the filename is stored in the database's `image_url` field
- Frontend receives complete URLs ready to use in `<img>` tags

## Implementation Details

### Backend Components

1. **Static File Serving (server.js)**
   - Express serves static files from the `/public` directory
   - Images are available at `/images/recipes/[filename]`
   ```javascript
   app.use('/images', express.static(path.join(__dirname, 'public/images')));
   ```

2. **Recipe Model (models/Recipe.js)**
   - The Recipe model includes an `image_url` field to store just the filename
   ```javascript
   image_url: { type: DataTypes.STRING, allowNull: true } // Filename only, not full path
   ```

3. **Recipe Controller (controllers/recipeController.js)**
   - When responding to API requests, the controller transforms relative paths to full URLs
   ```javascript
   // Add full URL to images
   const recipesWithFullImageUrls = recipes.map(recipe => {
     const plainRecipe = recipe.get({ plain: true });
     if (plainRecipe.image_url) {
       plainRecipe.image_url = `${BASE_URL}/images/recipes/${plainRecipe.image_url.replace(/^\/images\/recipes\//, '')}`;
     }
     return plainRecipe;
   });
   ```

### Frontend Components

1. **Recipe Service (services/recipeService.ts)**
   - The Recipe interface includes the image_url field
   - No path manipulation is needed - the URL comes ready to use from the API
   ```typescript
   export interface Recipe {
     id: string;
     title: string;
     image_url?: string; // Full URL from API, ready to use in <img> tags
     Ingredients?: Ingredient[];
   }
   ```

2. **Recipe Display Components**
   - The image URL is used directly in the `<img>` tag
   ```jsx
   {recipe.image_url ? (
     <div className="recipe-image">
       <img src={recipe.image_url} alt={recipe.title} />
     </div>
   ) : (
     <div className="recipe-image-placeholder"></div>
   )}
   ```

## Adding New Recipe Images

Follow these steps to add images for new recipes:

1. **Generate a UUID** for the new recipe (this will be the recipe's ID in the database)
2. **Name the image file** using this UUID: `recipe-[uuid].jpg`
3. **Place the image file** in `/backend/public/images/recipes/`
4. **Store only the filename** in the database's `image_url` field
5. **The controller will automatically** add the base URL when sending to the client

## Image Specifications

Follow these guidelines for recipe images:

- **Naming Convention**: `recipe-[uuid].jpg`
- **Recommended Dimensions**: 1200×800 pixels
- **Format**: JPG or PNG
- **Maximum File Size**: 2MB
- **Aspect Ratio**: 3:2 (landscape)

## Example: Spaghetti Carbonara

The Spaghetti Carbonara recipe demonstrates this pattern:

- **Recipe ID**: `e45a6b20-dc93-414a-b9a5-8a9b3f5dcfa1`
- **Image Filename**: `recipe-e45a6b20-dc93-414a-b9a5-8a9b3f5dcfa1.jpg`
- **Database Entry**: `image_url: 'recipe-e45a6b20-dc93-414a-b9a5-8a9b3f5dcfa1.jpg'`
- **API Returns**: `image_url: 'http://localhost:3001/images/recipes/recipe-e45a6b20-dc93-414a-b9a5-8a9b3f5dcfa1.jpg'`
- **Frontend Usage**: `<img src={recipe.image_url} alt={recipe.title} />`

## Troubleshooting

If images are not displaying correctly:

1. **Check the file exists** in `/backend/public/images/recipes/`
2. **Verify the filename** in the database matches the actual file
3. **Inspect API responses** to ensure the full URL is being returned
4. **Check network requests** in the browser to see if the image is being loaded
5. **Ensure Express static middleware** is configured correctly in server.js 