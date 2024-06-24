'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_Game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User_Game.init({
    id_user: DataTypes.INTEGER,
    id_game: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User_Game',
  });
  return User_Game;
};