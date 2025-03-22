require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const { Sequelize } = require('sequelize');

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

module.exports = sequelize;
