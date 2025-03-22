/**
 * Recipe Service
 * 
 * Service for handling API requests related to recipes
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
  Ingredients?: Ingredient[];
}

/**
 * Get all recipes from the API
 * 
 * @returns {Promise<Recipe[]>} Promise that resolves to an array of recipes
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
 * 
 * @param {string} query - The search query
 * @returns {Promise<Recipe[]>} Promise that resolves to an array of matching recipes
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