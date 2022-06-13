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
      'max_entity_rules',
      {
        allowNull: false,
        defaultValue: 10,
        type: Sequelize.INTEGER,
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
      'max_entity_rules',
    );
  },
};
