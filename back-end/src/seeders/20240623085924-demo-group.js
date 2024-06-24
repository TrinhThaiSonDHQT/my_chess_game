'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /*
     * Add seed commands here.
     */
    await queryInterface.bulkInsert(
      'Groups',
      [
        {
          name: 'admin',
          description: 'Administrator',
        },
        {
          name: 'dev',
          description: 'Developer',
        },
        {
          name: 'user',
          description: 'User',
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
