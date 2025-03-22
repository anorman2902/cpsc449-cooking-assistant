# Documentation

This directory contains comprehensive documentation for the Recipe Search Application.

## Available Documentation

- [Getting Started Guide](getting-started.md) - A guide for new developers to set up the project
- [Database Setup](database-setup.md) - Instructions for setting up and configuring PostgreSQL
- [API Documentation](api-documentation.md) - Details of all API endpoints and how to use them
- [Authentication Documentation](authentication.md) - Information about the authentication system
- [Search Results Template](search-results-template.md) - Documentation for the search results page template

## Project Overview

The Recipe Search Application is a full-stack web application built with:

- Frontend: React (TypeScript)
- Backend: Express.js (Node.js)
- Database: PostgreSQL (Sequelize ORM)

The application allows users to search for recipes based on available ingredients, view recipe details, and (in the future) save their favorite recipes.

## Key Features

- Search recipes by name or ingredient
- View recipe details including ingredients
- User authentication (registration and login)
- Responsive design for all device sizes

## Architecture

The application follows a standard client-server architecture:

- **Client**: React frontend serving the user interface
- **API Server**: Express.js backend providing REST endpoints
- **Database**: PostgreSQL storing recipes, ingredients, and user data

## Setup Quick Reference

1. Install prerequisites (Node.js, PostgreSQL)
2. Clone the repository
3. Set up PostgreSQL database (`recipe_db`)
4. Configure environment variables in `.env`
5. Install dependencies (`npm install` in both client and backend directories)
6. Seed the database (`npm run seed` in backend directory)
7. Start development servers (`npm run dev` for backend, `npm start` for client)

For detailed setup instructions, see the [Getting Started Guide](getting-started.md).

## Contact

For questions or help, please contact the project maintainers. 