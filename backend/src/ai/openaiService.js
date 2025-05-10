/**
 * OpenAI Service
 * 
 * Provides functionality to interact with OpenAI's API.
 * By default, the service is enabled if a valid API key is provided.
 * 
 * Configure with ENABLE_OPENAI=false in your .env file to disable.
 */
require('dotenv').config();
let OpenAI = null;

// Enable OpenAI by default unless explicitly disabled
const OPENAI_ENABLED = process.env.ENABLE_OPENAI !== 'false';

try {
  if (OPENAI_ENABLED) {
    OpenAI = require('openai');
    console.log('OpenAI module loaded - feature is ENABLED');
  } else {
    console.log('OpenAI features are DISABLED - using fallback insights');
  }
} catch (error) {
  console.error('Error loading OpenAI module:', error);
}

// Initialize OpenAI with API key from environment variables if enabled
let openai = null;
if (OPENAI_ENABLED) {
  try {
    const apiKey = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.trim() : null;
    
    if (apiKey) {
      openai = new OpenAI({
        apiKey: apiKey,
      });
      console.log('OpenAI client initialized with API key');
    } else {
      console.warn('No OpenAI API key found in environment variables - using fallback insights');
    }
  } catch (error) {
    console.error('Error initializing OpenAI client:', error);
  }
}

/**
 * Generate AI insight for a recipe
 * 
 * @param {string} title - Recipe title
 * @param {string} description - Recipe description
 * @param {string} ingredients - Recipe ingredients text
 * @param {string} difficulty - Recipe difficulty level
 * @param {string} mealType - Type of meal (breakfast, lunch, etc.)
 * @returns {Promise<string>} - AI-generated insight or null if disabled
 */
const generateRecipeInsight = async (title, description, ingredients, difficulty, mealType) => {
  // Return null if OpenAI is disabled or not initialized
  if (!OPENAI_ENABLED || !openai) {
    return null;
  }

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
    console.error('Error generating OpenAI recipe insight:', error);
    return null;
  }
};

/**
 * Check if OpenAI features are enabled
 * 
 * @returns {boolean} - True if OpenAI is enabled and initialized
 */
const isEnabled = () => {
  return OPENAI_ENABLED && openai !== null;
};

module.exports = {
  generateRecipeInsight,
  isEnabled
}; 