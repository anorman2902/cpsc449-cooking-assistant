# Recipe Search Application

A lightweight React-based web application that helps users find recipes based on available ingredients.

## Features

- **Recipe Search**: Search for recipes based on available ingredients
- **Search Results Template**: Template page for displaying search results
- **Clean, Minimalist UI**: Focus on simplicity and ease of use
- **Responsive Design**: Optimized for all device sizes

## Project Structure

The project is organized with a scalable architecture to support future growth:

```
/
├── client/                  # Frontend code
│   ├── docs/                # Documentation
│   │   └── search-results-template.md  # Search results template documentation
│   │   └── README.md        # README for docs
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
│   │   │   └── ThemeContext/  # Theme management context
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   │   ├── Home/        # Home page
│   │   │   ├── About/       # About page
│   │   │   └── SearchResults/  # Search results page
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   ├── styles/          # Global styles
│   │   ├── App.tsx          # Main App component
│   │   └── index.tsx        # Entry point
│   ├── package.json         # Frontend dependencies
│   └── tsconfig.json        # TypeScript config
└── server/                  # Backend code (for future)
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
cd client
npm install
```

4. Start the development server:

```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Implementation Details

- **React State Management**: Uses React's useState hook for managing component state
- **Component-Based Architecture**: Modular components for better maintainability
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Scalable Project Structure**: Organized for future growth with additional pages and backend
- **Simple Routing**: State-based routing for navigation between pages

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

The search results page is currently implemented as a template that will be populated with actual data when the backend is implemented. See the [search results template documentation](client/docs/search-results-template.md) for details on how to use and extend this template.

## Future Enhancements

- **Backend API Integration**: Connect to a recipe database API
- **User Authentication**: Login, registration, and profile management
- **Recipe Management**: Save favorites, add notes, and customize recipes
- **Advanced Search**: Filtering by cuisine, cooking time, and difficulty
- **Meal Planning**: Weekly meal planning and shopping list generation
- **Personalization**: Recommendations based on user preferences and history
- **Social Features**: Share recipes and follow other users

For detailed information about planned enhancements to the search results page, see the [search results template documentation](client/docs/search-results-template.md).