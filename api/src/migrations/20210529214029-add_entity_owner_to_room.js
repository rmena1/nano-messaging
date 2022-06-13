module.exports = {
  /**
   * @typedef {import('sequelize').Sequelize} Sequelize
   * @typedef {import('sequelize').QueryInterface} QueryInterface
   */

  /**
   * @param {QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   * @returns
   */
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'Rooms',
      'entity_owner',
      {
        type: Sequelize.UUID(4),
      },
    );
  },

  /**
   * @param {QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   * @returns
   */
  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'Rooms',
      'entity_owner',
    );
  },
};
