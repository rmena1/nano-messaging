const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Room_permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Room_permission.init({
    room_id: DataTypes.INTEGER,
    entity_UUID: DataTypes.UUID,
    level: DataTypes.INTEGER,
    permissions: DataTypes.STRING,
    kind: DataTypes.STRING,
    accepted: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Room_permission',
  });
  Room_permission.removeAttribute('id');
  return Room_permission;
};
