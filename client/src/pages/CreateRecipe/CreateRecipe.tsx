import React, { useState, useEffect, useRef } from 'react';
import './CreateRecipe.css';
import { createNewRecipe, CreateRecipeData } from '../../services/recipeService';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { favoriteApi } from '../../services/userService';

interface CreateRecipeProps {
  onBack: () => void;
}

const CreateRecipe: React.FC<CreateRecipeProps> = ({ onBack }) => {
  const { theme } = useTheme();
  const { token, isAuthenticated, addFavoriteId } = useAuth();
  const [formData, setFormData] = useState<CreateRecipeData>({
    title: '',
    description: '',
    ingredients: '',
    steps: '',
    prep_time: 15,
    cook_time: 30,
    total_time: 45,
    difficulty: 'Medium',
    servings: 4,
    meal_type: 'Dinner'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Image handling states
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      // We'll rely on App.tsx routing to redirect to auth page
      onBack();
    }
  }, [isAuthenticated, onBack]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric values
    if (name === 'prep_time' || name === 'cook_time' || name === 'servings') {
      const newValue = parseInt(value) || 0;
      
      setFormData(prevData => {
        // If prep_time or cook_time is changing, update total_time as well
        if (name === 'prep_time') {
          return {
            ...prevData,
            [name]: newValue,
            total_time: newValue + (prevData.cook_time || 0)
          };
        } else if (name === 'cook_time') {
          return {
            ...prevData,
            [name]: newValue,
            total_time: (prevData.prep_time || 0) + newValue
          };
        } else {
          return {
            ...prevData,
            [name]: newValue
          };
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Validate file type
      if (!file.type.match('image/jpeg|image/png|image/jpg')) {
        setError('Please upload an image file (JPEG, JPG, or PNG)');
        return;
      }
      
      // Validate file size (max 3MB)
      if (file.size > 3 * 1024 * 1024) {
        setError('Image size should be less than 3MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target?.result as string;
        setImagePreview(imageDataUrl);
        setFormData({
          ...formData,
          image_data: imageDataUrl
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData({
      ...formData,
      image_data: undefined
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate required fields
    if (!formData.title.trim()) {
      setError('Recipe name is required');
      return;
    }

    if (!formData.ingredients.trim()) {
      setError('Ingredients are required');
      return;
    }

    if (!formData.steps.trim()) {
      setError('Preparation steps are required');
      return;
    }

    setLoading(true);

    try {
      if (!token) {
        throw new Error('You must be logged in to create a recipe');
      }

      console.log('Submitting recipe with data:', {
        ...formData,
        image_data: formData.image_data ? 'Image data present (truncated)' : 'No image data'
      });

      const result = await createNewRecipe(token, formData);
      console.log('Recipe created successfully:', result);
      setSuccess(`Recipe "${formData.title}" created successfully!`);
      
      // Automatically add the recipe to favorites
      try {
        await favoriteApi.addFavorite(token, result.recipeId);
        addFavoriteId(result.recipeId); // Update context
        console.log('Recipe automatically added to favorites');
      } catch (favoriteError) {
        console.error('Failed to add recipe to favorites:', favoriteError);
        // Continue even if adding to favorites fails
      }
      
      // Reset form after successful submission
      setFormData({
        title: '',
        description: '',
        ingredients: '',
        steps: '',
        prep_time: 15,
        cook_time: 30,
        total_time: 45,
        difficulty: 'Medium',
        servings: 4,
        meal_type: 'Dinner'
      });
      setImagePreview(null);

      // Navigate to the created recipe after a delay to show success message
      setTimeout(() => {
        // Navigate to the recipe details page
        onBack(); // This would ideally navigate to the new recipe instead of going back
      }, 2000);

    } catch (err) {
      console.error('Error creating recipe:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      setError('Failed to create recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`create-recipe-container ${theme === 'dark' ? 'theme-dark' : ''}`}>
      <div className="page-header">
        <button className="back-button" onClick={onBack}>← Back</button>
        <h1>Create a New Recipe</h1>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="recipe-form">
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="title">Recipe Name <span className="required">*</span></label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Spaghetti Carbonara"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of the recipe"
              rows={3}
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="recipe-image">Recipe Image</label>
            <div className="image-upload-container">
              {imagePreview ? (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Recipe preview" className="image-preview" />
                  <button 
                    type="button" 
                    className="remove-image-btn" 
                    onClick={handleRemoveImage}
                    aria-label="Remove image"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="image-upload-placeholder">
                  <input
                    type="file"
                    id="recipe-image"
                    ref={fileInputRef}
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleImageChange}
                    className="image-upload-input"
                  />
                  <label htmlFor="recipe-image" className="image-upload-label">
                    <div className="upload-icon">📷</div>
                    <span>Click to upload image</span>
                    <small className="help-text">JPEG, JPG, or PNG (max 3MB)</small>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label htmlFor="ingredients">Ingredients <span className="required">*</span></label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleInputChange}
              placeholder="Comma-separated list of ingredients, e.g., pasta, eggs, pancetta, cheese"
              rows={4}
              required
            />
            <small className="help-text">Enter ingredients separated by commas</small>
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label htmlFor="steps">Preparation Steps <span className="required">*</span></label>
            <textarea
              id="steps"
              name="steps"
              value={formData.steps}
              onChange={handleInputChange}
              placeholder="Enter each step separated by commas, e.g., Heat oil in a large pan, Scramble eggs and set aside, Sauté diced carrots"
              rows={6}
              required
            />
            <small className="help-text">Each preparation step should be separated by a comma (not periods or line breaks)</small>
          </div>
        </div>

        <div className="form-section">
          <h3>Recipe Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prep_time">Prep Time (minutes)</label>
              <input
                type="number"
                id="prep_time"
                name="prep_time"
                value={formData.prep_time}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="cook_time">Cook Time (minutes)</label>
              <input
                type="number"
                id="cook_time"
                name="cook_time"
                value={formData.cook_time}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="difficulty">Difficulty</label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="servings">Servings</label>
              <input
                type="number"
                id="servings"
                name="servings"
                value={formData.servings}
                onChange={handleInputChange}
                min="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="meal_type">Meal Type</label>
              <select
                id="meal_type"
                name="meal_type"
                value={formData.meal_type}
                onChange={handleInputChange}
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="best_time">Best Time</label>
              <select
                id="best_time"
                name="best_time"
                value={formData.best_time || ''}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onBack} className="cancel-button">Cancel</button>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Creating...' : 'Create Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRecipe; 