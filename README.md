# Recipe Search Application

A lightweight React-based web application that helps users find recipes based on available ingredients.

## Features

- **Recipe Search**: Search for recipes based on available ingredients
- **Clean, Minimalist UI**: Focus on simplicity and ease of use

## Project Structure

The project is organized with a scalable architecture to support future growth:

```
/
├── client/                  # Frontend code
│   ├── public/              # Static files
│   │   ├── index.html:      # Main HTML file
│   │   ├── favicon.ico:     # Website favicon
│   │   ├── manifest.json:   # Web app manifest for PWA support
│   │   └── robots.txt:      # Instructions for web crawlers
│   ├── src/
│   │   ├── assets/          # Images, fonts, etc.
│   │   ├── components/      # Reusable UI components
│   │   │   ├── common/      # Truly reusable components
│   │   │   │   └── SearchBar/  # Search input component
│   │   │   ├── layout/      # Layout components
│   │   │   │   ├── Navbar/  # Navigation bar component
│   │   │   │   └── Footer/  # Footer component
│   │   │   └── features/    # Feature-specific components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   │   └── Home/        # Home page
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

## Future Enhancements

- Backend API integration for recipe data
- User authentication and profile management
- Recipe saving and favorites
- Meal planning functionality