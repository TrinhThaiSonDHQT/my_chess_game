'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /*
     * Add seed commands here.
     */
    await queryInterface.bulkInsert(
      'Group_Roles',
      [
        {
          id_group: 1,
          id_role: 1,
        },
        {
          id_group: 1,
          id_role: 2,
        },
        {
          id_group: 1,
          id_role: 3,
        },
        {
          id_group: 1,
          id_role: 4,
        },
        {
          id_group: 2,
          id_role: 1,
        },
        {
          id_group: 2,
          id_role: 4,
        },
        {
          id_group: 3,
          id_role: 4,
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
