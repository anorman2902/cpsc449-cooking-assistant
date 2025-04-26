'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Recipes', 'source_recipe_id', {
      type: Sequelize.UUID,
      allowNull: true, // Allow null for original recipes
      references: {
        model: 'Recipes', // Self-reference to the same table
        key: 'id',
      },
      onUpdate: 'SET NULL', 
      onDelete: 'SET NULL',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Recipes', 'source_recipe_id');
  }
};
