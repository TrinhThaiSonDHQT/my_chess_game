'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Games', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_user1: {
        type: Sequelize.INTEGER
      },
      id_user2: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING
      },
      amount_of_moves: {
        type: Sequelize.INTEGER
      },
      moves: {
        type: Sequelize.STRING
      },
      time: {
        type: Sequelize.TIME
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Games');
  }
};