module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Room_permissions', {
      room_id: {
        allowNull: false,
        allowEmpty: false,
        primaryKey: true,
        onDelete: 'cascade',
        references: {
          model: 'Rooms',
          key: 'id',
        },
        type: Sequelize.INTEGER,
      },
      entity_UUID: {
        allowNull: false,
        allowEmpty: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      level: {
        allowNull: false,
        allowEmpty: false,
        type: Sequelize.INTEGER,
      },
      permissions: {
        allowNull: false,
        default: '',
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
    await queryInterface.dropTable('Room_permissions');
  },
};
