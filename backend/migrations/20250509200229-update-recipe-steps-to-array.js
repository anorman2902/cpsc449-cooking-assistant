'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First, get all recipes to process their steps
    const recipes = await queryInterface.sequelize.query(
      'SELECT id, steps FROM "Recipes"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Process each recipe to update its steps format
    for (const recipe of recipes) {
      let formattedSteps = '';

      // Check what format the steps are in
      if (recipe.steps.includes('\\n') || recipe.steps.includes('\n') || recipe.steps.includes('[') || recipe.steps.includes('"')) {
        // For steps with newlines or formatting, convert to comma-separated
        // Remove quotes and brackets
        let cleanedSteps = recipe.steps.replace(/^\["|"\]$/g, '');
        
        // Split on newlines (both escaped and actual)
        let stepsArray = cleanedSteps.split(/\\n|[\n\r]+/);
        
        // Clean each step and join with commas
        formattedSteps = stepsArray
          .map(step => step.replace(/^["']|["']$/g, '').replace(/^\d+\.\s*/, '').trim())
          .filter(step => step) // Remove empty steps
          .join(', ');
      } else {
        // Already in comma-separated format, just clean it up
        formattedSteps = recipe.steps
          .split(',')
          .map(step => step.replace(/^\d+\.\s*/, '').trim())
          .filter(step => step)
          .join(', ');
      }

      // Update the recipe with the new steps format
      await queryInterface.sequelize.query(
        'UPDATE "Recipes" SET steps = :steps WHERE id = :id',
        {
          replacements: { steps: formattedSteps, id: recipe.id },
          type: Sequelize.QueryTypes.UPDATE
        }
      );
    }
  },

  async down(queryInterface, Sequelize) {
    // We can't easily restore the original formatting, but we could convert commas to newlines
    const recipes = await queryInterface.sequelize.query(
      'SELECT id, steps FROM "Recipes"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    for (const recipe of recipes) {
      // Convert comma-separated to numbered steps with newlines
      const stepsArray = recipe.steps.split(',').map(s => s.trim()).filter(s => s);
      const numberedSteps = stepsArray
        .map((step, index) => `${index + 1}. ${step}`)
        .join('\n');

      await queryInterface.sequelize.query(
        'UPDATE "Recipes" SET steps = :steps WHERE id = :id',
        {
          replacements: { steps: numberedSteps, id: recipe.id },
          type: Sequelize.QueryTypes.UPDATE
        }
      );
    }
  }
};
