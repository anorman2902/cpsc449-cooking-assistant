'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Recipes', 'prep_time', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });

    await queryInterface.addColumn('Recipes', 'cook_time', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });

    await queryInterface.addColumn('Recipes', 'total_time', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });

    await queryInterface.addColumn('Recipes', 'difficulty', {
      type: Sequelize.ENUM('Easy', 'Medium', 'Hard'),
      allowNull: false,
      defaultValue: 'Medium'
    });

    await queryInterface.addColumn('Recipes', 'servings', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    });

    await queryInterface.addColumn('Recipes', 'meal_type', {
      type: Sequelize.ENUM('Breakfast', 'Lunch', 'Dinner', 'Snack'),
      allowNull: false,
      defaultValue: 'Dinner'
    });

    await queryInterface.addColumn('Recipes', 'best_time', {
      type: Sequelize.ENUM('Morning', 'Afternoon', 'Evening'),
      allowNull: false,
      defaultValue: 'Evening'
    });

    await queryInterface.addColumn('Recipes', 'image_url', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Recipes', 'prep_time');
    await queryInterface.removeColumn('Recipes', 'cook_time');
    await queryInterface.removeColumn('Recipes', 'total_time');
    await queryInterface.removeColumn('Recipes', 'difficulty');
    await queryInterface.removeColumn('Recipes', 'servings');
    await queryInterface.removeColumn('Recipes', 'meal_type');
    await queryInterface.removeColumn('Recipes', 'best_time');
    await queryInterface.removeColumn('Recipes', 'image_url');
  }
};
