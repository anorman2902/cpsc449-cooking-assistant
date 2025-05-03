require('dotenv').config();
const OpenAI = require('openai');

/**
 * OpenAI Service
 * 
 * Provides functionality to interact with OpenAI's API for generating
 * recipe insights using GPT-4o-mini model.
 */

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate AI insight for a recipe
 * 
 * @param {string} title - Recipe title
 * @param {string} description - Recipe description
 * @param {string} ingredients - Recipe ingredients text
 * @param {string} difficulty - Recipe difficulty level
 * @param {string} mealType - Type of meal (breakfast, lunch, etc.)
 * @returns {Promise<string>} - AI-generated insight
 */
const generateRecipeInsight = async (title, description, ingredients, difficulty, mealType) => {
  try {
    const prompt = `
      Generate a brief 2-3 sentence insight about the following recipe. 
      Include interesting observations about flavor combinations, nutritional benefits, or culinary tips.
      Keep it concise and helpful for home cooks. Highlight what makes this recipe special.
      
      Recipe Title: ${title}
      Description: ${description || 'No description provided'}
      Ingredients: ${ingredients || 'Ingredients not specified'}
      Difficulty: ${difficulty}
      Meal Type: ${mealType}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful culinary assistant providing brief insights about recipes. Keep your responses to 2-3 sentences maximum."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    // Return the generated insight text
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating recipe insight:', error);
    // Return a default message if there's an error
    return "Could not generate insight for this recipe.";
  }
};

module.exports = {
  generateRecipeInsight,
}; 