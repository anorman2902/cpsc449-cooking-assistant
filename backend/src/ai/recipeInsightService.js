/**
 * Recipe Insight Service
 * 
 * Generates insights about recipes, with fallback to predefined insights
 * if OpenAI API is not available.
 */

/**
 * Generate an insight for a recipe based on its details
 * 
 * @param {string} title - Recipe title
 * @param {string} description - Recipe description
 * @param {string} ingredients - Recipe ingredients list
 * @param {string} difficulty - Recipe difficulty level
 * @param {string} mealType - Type of meal (breakfast, lunch, etc.)
 * @returns {string} - Generated insight about the recipe
 */
const generateRecipeInsight = (title, description, ingredients, difficulty, mealType) => {
  return generateFallbackInsight(title, ingredients, mealType);
};

/**
 * Generate a fallback insight without using external APIs
 */
const generateFallbackInsight = (title, ingredients, mealType) => {
  const mealTypeInsights = {
    'Breakfast': 'A nutritious way to start your day. This breakfast recipe provides energy and flavor to kickstart your morning.',
    'Lunch': 'Perfect for a midday meal. This lunch recipe balances flavor and nutrition to keep you energized throughout the day.',
    'Dinner': 'A satisfying end to your day. This dinner recipe combines rich flavors and balanced ingredients for a fulfilling meal.',
    'Snack': 'A delightful between-meal treat. This snack recipe offers a perfect balance of taste and nutrition.'
  };

  return mealTypeInsights[mealType] || 
    `This ${title} recipe combines delicious ingredients into a flavorful dish. Enjoy preparing and sharing this homemade creation.`;
};

module.exports = {
  generateRecipeInsight
}; 