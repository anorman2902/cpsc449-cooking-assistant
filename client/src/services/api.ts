/**
 * API Service
 * 
 * Handles all API requests to the backend server.
 * Manages authentication headers and request formatting.
 */

// Base API URL - Need to update this to match backend
const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Get authentication headers for API requests
 * 
 * @param {string | null} token - JWT token for authentication
 * @returns {Object} Headers object with Authorization if token exists
 */
const getAuthHeaders = (token: string | null) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * API request error class
 */
export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Handle API response
 * 
 * @param {Response} response - Fetch API response object
 * @returns {Promise<any>} Parsed response data
 * @throws {ApiError} If response is not OK
 */
const handleResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new ApiError(
      data.message || 'An error occurred',
      response.status
    );
  }
  
  return data;
};

/**
 * Authentication API methods
 */
export const authApi = {
  /**
   * Login user with email and password
   * 
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<{user: any, token: string}>} User data and JWT token
   */
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getAuthHeaders(null),
        body: JSON.stringify({ email, password }),
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },
  
  /**
   * Register a new user
   * 
   * @param {string} username - User's username
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<{user: any, token: string}>} User data and JWT token
   */
  signup: async (username: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: getAuthHeaders(null),
        body: JSON.stringify({ username, email, password }),
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Signup API error:', error);
      throw error;
    }
  },
  
  /**
   * Verify JWT token with the backend
   * 
   * @param {string} token - JWT token to verify
   * @returns {Promise<{user: any}>} User data if token is valid
   */
  verifyToken: async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Token verification API error:', error);
      throw error;
    }
  },
};

/**
 * User API methods
 */
export const userApi = {
  /**
   * Get current user's profile
   * 
   * @param {string} token - JWT token for authentication
   * @returns {Promise<any>} User profile data
   */
  getProfile: async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Get profile API error:', error);
      throw error;
    }
  },
  
  /**
   * Update user profile
   * 
   * @param {string} token - JWT token for authentication
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<any>} Updated user profile
   */
  updateProfile: async (token: string, profileData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(profileData),
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Update profile API error:', error);
      throw error;
    }
  },
};

/**
 * Recipe API methods (extend as needed)
 */
export const recipeApi = {
  /**
   * Search for recipes by ingredients
   * 
   * @param {string} query - Search query string
   * @param {string | null} token - Optional JWT token for personalized results
   * @returns {Promise<any>} Search results
   */
  searchByIngredients: async (query: string, token: string | null = null) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/search?ingredients=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Recipe search API error:', error);
      throw error;
    }
  },
};