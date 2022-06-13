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
      'Room_permissions',
      'accepted',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'Room_permissions',
      'accepted',
    );
  },
};
