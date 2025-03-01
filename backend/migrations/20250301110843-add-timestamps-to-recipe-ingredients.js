'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('RecipeIngredients', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
    await queryInterface.addColumn('RecipeIngredients', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('RecipeIngredients', 'createdAt');
    await queryInterface.removeColumn('RecipeIngredients', 'updatedAt');
  }
};
