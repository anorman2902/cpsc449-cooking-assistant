/**
 * Recipe Service
 * 
 * Service for handling API requests related to recipes
 * For detailed image handling documentation, see: /docs/image-handling.md
 */

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