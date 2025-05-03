# Recipe Creation Implementation Guide

This guide provides details on implementing the Recipe Creation feature with AI insights integration.

## Overview

The Recipe Creation feature allows users to:
1. Create their own recipes
2. Upload images
3. Specify ingredients and steps
4. Automatically receive AI-generated insights

## Implementation Roadmap

### 1. Backend Requirements

#### 1.1 API Endpoint

Create a new API endpoint in `backend/src/routes/recipeRoutes.js`:

```javascript
// POST a new recipe
router.post('/', verifyToken, recipeController.createRecipe);
```

#### 1.2 Controller Function

Implement the `createRecipe` controller function in `backend/src/controllers/recipeController.js`:

```javascript
exports.createRecipe = async (req, res) => {
  const userId = req.user.id; // From auth middleware
  const { 
    title, 
    description, 
    steps, 
    prep_time, 
    cook_time, 
    total_time, 
    difficulty, 
    servings, 
    meal_type, 
    best_time,
    ingredients // Array of ingredient names
  } = req.body;

  if (!title || !steps || !ingredients || ingredients.length === 0) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const transaction = await sequelize.transaction();
  
  try {
    // 1. Create the basic recipe
    const recipeId = uuidv4();
    const newRecipe = await Recipe.create({
      id: recipeId,
      title,
      description,
      steps,
      prep_time,
      cook_time,
      total_time,
      difficulty,
      servings,
      meal_type,
      best_time,
      user_id: userId,
    }, { transaction });
    
    // 2. Process and associate ingredients
    const ingredientRows = [];
    for (const ingredientName of ingredients) {
      // Find or create the ingredient
      const [ingredient] = await Ingredient.findOrCreate({
        where: { name: ingredientName.trim() },
        defaults: { id: uuidv4(), name: ingredientName.trim() },
        transaction
      });
      
      // Create association in junction table
      ingredientRows.push({
        id: uuidv4(),
        recipe_id: recipeId,
        ingredient_id: ingredient.id,
        quantity: 1 // Default quantity
      });
    }
    
    await RecipeIngredient.bulkCreate(ingredientRows, { transaction });
    
    // 3. Generate AI insight
    const ingredientsText = ingredients.join(', ');
    const insight = await openaiService.generateRecipeInsight(
      title,
      description,
      ingredientsText,
      difficulty,
      meal_type
    );
    
    // 4. Update recipe with insight
    await Recipe.update(
      { ai_insight: insight },
      { where: { id: recipeId } },
      { transaction }
    );
    
    // 5. Commit transaction
    await transaction.commit();
    
    // 6. Get the complete recipe with insight to return
    const completeRecipe = await Recipe.findByPk(recipeId, {
      include: [{
        model: Ingredient,
        as: 'Ingredients',
        through: { attributes: [] },
        attributes: ['id', 'name']
      }]
    });
    
    // Format image URL if present
    if (completeRecipe.image_url) {
      completeRecipe.image_url = `${BASE_URL}/images/recipes/${completeRecipe.image_url.replace(/^\/images\/recipes\//, '')}`;
    }
    
    return res.status(201).json(completeRecipe);
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating recipe:', error);
    return res.status(500).json({ message: 'Server error creating recipe' });
  }
};
```

#### 1.3 Image Upload Handling

Implement image upload support following the pattern in the [image-handling.md](image-handling.md) documentation.

### 2. Frontend Implementation

#### 2.1 Create Recipe Service Function

Add a function to `client/src/services/recipeService.ts`:

```typescript
/**
 * Create a new recipe
 */
export interface RecipeCreateData {
  title: string;
  description?: string;
  steps: string;
  prep_time: number;
  cook_time: number;
  total_time: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  servings: number;
  meal_type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  best_time: 'Morning' | 'Afternoon' | 'Evening';
  ingredients: string[]; // Array of ingredient names
}

export const createRecipe = async (
  recipeData: RecipeCreateData, 
  token: string
): Promise<Recipe> => {
  try {
    const response = await fetch(`${API_URL}/recipes`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(recipeData),
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error creating recipe:', error);
    throw error;
  }
};
```

#### 2.2 Create Recipe Form Component

Create a new component for the recipe creation form:

```tsx
// client/src/pages/CreateRecipe/CreateRecipe.tsx

import React, { useState } from 'react';
import './CreateRecipe.css';
import { useNavigate } from 'react-router-dom';
import { createRecipe, RecipeCreateData } from '../../services/recipeService';
import { useAuth } from '../../contexts/AuthContext';

const CreateRecipe: React.FC = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState('');
  const [prepTime, setPrepTime] = useState(0);
  const [cookTime, setCookTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [servings, setServings] = useState(4);
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Dinner');
  const [bestTime, setBestTime] = useState<'Morning' | 'Afternoon' | 'Evening'>('Evening');
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);
  
  // Add ingredient to list
  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      setIngredients([...ingredients, ingredientInput.trim()]);
      setIngredientInput('');
    }
  };
  
  // Remove ingredient from list
  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };
  
  // Calculate total time when prep or cook time changes
  React.useEffect(() => {
    setTotalTime(prepTime + cookTime);
  }, [prepTime, cookTime]);
  
  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !steps.trim() || ingredients.length === 0) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const recipeData: RecipeCreateData = {
        title: title.trim(),
        description: description.trim() || undefined,
        steps: steps.trim(),
        prep_time: prepTime,
        cook_time: cookTime,
        total_time: totalTime,
        difficulty,
        servings,
        meal_type: mealType,
        best_time: bestTime,
        ingredients,
      };
      
      const newRecipe = await createRecipe(recipeData, token!);
      
      // Redirect to the new recipe's page
      navigate(`/recipes/${newRecipe.id}`);
    } catch (err) {
      console.error('Failed to create recipe:', err);
      setError('Failed to create recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="create-recipe-container">
      <h1>Create New Recipe</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="create-recipe-form">
        {/* Basic Info Section */}
        <div className="form-section">
          <h2>Basic Information</h2>
          
          <div className="form-group">
            <label htmlFor="title">Recipe Title*</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        
        {/* Ingredients Section */}
        <div className="form-section">
          <h2>Ingredients*</h2>
          
          <div className="ingredient-input-group">
            <input
              type="text"
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              placeholder="Enter an ingredient"
            />
            <button 
              type="button" 
              onClick={handleAddIngredient} 
              className="add-ingredient-btn"
            >
              Add
            </button>
          </div>
          
          <ul className="ingredients-list">
            {ingredients.map((ingredient, index) => (
              <li key={index} className="ingredient-item">
                {ingredient}
                <button 
                  type="button" 
                  onClick={() => handleRemoveIngredient(index)}
                  className="remove-ingredient-btn"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          
          {ingredients.length === 0 && (
            <p className="ingredients-hint">Add at least one ingredient</p>
          )}
        </div>
        
        {/* Steps Section */}
        <div className="form-section">
          <h2>Preparation Steps*</h2>
          <p className="steps-hint">Enter each step on a new line</p>
          <textarea
            id="steps"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            rows={5}
            required
          />
        </div>
        
        {/* Recipe Details Section */}
        <div className="form-section">
          <h2>Recipe Details</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prepTime">Prep Time (minutes)</label>
              <input
                type="number"
                id="prepTime"
                value={prepTime}
                onChange={(e) => setPrepTime(parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cookTime">Cook Time (minutes)</label>
              <input
                type="number"
                id="cookTime"
                value={cookTime}
                onChange={(e) => setCookTime(parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="totalTime">Total Time (minutes)</label>
              <input
                type="number"
                id="totalTime"
                value={totalTime}
                readOnly
                disabled
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="difficulty">Difficulty</label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="servings">Servings</label>
              <input
                type="number"
                id="servings"
                value={servings}
                onChange={(e) => setServings(parseInt(e.target.value) || 1)}
                min="1"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="mealType">Meal Type</label>
              <select
                id="mealType"
                value={mealType}
                onChange={(e) => setMealType(e.target.value as any)}
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="bestTime">Best Time to Serve</label>
              <select
                id="bestTime"
                value={bestTime}
                onChange={(e) => setBestTime(e.target.value as any)}
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="cancel-btn"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Recipe'}
          </button>
        </div>
        
        {isSubmitting && (
          <div className="submission-status">
            <p>Creating your recipe... The AI will generate insights automatically.</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateRecipe;
```

#### 2.3 Add CSS Styling

Create a CSS file for the recipe creation page:

```css
/* client/src/pages/CreateRecipe/CreateRecipe.css */

.create-recipe-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.create-recipe-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  border: 1px solid var(--border-color, #ddd);
  border-radius: 8px;
  padding: 1.5rem;
  background-color: var(--bg-secondary, #f9f9f9);
}

.form-section h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  border-bottom: 1px solid var(--border-color, #ddd);
  padding-bottom: 0.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 4px;
  font-size: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.ingredient-input-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.ingredient-input-group input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 4px;
  font-size: 1rem;
}

.add-ingredient-btn {
  padding: 0 1rem;
  background-color: var(--primary-color, #4caf50);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.ingredients-list {
  list-style-type: none;
  padding: 0;
  margin: 0 0 1rem 0;
}

.ingredient-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--bg-color, #fff);
  border: 1px solid var(--border-color, #ddd);
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.remove-ingredient-btn {
  background: none;
  border: none;
  color: var(--danger-color, #f44336);
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
}

.ingredients-hint,
.steps-hint {
  color: var(--text-secondary, #777);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
}

.cancel-btn,
.submit-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
}

.cancel-btn {
  background-color: var(--button-bg, #f1f1f1);
  border: 1px solid var(--border-color, #ddd);
  color: var(--text-primary, #333);
}

.submit-btn {
  background-color: var(--primary-color, #4caf50);
  border: none;
  color: white;
  flex: 1;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  color: var(--danger-color, #f44336);
  background-color: rgba(244, 67, 54, 0.1);
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.submission-status {
  text-align: center;
  margin-top: 1rem;
  padding: 1rem;
  background-color: var(--bg-secondary, #f9f9f9);
  border-radius: 4px;
}

/* Dark theme support */
.theme-dark .create-recipe-container {
  --bg-secondary: #2a2a2a;
  --border-color: #444;
  --primary-color: #38b2ac;
  --danger-color: #ff6b6b;
  --button-bg: #333;
  --text-primary: #e9ecef;
  --text-secondary: #adb5bd;
}
```

#### 2.4 Update App.tsx Routes

Update the app routes to include the new recipe creation page:

```tsx
// In App.tsx

import CreateRecipe from './pages/CreateRecipe/CreateRecipe';

// Inside the routes config
<Route path="/recipes/create" element={<CreateRecipe />} />
```

#### 2.5 Add Navigation Link

Add a link to the recipe creation page in the navigation menu for authenticated users.

### 3. Testing the Feature

1. **Backend Testing**: 
   - Test the API endpoint using Postman or similar tool
   - Verify the created recipe has AI insights
   - Check error handling for missing fields

2. **Frontend Testing**:
   - Test form validation
   - Test ingredient addition/removal
   - Test recipe creation with minimal data
   - Test recipe creation with full data
   - Verify AI insights appear on the created recipe page

### 4. AI Integration Workflow

When a user creates a recipe, the workflow is:

1. User fills out the recipe form and submits
2. Frontend validates the form data 
3. Backend receives the data and starts a database transaction
4. Backend creates the recipe record and associates ingredients
5. Backend calls the OpenAI API to generate insights
6. Backend updates the recipe with the AI-generated insights
7. Database transaction is committed
8. User is redirected to the new recipe page where they can see the AI insights

This approach ensures:
- The AI insight is generated only once per recipe
- The user doesn't have to wait for AI generation to complete
- The insight is stored in the database for future views
- Error handling prevents the process from breaking if AI generation fails

## Best Practices

1. **Validation**: Always validate required fields on both frontend and backend
2. **Transactions**: Use database transactions to ensure data integrity
3. **Error Handling**: Implement proper error handling for API calls
4. **User Feedback**: Provide clear feedback during the submission process
5. **Security**: Verify user authentication before allowing recipe creation 