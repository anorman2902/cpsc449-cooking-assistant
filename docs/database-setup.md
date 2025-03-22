# Database Setup Guide

This guide provides detailed instructions for setting up the PostgreSQL database required for the Recipe Search Application.

## Prerequisites

- PostgreSQL 12 or later installed on your system
- Basic knowledge of SQL commands and database concepts

## Installation

### Windows

1. Download the PostgreSQL installer from the [official website](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the installation wizard
3. When prompted, set a password for the postgres user (remember this password)
4. Keep the default port (5432)
5. Complete the installation

### macOS

Option 1: Using Homebrew
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install PostgreSQL
brew install postgresql

# Start PostgreSQL service
brew services start postgresql
```

Option 2: Using the installer from the [official website](https://www.postgresql.org/download/macosx/)

### Linux (Ubuntu/Debian)

```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Database Creation

1. Connect to PostgreSQL as the postgres user:

```bash
# Windows
psql -U postgres

# macOS
psql postgres

# Linux
sudo -u postgres psql
```

2. Create the database:

```sql
CREATE DATABASE recipe_db;
```

3. Verify the database was created:

```sql
\l
```

4. Exit the PostgreSQL prompt:

```sql
\q
```

## Project Configuration

1. Create a `.env` file in the `backend` directory with the following content:

```
PORT=3001
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=recipe_db
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your-secret-key-for-jwt-tokens
```

Replace `your_postgres_password` with the password you set during PostgreSQL installation.

2. Make sure the database configuration in `backend/src/config/db.js` matches your environment variables:

```javascript
const sequelize = new Sequelize(
    process.env.DB_NAME || 'recipe_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        port: process.env.DB_PORT || 5432,
        logging: false
    }
);
```

## Seeding the Database

To populate the database with initial recipe and ingredient data, run:

```bash
cd backend
npm run seed
```

This command executes the `tempSeed.js` script, which creates:
- 12 sample ingredients (Chicken, Rice, Tomato, etc.)
- 6 sample recipes (Classic Spaghetti, Chicken Rice Bowl, etc.)
- Relationships between recipes and their ingredients

You should see console output indicating successful creation of the data.

## Database Schema

The application uses the following database models:

1. **Recipe**
   - `id`: UUID (primary key)
   - `title`: String (recipe name)
   - `description`: Text (recipe description)
   - `steps`: Text (cooking instructions)
   - `user_id`: UUID (foreign key to User, optional)

2. **Ingredient**
   - `id`: UUID (primary key)
   - `name`: String (ingredient name)
   - `unit`: String (measurement unit)
   - `calories`: Integer (caloric content)

3. **RecipeIngredient** (junction table)
   - `id`: UUID (primary key)
   - `recipe_id`: UUID (foreign key to Recipe)
   - `ingredient_id`: UUID (foreign key to Ingredient)
   - `quantity`: Float (amount of ingredient)

4. **User**
   - `id`: UUID (primary key)
   - `username`: String
   - `email`: String
   - `password`: String (hashed)

## Troubleshooting

### Connection Issues

1. **"password authentication failed for user"**
   - Verify the password in your `.env` file matches your PostgreSQL password
   - Restart the backend server after updating the `.env` file

2. **"could not connect to server"**
   - Ensure PostgreSQL service is running:
     - Windows: Check Services application
     - macOS: `brew services list`
     - Linux: `sudo systemctl status postgresql`

3. **"database does not exist"**
   - Connect to PostgreSQL and create the database:
     ```sql
     CREATE DATABASE recipe_db;
     ```

### Seeding Issues

1. **Transaction errors**
   - Ensure your database is properly set up
   - Check if tables already exist with conflicting data

2. **Module not found errors**
   - Make sure all dependencies are installed: `npm install`

3. **Permission errors**
   - Check your PostgreSQL role permissions
   - Verify file permissions for the seeder script

## Viewing Database Content

You can use a database management tool like [pgAdmin](https://www.pgadmin.org/) or [DBeaver](https://dbeaver.io/) to view and manage your PostgreSQL database.

Alternatively, you can use the PostgreSQL command line:

```bash
# Connect to the database
psql -U postgres recipe_db

# List all tables
\dt

# View recipes
SELECT * FROM "Recipes";

# View ingredients
SELECT * FROM "Ingredients";

# View recipe-ingredient relationships
SELECT * FROM "RecipeIngredients";
``` 