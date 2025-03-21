# Authentication System Implementation

## Overview

Implemented an authentication system that allows users to sign up, log in, view their profile, and log out. The implementation uses JWT authentication, password hashing, and React Context for state management.

## Features Implemented

### Frontend

- Combined Login/Signup page with toggle functionality
- Authentication state management using React Context
- Persistent login using `localStorage`
- Protected routes requiring authentication
- Dynamic navbar that changes based on auth state
- User profile page with avatar and logout functionality

### Backend

- User authentication API endpoints (signup, login, token verification)
- JWT token implementation for secure authentication
- Password hashing with bcrypt for security
- User model integration with PostgreSQL database
- Authentication middleware for protected routes

## Technical Details

### Key Files Added/Modified

#### Frontend

- `client/src/contexts/AuthContext.tsx` — Authentication state management
- `client/src/services/api.ts` — API service for authentication requests
- `client/src/pages/Auth/Auth.tsx` & `Auth.css` — Login/Signup page
- `client/src/pages/Profile/Profile.tsx` & `Profile.css` — User profile page
- `client/src/components/layout/Navbar/Navbar.tsx` — Updated with auth integration
- `client/src/App.tsx` — Updated with protected routes and auth context

#### Backend

- `backend/src/controllers/authController.js` — Authentication logic
- `backend/src/middleware/authMiddleware.js` — JWT verification middleware
- `backend/src/routes/authRoutes.js` — Authentication endpoints
- `backend/server.js` — Server setup with auth routes
- `backend/.env` — Configuration file for environment variables

## How to Use

### First time Setup Instructions

#### 1. Database Setup

    # Create the database
    sudo -u postgres psql -c "CREATE DATABASE smart_cooking;"

#### 2. Backend Configuration

    # Create .env file in backend directory
    cd backend
    touch .env

Add environment variables to `.env`:

    PORT=3001
    JWT_SECRET=your_secure_jwt_secret_key
    DB_NAME=smart_cooking
    DB_USER=postgres
    DB_PASS=350015
    DB_HOST=localhost
    DB_PORT=5432

#### 3. Run Migrations

    cd backend
    npx sequelize-cli db:migrate

### Development Testing

#### 1. Start PostgreSQL (if not already running)
    sudo service postgresql status
    # If not running: sudo service postgresql start

#### 2. Start Servers
    # Start backend
    cd backend
    npm start

    # Start frontend (in another terminal)
    cd client
    npm start

### Testing Authentication

-   **Create Account:** Click "Login/Signup" and use the Sign Up tab
-   **Login:** Use your credentials in the Login tab
-   **View Profile:** Click on "Profile" when logged in
-   **Logout:** Click "Logout" button in the navbar or profile page

### Implementation Notes

-   **Security:** Passwords are hashed using bcrypt before storing in the database
-   **Token Management:** JWTs are stored in localStorage and automatically included in authenticated requests
-   **State Management:** React Context API is used to manage auth state application-wide
-   **Error Handling:** Form validation occurs on both client and server sides