# API Documentation

This document provides a comprehensive guide to the Recipe Search Application API endpoints, their parameters, and example responses.

## Base URL

All API endpoints are relative to:

```
http://localhost:3001/api
```

## Authentication Endpoints

### Register User

Registers a new user in the system.

- **URL:** `/auth/register`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Request Body:**

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login User

Authenticates a user and returns a JWT token.

- **URL:** `/auth/login`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Recipe Endpoints

### Get All Recipes

Retrieves a list of all recipes in the database.

- **URL:** `/recipes`
- **Method:** `GET`
- **Authentication:** Optional

**Response:**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "Classic Spaghetti",
    "Ingredients": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440010",
        "name": "Pasta"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440011",
        "name": "Tomato"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440012",
        "name": "Garlic"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440013",
        "name": "Onion"
      }
    ]
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "title": "Chicken Rice Bowl",
    "Ingredients": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440014",
        "name": "Chicken"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440015",
        "name": "Rice"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440016",
        "name": "Bell Pepper"
      }
    ]
  }
]
```

### Search Recipes

Searches for recipes by name or ingredient.

- **URL:** `/recipes/search/:query`
- **Method:** `GET`
- **Authentication:** Optional

**URL Parameters:**

- `query`: The search term to look for in recipe titles or ingredient names

**Example Request:**

```
GET /api/recipes/search/chicken
```

**Response:**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "title": "Chicken Rice Bowl",
    "Ingredients": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440014",
        "name": "Chicken"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440015",
        "name": "Rice"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440016",
        "name": "Bell Pepper"
      }
    ]
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440006",
    "title": "Chicken Stir Fry",
    "Ingredients": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440014",
        "name": "Chicken"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440016",
        "name": "Bell Pepper"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440013",
        "name": "Onion"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440012",
        "name": "Garlic"
      }
    ]
  }
]
```

## Test Endpoint

A simple endpoint to test if the API is working.

- **URL:** `/test`
- **Method:** `GET`
- **Authentication:** None

**Response:**

```json
{
  "message": "API working!"
}
```

## Error Responses

The API uses standard HTTP status codes to indicate the success or failure of a request.

### Common Error Responses

#### 400 Bad Request

Returned when the request is malformed or missing required data.

```json
{
  "message": "Search query is required"
}
```

#### 401 Unauthorized

Returned when authentication is required but not provided or invalid.

```json
{
  "message": "Authentication required"
}
```

#### 404 Not Found

Returned when the requested resource doesn't exist.

```json
{
  "message": "Recipe not found"
}
```

#### 500 Server Error

Returned when an unexpected error occurs on the server.

```json
{
  "message": "Server error"
}
```

## Using the API in JavaScript

Here's an example of how to interact with the API using JavaScript's fetch API:

```javascript
// Get all recipes
async function getAllRecipes() {
  try {
    const response = await fetch('http://localhost:3001/api/recipes');
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

// Search recipes
async function searchRecipes(query) {
  try {
    const response = await fetch(`http://localhost:3001/api/recipes/search/${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching recipes:', error);
    return [];
  }
}
```

## Authentication Flow

To use protected endpoints, you need to:

1. Register a user or login to get a JWT token
2. Include the token in subsequent requests in the Authorization header:

```javascript
// Login example
async function login(email, password) {
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Store the token for later use
    localStorage.setItem('token', data.token);
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Using the token in subsequent requests
async function getProtectedResource() {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:3001/api/protected-endpoint', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching protected resource:', error);
    throw error;
  }
} 