module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Rooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        allowNull: false,
        allowEmpty: false,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        type: Sequelize.UUID,
      },
      name: {
        allowNull: false,
        allowEmpty: false,
        type: Sequelize.STRING,
      },
      level_admin: {
        allowNull: false,
        default: 100,
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Rooms');
  },
};
