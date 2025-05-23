import { ApiError } from './api'; 
import { Recipe } from './recipeService';

interface User {
    id: string;
    username: string;
    email: string;
}

const API_BASE_URL = 'http://localhost:3001/api';

// Helper to create headers
const getAuthHeaders = (token: string | null) => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

// Helper to handle response
const handleResponse = async (response: Response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new ApiError(data.message || 'An error occurred', response.status);
    }
    return data;
};


export const favoriteApi = {
  getFavorites: async (token: string): Promise<Recipe[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me/favorites`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });
      // Use the handleResponse helper
      return handleResponse(response);
    } catch (error) {
      console.error('Get favorites API error:', error);
      // Handle specific ApiError or re-throw generic
      if (error instanceof ApiError) {
          // handle specific statuses
      }
      throw error;
    }
  },

  addFavorite: async (token: string, recipeId: string): Promise<{ message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me/favorites`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ recipeId }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Add favorite API error:', error);
      throw error;
    }
  },

  removeFavorite: async (token: string, recipeId: string): Promise<{ message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me/favorites/${recipeId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Remove favorite API error:', error);
      throw error;
    }
  },
};

export const profileApi = {
    getProfile: async (token: string): Promise<User> => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/me`, {
                method: 'GET',
                headers: getAuthHeaders(token),
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Get profile API error:', error);
            throw error;
        }
    },

    updateProfile: async (token: string, profileData: { username: string }): Promise<{ message: string, user: User }> => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/me`, {
                method: 'PUT',
                headers: getAuthHeaders(token),
                body: JSON.stringify(profileData), // Send only username
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Update profile API error:', error);
            throw error;
        }
    },
};