# Recipe Search Application

A lightweight React-based web application that helps users find recipes based on available ingredients.

## Features

- **Recipe Search**: Search for recipes based on available ingredients
- **Search Results Template**: Template page for displaying search results
- **Clean, Minimalist UI**: Focus on simplicity and ease of use
- **Responsive Design**: Optimized for all device sizes
- **Backend API**: REST API for recipes and ingredients
- **Database Integration**: PostgreSQL storage for recipes and ingredients

## Project Structure

The project is organized with a scalable architecture to support future growth:

```
/
├── docs/                    # Project documentation
│   ├── authentication.md    # Authentication system documentation
│   ├── search-results-template.md # Search results template documentation
│   └── README.md            # README for docs
├── client/                  # Frontend code
│   ├── public/              # Static files
│   │   ├── index.html       # Main HTML file
│   │   ├── favicon.ico      # Website favicon
│   │   ├── manifest.json    # Web app manifest for PWA support
│   │   └── robots.txt       # Instructions for web crawlers
│   ├── src/
│   │   ├── assets/          # Images, fonts, etc.
│   │   ├── components/      # Reusable UI components
│   │   │   ├── common/      # Truly reusable components
│   │   │   │   └── SearchBar/  # Search input component
│   │   │   ├── layout/      # Layout components
│   │   │   │   ├── Navbar/  # Navigation bar component
│   │   │   │   └── Footer/  # Footer component
│   │   │   └── features/    # Feature-specific components
│   │   ├── contexts/        # React context providers
│   │   │   ├── AuthContext/ # Authentication management context
│   │   │   └── ThemeContext/ # Theme management context
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   │   ├── Home/        # Home page
│   │   │   ├── About/       # About page
│   │   │   ├── Auth/        # Login/SignUp pages
│   │   │   ├── Profile/     # Profile page
│   │   │   └── SearchResults/  # Search results page
│   │   ├── services/        # API services
│   │   │   └── recipeService.ts  # Recipe API service
│   │   ├── utils/           # Utility functions
│   │   ├── styles/          # Global styles
│   │   ├── App.tsx          # Main App component
│   │   └── index.tsx        # Entry point
│   ├── package.json         # Frontend dependencies
│   └── tsconfig.json        # TypeScript config
├── backend/                 # Backend code
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   │   └── db.js        # Database configuration
│   │   ├── controllers/     # Request handlers
│   │   │   ├── authController.js    # Authentication controller
│   │   │   └── recipeController.js  # Recipe controller
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Database models
│   │   │   ├── Recipe.js            # Recipe model
│   │   │   ├── Ingredient.js        # Ingredient model
│   │   │   └── RecipeIngredient.js  # Join table model
│   │   └── routes/          # API routes
│   │       ├── authRoutes.js        # Authentication routes
│   │       └── recipeRoutes.js      # Recipe routes
│   ├── seeders/             # Database seeders
│   │   └── recipeSeeder.js  # Recipe and ingredient seeder
│   ├── .env                 # Environment variables
│   ├── server.js            # Express server
│   └── package.json         # Backend dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- PostgreSQL (v12 or later)

### Database Setup

1. Install PostgreSQL if you haven't already from [the official website](https://www.postgresql.org/download/)

2. Create a new database:
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create the database
   CREATE DATABASE recipe_db;
   
   # Exit
   \q
   ```

3. Configure database connection:
   Create a `.env` file in the `backend` directory with the following content:
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

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
# Install client dependencies
cd client && npm install

# Install backend dependencies
cd backend && npm install
```

4. Seed the database with initial recipe data:
```bash
cd backend && npm run seed
```

5. Start the development servers:

```bash
# Start backend server
cd backend && npm run dev

# Start frontend dev server (in a new terminal)
cd client && npm start
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

The backend provides the following API endpoints:

- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/search/:query` - Search recipes by name or ingredient
- `GET /api/test` - Test endpoint to check if API is working
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login an existing user

## Implementation Details

- **React State Management**: Uses React's useState hook for managing component state
- **Component-Based Architecture**: Modular components for better maintainability
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Scalable Project Structure**: Organized for future growth with additional pages and backend
- **Simple Routing**: State-based routing for navigation between pages
- **PostgreSQL Database**: Stores recipes, ingredients, and users
- **RESTful API**: Express.js backend with well-defined endpoints
- **Sequelize ORM**: Database models and relationships

## Project Organization

The project follows a professional organization pattern:

- **Component Organization**: Components are organized by their purpose:
  - `common/`: Reusable UI components that can be used across multiple features
  - `layout/`: Components that define the overall layout structure
  - `features/`: Components specific to particular features

- **Page-Based Structure**: Each page has its own directory with related files:
  - Component file (e.g., `Home.tsx`)
  - Styles (e.g., `Home.css`)
  - Index file for clean imports

- **Frontend/Backend Separation**: Clear separation between client and server code

- **Documentation**: Comprehensive documentation in the `docs` directory:
  - Template usage guides
  - Future enhancement plans
  - Implementation details

## Search Functionality

The application includes a search feature that allows users to:

1. Enter ingredients they have or want to use
2. Specify dietary restrictions or allergies
3. Submit their search query
4. View search results on a dedicated results page

The search results page displays matching recipes from the database based on the search query.

### Authentication System

The application includes a complete authentication system with:

-   User registration and login
-   JWT-based authentication
-   Protected routes
-   User profiles

For detailed information on the authentication implementation, see the [Authentication Documentation](./docs/AUTHENTICATION.md).

## Troubleshooting

If you encounter issues with the application, try the following:

1. **Database Connection Issues**:
   - Ensure PostgreSQL is running
   - Verify your database credentials in the `.env` file
   - Make sure the `recipe_db` database exists

2. **No Recipes Displayed**:
   - Check if the seeder ran successfully (`npm run seed`)
   - Check the backend logs for any errors
   - Ensure the backend server is running on port 3001

3. **Frontend Issues**:
   - Clear browser cache and reload
   - Check console for any JavaScript errors
   - Verify the frontend is configured to connect to http://localhost:3001/api

## Future Enhancements

- **Backend API Integration**: Connect to a recipe database API
- **Recipe Management**: Save favorites, add notes, and customize recipes
- **Advanced Search**: Filtering by cuisine, cooking time, and difficulty
- **Meal Planning**: Weekly meal planning and shopping list generation
- **Personalization**: Recommendations based on user preferences and history
- **Social Features**: Share recipes and follow other users

For detailed information about planned enhancements to the search results page, see the [search results template documentation](client/docs/search-results-template.md).