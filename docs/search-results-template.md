# Search Results Template Documentation

## Overview

The Search Results page is a template designed to display recipe search results based on user queries. It provides a foundation for displaying search results when the backend functionality is implemented. This document outlines the structure, components, and future enhancement possibilities for the search results page.

## Current Implementation

### Page Structure

The search results page is structured with the following main sections:

1. **Header Section**
   - Title ("Search Results")
   - Search bar for refining searches
   - Query summary showing what was searched for

2. **Content Section**
   - Placeholder for recipe cards
   - Grid layout for displaying multiple results
   - Visual placeholders showing how actual results will appear

3. **Filters Section**
   - Sidebar with filter categories
   - Placeholder filter options for dietary restrictions, meal types, and cooking time
   - Responsive design that moves to the top on mobile devices (did not check this)

### Components Used

- **SearchBar**: Reused from the home page to allow users to refine their search
- **Placeholder Recipe Cards**: Visual representation of how actual recipe cards will appear

### User Flow

1. User enters ingredients on the home page
2. User submits the search (presses Enter)
3. App navigates to the search results page
4. Search results page displays the query and placeholder results
5. User can refine their search using the search bar at the top, which is pre-populated with their previous search query

### User Experience Features

- **Pre-populated Search Bar**: The search bar on the results page is pre-populated with the user's previous search query, allowing them to easily refine their search by editing the existing text rather than typing everything from scratch
- **Responsive Layout**: The page layout adjusts based on screen size for optimal viewing on all devices
- **Visual Feedback**: Clear indication of the current search query being displayed

## How to Use This Template

### Adding Real Data

When the backend is implemented, you'll need to:

1. Replace the placeholder recipe cards with actual data:

```typescript
// Replace this:
<div className="mock-results-grid">
  {[1, 2, 3, 4, 5, 6].map((item) => (
    <div key={item} className="recipe-card-placeholder">
      {/* Placeholder content */}
    </div>
  ))}
</div>

// With something like this:
<div className="results-grid">
  {recipes.map((recipe) => (
    <RecipeCard 
      key={recipe.id}
      title={recipe.title}
      image={recipe.image}
      cookingTime={recipe.cookingTime}
      rating={recipe.rating}
      ingredients={recipe.ingredients}
    />
  ))}
</div>
```

2. Implement the filter functionality:

```typescript
// Add state for filters
const [filters, setFilters] = useState({
  dietary: [],
  mealType: [],
  cookingTime: []
});

// Add handler for filter changes
const handleFilterChange = (category, value) => {
  setFilters(prev => ({
    ...prev,
    [category]: prev[category].includes(value)
      ? prev[category].filter(item => item !== value)
      : [...prev[category], value]
  }));
};
```

3. Connect to the backend API:

```typescript
// Add effect to fetch results when query or filters change
useEffect(() => {
  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await api.searchRecipes(query, filters);
      setRecipes(response.data);
    } catch (error) {
      setError('Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };
  
  fetchResults();
}, [query, filters]);
```

### Styling Customization

The template uses CSS variables for easy theming. You can customize the appearance by modifying these variables in your root CSS:

```css
:root {
  --heading-color: #333;
  --text-color: #555;
  --accent-color: #e67e22;
  --card-bg: #f9f9f9;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 6px 16px rgba(0, 0, 0, 0.18);
  --border-color: #e0e0e0;
}
```

## Future Enhancements

### 1. Recipe Cards

- **Rich Media**: Add support for multiple images, video previews
- **Interactive Elements**: Add hover states with quick actions (save, share) (show more details)
- **Match Indicators**: Visual indicators showing how well a recipe matches the search query (percentage match)
- **Nutrition Information**: Display calorie count and macronutrient breakdown, time to prepare, and serving size

### 2. Filter System

- **Active Filters**: Display currently active filters with easy removal (checkboxes)
- **Clear All Filters**: Clear all filters button
- **Filter Combinations**: Support for complex filter combinations
- **Save Filter Presets**: Allow users to save their favorite filter combinations

### 3. Search Functionality

- **Autocomplete**: Ingredient suggestions as users type (if given time)
- **Search History**: Track and display recent searches
- **Voice Search**: Add support for voice input
- **Advanced Search**: Add support for advanced search options (e.g. "I have 10 minutes and want to make a quick meal") or exclude certain ingredients like "I don't like onions"

### 4. Results Management

- **Pagination**: Add controls for navigating through large result sets
- **Sorting Options**: Allow sorting by relevance, rating, cooking time, etc.
- **Infinite Scroll**: Alternative to pagination for smoother browsing
- **Result Grouping**: Group results by categories or meal types

### 5. User Interaction

- **Quick Preview**: Modal view for recipe details without leaving the results page
- **Save to Collection**: Allow users to organize recipes into collections
- **Social Sharing**: Integrate with social media platforms
- **Save for Later**: Allow users to save recipes for later
- **Print/Export**: Generate printer-friendly versions or export to PDF

### 6. Performance Optimizations

- **Lazy Loading**: Load images and content as they come into view
- **Result Caching**: Store recent search results for faster access
- **Progressive Loading**: Show essential information first, then load details
- **Offline Support**: Cache results for offline browsing

### 7. Personalization

- **Personalized Ranking**: Order results based on user preferences
- **Dietary Profile**: Automatically filter based on saved dietary preferences
- **Cooking Skill Level**: Adjust recipe suggestions based on user skill level
- **Seasonal Recommendations**: Highlight recipes using in-season ingredients

## Technical Considerations

### Accessibility

- Ensure all interactive elements are keyboard accessible
- Add proper ARIA labels for screen readers
- Maintain sufficient color contrast for readability
- Support text resizing without breaking layouts

### Performance

- Optimize image loading and rendering
- Minimize JavaScript bundle size
- Implement code splitting for faster initial load
- Use virtualization for large result sets

### Mobile Optimization

- Test on various device sizes and orientations
- Ensure touch targets are appropriately sized
- Optimize for limited bandwidth scenarios
- Consider native-like interactions for mobile users