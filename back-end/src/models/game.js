'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Game.belongsToMany(models.User, { through: 'User_Game' });
    }
  }
  Game.init({
    id_user1: DataTypes.INTEGER,
    id_user2: DataTypes.INTEGER,
    type: DataTypes.STRING,
    amount_of_moves: DataTypes.INTEGER,
    moves: DataTypes.STRING,
    time: DataTypes.TIME
  }, {
    sequelize,
    modelName: 'Game',
  });
  return Game;
};