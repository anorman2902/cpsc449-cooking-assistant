/**
 * Recipe Service
 * 
 * Service for handling API requests related to recipes
 * For detailed image handling documentation, see: /docs/image-handling.md
 */
import { getAuthHeaders, handleResponse, ApiError } from './api';

const API_URL = 'http://localhost:3001/api';

// Types
export interface Ingredient {
  id: string;
  name: string;
}

export interface Recipe {
  id: string;
  title: string;
  image_url?: string; // Full URL from API, ready to use in <img> tags
  description?: string;
  steps?: string;
  prep_time?: number; // in minutes
  cook_time?: number; // in minutes
  total_time?: number; // in minutes
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  servings?: number;
  meal_type?: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  best_time?: 'Morning' | 'Afternoon' | 'Evening';
  Ingredients?: Ingredient[];
  user_id?: string; 
  source_recipe_id?: string;
  ai_insight?: string; // AI-generated insights about the recipe
}

/**
 * Get all recipes from the API
 */
export const getAllRecipes = async (): Promise<Recipe[]> => {
  try {
    const response = await fetch(`${API_URL}/recipes`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
};

/**
 * Search recipes by name or ingredient
 */
export const searchRecipes = async (query: string): Promise<Recipe[]> => {
  try {
    const response = await fetch(`${API_URL}/recipes/search/${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching recipes:', error);
    return [];
  }
};

/**
 * Get recipe details by ID
 */
export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    const response = await fetch(`${API_URL}/recipes/${encodeURIComponent(id)}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    return null;
  }
}; 

// Creates a user-editable copy of a recipe.
export const copyRecipeForUser = async (originalRecipeId: string, token: string): Promise<{ message: string, newRecipeId: string }> => {
  try {
      const response = await fetch(`${API_URL}/recipes/${originalRecipeId}/copy`, {
          method: 'POST',
          headers: getAuthHeaders(token), // Requires authentication
      });
      return handleResponse(response);
  } catch (error) {
      console.error('Copy recipe API error:', error);
      throw error;
  }
};

// Updates a recipe owned by the user.
// Define the shape of data allowed for update
interface RecipeUpdateData {
  title?: string;
  description?: string;
  steps?: string;
  prep_time?: number;
  cook_time?: number;
  total_time?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  servings?: number;
  meal_type?: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  best_time?: 'Morning' | 'Afternoon' | 'Evening';
  // ingredients not handled yet
}
export const updateMyRecipe = async (recipeId: string, token: string, updateData: RecipeUpdateData): Promise<{ message: string, recipe: Recipe }> => {
  try {
      const response = await fetch(`${API_URL}/recipes/${recipeId}`, {
          method: 'PUT',
          headers: getAuthHeaders(token), // Requires authentication
          body: JSON.stringify(updateData),
      });
      return handleResponse(response);
  } catch (error) {
      console.error('Update recipe API error:', error);
      throw error;
  }
};

export const deleteMyRecipe = async (recipeId: string, token: string): Promise<{ message: string }> => {
  try {
      const response = await fetch(`${API_URL}/recipes/${recipeId}`, {
          method: 'DELETE',
          headers: getAuthHeaders(token), // Requires authentication
      });
      return handleResponse(response);
  } catch (error) {
      console.error('Delete recipe API error:', error);
      throw error;
  }
};