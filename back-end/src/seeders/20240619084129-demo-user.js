'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /*
     * Add seed commands here.
     */
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          user_name: 'Thai Son',
          email: 'ttsondhqt@gmail.com',
          password: '123456',
          id_group: 1,
          nationality: 'Viet Nam',
          elo: 2300
        },
        {
          user_name: 'Thai Son 2',
          email: 'ttson2dhqt@gmail.com',
          password: '123456',
          id_group: 3,
          nationality: 'Viet Nam',
          elo: 1965
        },
        {
          user_name: 'Thai Son 3',
          email: 'ttson3dhqt@gmail.com',
          password: '123456',
          id_group: 3,
          nationality: 'Viet Nam',
          elo: 2003
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
