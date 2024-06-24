'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /*
     * Add seed commands here.
     */
    await queryInterface.bulkInsert(
      'Roles',
      [
        {
          name: 'add user',
          description: 'add more user',
        },
        {
          name: 'update user',
          description: 'update user',
        },
        {
          name: 'delete user',
          description: 'delete user',
        },
        {
          name: 'view user',
          description: 'view user',
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
