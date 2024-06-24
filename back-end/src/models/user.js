'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Group, { foreignKey: 'id_group' });
      User.belongsToMany(models.Game, { through: 'User_Game' });
    }
  }
  User.init(
    {
      user_name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      id_group: DataTypes.INTEGER,
      nationality: DataTypes.STRING,
      elo: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
