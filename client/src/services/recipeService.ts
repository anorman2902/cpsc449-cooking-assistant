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

// Create a new recipe from scratch
export interface CreateRecipeData {
  title: string;
  description?: string;
  ingredients: string; // Comma-separated string of ingredients
  steps: string; // Comma-separated string of steps
  prep_time?: number;
  cook_time?: number;
  total_time?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  servings?: number;
  meal_type?: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  best_time?: 'Morning' | 'Afternoon' | 'Evening';
  image_data?: string; // Base64 encoded image data
}

export const createNewRecipe = async (token: string, recipeData: CreateRecipeData): Promise<{ message: string, recipeId: string }> => {
  try {
    console.log('Making API request to create recipe');
    const response = await fetch(`${API_URL}/recipes`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(recipeData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('Server error response:', errorData);
      throw new Error(`Server error: ${errorData.message || response.statusText}`);
    }
    
    return handleResponse(response);
  } catch (error) {
    console.error('Create recipe API error:', error);
    throw error;
  }
};