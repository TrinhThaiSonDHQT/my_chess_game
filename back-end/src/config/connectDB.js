const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('my_chess_game', 'root', null, {
  host: 'localhost',
  dialect: 'mysql',
});

const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to DB has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export default connection;
