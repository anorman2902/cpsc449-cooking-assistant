'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RecipeIngredients', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      recipe_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Recipes', key: 'id' },
        onDelete: 'CASCADE',
      },
      ingredient_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Ingredients', key: 'id' },
        onDelete: 'CASCADE',
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {  // ✅ Add timestamps if missing
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {  // ✅ Add timestamps if missing
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('RecipeIngredients');
  }
};
