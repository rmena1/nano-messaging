const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Room.init({
    uuid: DataTypes.UUID,
    name: DataTypes.STRING,
    entity_owner: DataTypes.UUID,
    level_admin: DataTypes.INTEGER,
    type: DataTypes.STRING,
    max_entity_rules: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};
