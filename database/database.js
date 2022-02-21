const Sequelize = require("sequelize");

const conn = new Sequelize('biblioteca', 'root', 'root',{
  host: 'localhost',
  dialect: 'mysql',
  timezone: "-03:00"
});

module.exports = conn;