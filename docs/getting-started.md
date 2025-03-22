# Getting Started Guide

This guide will help new developers get up and running with the Recipe Search Application codebase.

## Overview

The Recipe Search Application is a full-stack web application that allows users to:
- Search for recipes based on ingredients they have
- View recipe details including ingredients
- Register and log in (authentication system)
- (Future) Save favorite recipes

The application consists of:
- Frontend: React (TypeScript) with custom components
- Backend: Express.js REST API
- Database: PostgreSQL with Sequelize ORM

## Prerequisites

Before you start, make sure you have the following installed:

- Node.js (v14+) and npm (v6+)
- PostgreSQL (v12+)
- Git

## Setup Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cpsc449-cooking-assistant
```

### 2. Set Up the Database

Follow the instructions in the [Database Setup Guide](database-setup.md) to:
- Install PostgreSQL (if not already installed)
- Create the `recipe_db` database
- Configure the database connection

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```
PORT=3001
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=recipe_db
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your-secret-key-for-jwt-tokens
```

Replace `your_postgres_password` with your actual PostgreSQL password.

### 4. Install Dependencies

Install both frontend and backend dependencies:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 5. Seed the Database

Populate the database with initial test data:

```bash
cd ../backend
npm run seed
```

You should see output indicating successful creation of ingredients and recipes.

### 6. Start the Development Servers

Start both the backend and frontend servers:

```bash
# Start the backend server (in backend directory)
npm run dev

# In a new terminal, start the frontend server
cd ../client
npm start
```

The frontend will be available at [http://localhost:3000](http://localhost:3000).
The backend API will be accessible at [http://localhost:3001/api](http://localhost:3001/api).

## Project Structure

### Frontend (`client/`)

The frontend follows a component-based architecture with these key directories:

- `src/components/` - Reusable UI components
- `src/pages/` - Page components
- `src/contexts/` - React context providers
- `src/services/` - API service functions

Key files to understand:
- `src/App.tsx` - Main application component with routing
- `src/services/recipeService.ts` - API client for recipe endpoints
- `src/pages/Home/Home.tsx` - Home page component
- `src/pages/SearchResults/SearchResults.tsx` - Search results page

### Backend (`backend/`)

The backend follows a standard Express.js structure:

- `src/models/` - Sequelize database models
- `src/controllers/` - Request handlers
- `src/routes/` - API endpoint definitions
- `src/config/` - Configuration files

Key files to understand:
- `server.js` - Express application entry point
- `src/models/Recipe.js` - Recipe database model
- `src/controllers/recipeController.js` - Recipe API controllers
- `seeders/recipeSeeder.js` - Database seed script

## Development Workflow

1. **Understanding the Requirements**: Read through the README.md for project goals.

2. **Make Changes**:
   - For frontend changes, work in the `client/` directory
   - For backend changes, work in the `backend/` directory
   - Keep changes focused and related to a specific feature or fix

3. **Testing Your Changes**:
   - Manually test both the frontend and backend
   - Check for console errors
   - Verify database operations are working correctly

4. **Commit Your Changes**:
   - Write clear, descriptive commit messages
   - Group related changes in a single commit

## API Documentation

For details on available API endpoints and how to use them, refer to the [API Documentation](api-documentation.md).

## Common Tasks

### Adding a New API Endpoint

1. Create a controller function in the appropriate controller file in `backend/src/controllers/`
2. Add the route in the appropriate router file in `backend/src/routes/`
3. Import and use the router in `server.js` if it's a new router

### Adding a New Frontend Page

1. Create a new directory in `client/src/pages/`
2. Create the component files (TSX and CSS)
3. Add the page to the routing in `App.tsx`

### Adding a New Database Model

1. Create a model file in `backend/src/models/`
2. Define relationships in the model file
3. Update `backend/src/models/index.js` if needed

## Troubleshooting

### Backend Issues

- **Database Connection Errors**: Check your `.env` file and PostgreSQL service status
- **API Endpoints Not Working**: Verify routes are correctly defined and controllers are exported

### Frontend Issues

- **API Calls Failing**: Check the console for CORS errors or backend connection issues
- **Components Not Rendering**: Verify the component is correctly imported and used

For more specific database troubleshooting, see the [Database Setup Guide](database-setup.md).

## Next Steps

After setting up the project, you might want to:

1. Explore the existing code to understand the application structure
2. Run the app and test the recipe search functionality
3. Check the current API endpoints by referring to the [API Documentation](api-documentation.md)
4. Look at the planned enhancements in the README.md to understand future directions

## Additional Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Express.js Documentation](https://expressjs.com/)
- [Sequelize Documentation](https://sequelize.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/) 