/**
 * AI Services Entry Point
 * 
 * This module provides access to all AI-related services in the application.
 * It handles fallbacks when external APIs are not available.
 */

const recipeInsightService = require('./recipeInsightService');
const openaiService = require('./openaiService');

/**
 * Generate insight for a recipe, using OpenAI if available or fallback otherwise
 * 
 * @param {string} title - Recipe title
 * @param {string} description - Recipe description
 * @param {string} ingredients - Recipe ingredients text
 * @param {string} difficulty - Recipe difficulty level
 * @param {string} mealType - Type of meal (breakfast, lunch, etc.)
 * @returns {Promise<string>} - Generated insight about the recipe
 */
const generateRecipeInsight = async (title, description, ingredients, difficulty, mealType) => {
  try {
    // Try to use OpenAI if enabled
    if (openaiService.isEnabled()) {
      console.log('Using OpenAI for recipe insight generation');
      const openaiInsight = await openaiService.generateRecipeInsight(
        title, 
        description, 
        ingredients,
        difficulty,
        mealType
      );
      
      // If OpenAI generated an insight, return it
      if (openaiInsight) {
        return openaiInsight;
      }
    }
    
    // If OpenAI is not enabled or failed, use fallback
    console.log('Using fallback for recipe insight generation');
    return recipeInsightService.generateRecipeInsight(
      title, 
      description, 
      ingredients,
      difficulty,
      mealType
    );
  } catch (error) {
    console.error('Error in AI service:', error);
    // Always fall back to local generation in case of any error
    return recipeInsightService.generateRecipeInsight(
      title, 
      description, 
      ingredients,
      difficulty,
      mealType
    );
  }
};

module.exports = {
  generateRecipeInsight
}; 