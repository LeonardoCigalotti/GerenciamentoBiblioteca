const Sequelize = require("sequelize");
const conn = require("../database/database");
const User = require("../users/User");

const Books = conn.define('books', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false
  },
  body: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

User.hasMany(Books); 
Books.belongsTo(User);

Books.sync({force: false});
module.exports = Books;