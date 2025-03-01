const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Ingredient = sequelize.define('Ingredient', {
    id: { type: DataTypes.UUID,defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: {type: DataTypes.STRING, allowNULL: false, unique: true},
    unit: {type: DataTypes.STRING, allowNULL: false},
    calories: {type: DataTypes.INTEGER, allowNULL: true},
}, { timestamps: true });

module.exports = Ingredient;