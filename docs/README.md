# Documentation

This directory contains comprehensive documentation for the Recipe Finder application.

## Available Documentation

| Document | Description |
|----------|-------------|
| [ai-insights.md](ai-insights.md) | Implementation details for AI-generated recipe insights using OpenAI |
| [recipe-creation.md](recipe-creation.md) | Guide for implementing the recipe creation feature with AI insights integration |
| [image-handling.md](image-handling.md) | Complete guide for managing recipe images throughout the application |
| [authentication.md](authentication.md) | Details on the authentication system implementation |
| [search-results-template.md](search-results-template.md) | Usage guide for the search results template |
| [database-setup.md](database-setup.md) | Comprehensive guide for setting up, migrating, and seeding the PostgreSQL database |

## How to Use This Documentation

Each document is self-contained and focuses on a specific aspect of the application. The documents include:

- Conceptual explanations
- Implementation details
- Code examples
- Configuration guidelines
- Troubleshooting tips

## Maintaining Documentation

When updating the application, please ensure the documentation is kept up-to-date:

1. When making significant changes to a feature, update the corresponding documentation
2. Keep code examples current with the actual implementation
3. Add new documentation files for new major features

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
- AI-generated insights for each recipe
- Responsive design for all device sizes

## Architecture

The application follows a standard client-server architecture:

- **Client**: React frontend serving the user interface
- **API Server**: Express.js backend providing REST endpoints
- **Database**: PostgreSQL storing recipes, ingredients, and user data
- **AI Integration**: OpenAI API for generating recipe insights

## Setup Quick Reference

1. Install prerequisites (Node.js, PostgreSQL)
2. Clone the repository
3. Set up PostgreSQL database (`recipe_db`)
4. Configure environment variables in `.env` (including OpenAI API key)
5. Install dependencies (`npm install` in both client and backend directories)
6. Seed the database (`npm run seed` in backend directory)
7. Start development servers (`npm run dev` for backend, `npm start` for client)

For detailed setup instructions, see the [Getting Started Guide](getting-started.md).

## Contact

For questions or help, please contact the project maintainers. 